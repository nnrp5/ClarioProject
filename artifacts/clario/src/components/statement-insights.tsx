import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Lightbulb, TrendingDown, TrendingUp } from 'lucide-react';
import {
  formatArabicNumber,
  formatStatementMoney,
  useStatementAnalysis,
  type CurrencyCode,
} from '@/components/statement-analysis-provider';
import type { StatementTransaction } from '@/lib/statement-analysis';
import './statement-insights.css';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;
const DAYS_PER_FOUR_WEEKS = DAYS_PER_WEEK * 4;
const SPENDING_COLORS = {
  regular: '#1F74AD',
  highest: '#E98E2E',
};

type WeeklySpendingPoint = {
  week: number;
  label: string;
  rawAmount: number;
  amount: number;
};

type WeeklySpendingResult = {
  state: 'ready' | 'no-dates' | 'no-spending' | 'no-conversion';
  data: WeeklySpendingPoint[];
  totalAmount: number;
  highestWeek: string;
  highestShare: number;
};

function buildWeeklySpending(
  transactions: StatementTransaction[],
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  convertBetween: (
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
  ) => number | null,
): WeeklySpendingResult {
  const datedTransactions = transactions.filter(
    (item) => item.date instanceof Date && Number.isFinite(item.date.getTime()),
  );
  const datedExpenses = datedTransactions.filter((item) => item.amount < 0);

  if (datedTransactions.length === 0 || datedExpenses.length === 0) {
    return {
      state: 'no-dates',
      data: [],
      totalAmount: 0,
      highestWeek: '',
      highestShare: 0,
    };
  }

  const latestTime = Math.max(
    ...datedTransactions.map((item) => item.date!.getTime()),
  );
  const rawData = [4, 3, 2, 1].map((week) => ({
    week,
    label: `أسبوع ${formatArabicNumber(week)}`,
    rawAmount: 0,
  }));

  for (const item of datedExpenses) {
    const daysBeforeLatest = (latestTime - item.date!.getTime()) / DAY_IN_MS;
    if (daysBeforeLatest < 0 || daysBeforeLatest >= DAYS_PER_FOUR_WEEKS) continue;
    const week = Math.floor(daysBeforeLatest / DAYS_PER_WEEK) + 1;
    const point = rawData.find((entry) => entry.week === week);
    if (point) point.rawAmount += Math.abs(item.amount);
  }

  const totalRawAmount = rawData.reduce((sum, point) => sum + point.rawAmount, 0);
  if (totalRawAmount === 0) {
    return {
      state: 'no-spending',
      data: [],
      totalAmount: 0,
      highestWeek: '',
      highestShare: 0,
    };
  }

  const conversionFactor = convertBetween(1, fromCurrency, toCurrency);
  if (conversionFactor === null) {
    return {
      state: 'no-conversion',
      data: [],
      totalAmount: 0,
      highestWeek: '',
      highestShare: 0,
    };
  }

  const data = rawData.map((point) => ({
    ...point,
    amount: point.rawAmount * conversionFactor,
  }));
  const highestPoint = rawData.reduce((highest, point) =>
    point.rawAmount > highest.rawAmount ? point : highest,
  );

  return {
    state: 'ready',
    data,
    totalAmount: totalRawAmount * conversionFactor,
    highestWeek: highestPoint.label,
    highestShare: Math.round((highestPoint.rawAmount / totalRawAmount) * 100),
  };
}

export default function StatementInsights() {
  const {
    analysis,
    isSample,
    currency,
    statementCurrency,
    convertBetween,
  } = useStatementAnalysis();

  const weeklySpending = useMemo(
    () =>
      buildWeeklySpending(
        analysis.transactions,
        statementCurrency,
        currency,
        convertBetween,
      ),
    [analysis.transactions, statementCurrency, currency, convertBetween],
  );
  const monthlySurplus = convertBetween(
    analysis.monthlySurplus,
    statementCurrency,
    currency,
  );
  const annualProjection =
    monthlySurplus === null ? null : monthlySurplus * 12;
  const datedTransactions = analysis.transactions.some(
    (item) => item.date instanceof Date && Number.isFinite(item.date.getTime()),
  );
  const projectionData =
    monthlySurplus === null
      ? []
      : [
          { label: '١٢ شهر', amount: monthlySurplus * 12 },
          { label: '٦ أشهر', amount: monthlySurplus * 6 },
          { label: 'شهرين', amount: monthlySurplus * 2 },
          { label: 'الحين', amount: 0 },
        ];
  const projectionColor =
    monthlySurplus === null
      ? '#61A9BD'
      : monthlySurplus > 0
        ? '#44986D'
        : monthlySurplus < 0
          ? '#D8524F'
          : '#61A9BD';

  const highestAmount = Math.max(
    0,
    ...weeklySpending.data.map((point) => point.amount),
  );
  const highestIndex = weeklySpending.data.findIndex(
    (point) => point.amount === highestAmount && point.amount > 0,
  );

  return (
    <section
      className="statement-insights"
      aria-label="توزيع المصاريف والتوقع المالي"
    >
      <article className="statement-insight-card">
        <header className="statement-insight-header">
          <div>
            <span className="statement-insight-kicker">آخر ٤ أسابيع من الكشف</span>
            <h3>متى تصرف أكثر؟</h3>
          </div>
          {!isSample && (
            <span className="statement-insight-badge">من كشفك</span>
          )}
        </header>

        {weeklySpending.state === 'ready' ? (
          <>
            <div
              className="statement-insight-chart"
              role="img"
              aria-label={`إجمالي المصاريف بآخر أربعة أسابيع ${formatStatementMoney(weeklySpending.totalAmount, currency)}. أعلى صرف في ${weeklySpending.highestWeek}.`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklySpending.data}
                  margin={{ top: 18, right: 4, left: 4, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(214, 225, 238, .11)"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#aebacc', fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis hide domain={[0, 'dataMax']} />
                  <Tooltip
                    cursor={{ fill: 'rgba(214, 225, 238, .06)' }}
                    contentStyle={{
                      background: '#0f1d32',
                      border: '1px solid rgba(214, 225, 238, .2)',
                      borderRadius: 10,
                      color: '#f4f7fb',
                    }}
                    labelStyle={{ color: '#cbd5e1' }}
                    formatter={(value) =>
                      formatStatementMoney(Number(value ?? 0), currency)
                    }
                  />
                  <Bar
                    dataKey="amount"
                    name="المصاريف"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={64}
                  >
                    <LabelList
                      dataKey="amount"
                      position="top"
                      fill="#cbd5e1"
                      fontSize={11}
                      formatter={(value: unknown) =>
                        Number(value) > 0
                          ? formatArabicNumber(Number(value))
                          : ''
                      }
                    />
                    {weeklySpending.data.map((point, index) => (
                      <Cell
                        key={point.week}
                        fill={
                          index === highestIndex
                            ? SPENDING_COLORS.highest
                            : SPENDING_COLORS.regular
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="statement-insight-note">
              <Lightbulb size={17} aria-hidden="true" />
              <span>
                {weeklySpending.highestShare}٪ من مصاريف الفترة كانت في{' '}
                <strong>{weeklySpending.highestWeek}</strong>.
              </span>
            </div>
          </>
        ) : (
          <div className="statement-insight-empty" role="status">
            {weeklySpending.state === 'no-conversion'
              ? 'تعذر تحويل المصاريف إلى العملة المختارة حاليًا.'
              : weeklySpending.state === 'no-spending'
                ? 'ما ظهرت مصاريف مؤرخة في آخر أربعة أسابيع من الكشف.'
                : 'ما لقينا تواريخ كافية في الكشف لعرض الصرف حسب الأسابيع.'}
          </div>
        )}
      </article>

      <article className="statement-insight-card statement-insight-card--forecast">
        <header className="statement-insight-header">
          <div>
            <span className="statement-insight-kicker">توقع تقديري</span>
            <h3>لو استمريت بنفس الوتيرة</h3>
          </div>
          <span className="statement-insight-forecast-icon" aria-hidden="true">
            {monthlySurplus !== null && monthlySurplus < 0 ? (
              <TrendingDown size={17} />
            ) : (
              <TrendingUp size={17} />
            )}
          </span>
        </header>

        <div className="statement-forecast-summary">
          <div>
            <strong className={monthlySurplus !== null && monthlySurplus < 0 ? 'is-negative' : 'is-positive'}>
              {annualProjection === null
                ? '—'
                : formatStatementMoney(Math.abs(annualProjection), currency)}
            </strong>
            <span>
              {annualProjection === null
                ? 'التوقع غير متاح بهذه العملة'
                : annualProjection < 0
                  ? 'عجز تراكمي محتمل خلال سنة'
                  : 'فائض محتمل خلال سنة'}
            </span>
          </div>
          <p>
            على متوسط{' '}
            <b>
              {monthlySurplus === null
                ? '—'
                : formatStatementMoney(Math.abs(monthlySurplus), currency)}
            </b>{' '}
            {monthlySurplus !== null && monthlySurplus < 0
              ? 'عجز'
              : 'فائض'}{' '}
            شهري.
          </p>
        </div>

        {monthlySurplus !== null ? (
          <div
            className="statement-insight-chart statement-insight-chart--forecast"
            role="img"
            aria-label={`توقع خطي للفائض خلال ١٢ شهرًا. ${datedTransactions ? 'مبني على تواريخ الكشف.' : 'يفترض أن الكشف يمثل شهرًا واحدًا.'}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={projectionData}
                margin={{ top: 14, right: 4, left: 4, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(214, 225, 238, .11)"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#aebacc', fontSize: 11 }}
                  interval={0}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <ReferenceLine
                  x="الحين"
                  stroke="rgba(214, 225, 238, .32)"
                  strokeDasharray="3 4"
                />
                <ReferenceLine
                  y={0}
                  stroke="rgba(214, 225, 238, .3)"
                />
                <Tooltip
                  cursor={{ stroke: 'rgba(214, 225, 238, .28)' }}
                  contentStyle={{
                    background: '#0f1d32',
                    border: '1px solid rgba(214, 225, 238, .2)',
                    borderRadius: 10,
                    color: '#f4f7fb',
                  }}
                  labelStyle={{ color: '#cbd5e1' }}
                  formatter={(value) =>
                    formatStatementMoney(Number(value ?? 0), currency)
                  }
                />
                <Area
                  dataKey="amount"
                  name="التقدير"
                  type="monotone"
                  baseValue={0}
                  stroke={projectionColor}
                  strokeWidth={3}
                  strokeDasharray="6 5"
                  fill={projectionColor}
                  fillOpacity={0.16}
                  dot={{ r: 3, fill: projectionColor, stroke: '#11223a', strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="statement-insight-empty" role="status">
            ما توفرت أسعار تحويل كافية لعرض التوقع بهذه العملة.
          </div>
        )}

        <p className="statement-forecast-disclaimer">
          {datedTransactions
            ? 'يفترض ثبات متوسط الفائض، ولا يتوقع تغير الدخل أو المصروفات.'
            : 'تواريخ الكشف غير واضحة؛ التقدير يفترض أن الكشف يمثل شهرًا واحدًا.'}
        </p>
      </article>
    </section>
  );
}
