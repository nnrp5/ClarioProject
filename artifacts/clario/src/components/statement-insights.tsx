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
import { useLanguage } from '@/components/language-provider';
import {
  formatArabicNumber,
  formatStatementMoney,
  useStatementAnalysis,
  type CurrencyCode,
} from '@/components/statement-analysis-provider';
import type { StatementTransaction } from '@/lib/statement-analysis';
import { formatLocaleNumber } from '@/lib/localization';
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
  language: 'ar' | 'en',
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
    label: `${language === 'ar' ? 'أسبوع' : 'Week'} ${formatArabicNumber(week, 0, language)}`,
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
  const { language, t } = useLanguage();
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
        language,
        convertBetween,
      ),
    [analysis.transactions, statementCurrency, currency, language, convertBetween],
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
          { label: language === 'ar' ? '١٢ شهر' : '12 months', amount: monthlySurplus * 12 },
          { label: language === 'ar' ? '٦ أشهر' : '6 months', amount: monthlySurplus * 6 },
          { label: language === 'ar' ? 'شهرين' : '2 months', amount: monthlySurplus * 2 },
          { label: language === 'ar' ? 'الحين' : 'Now', amount: 0 },
        ];
  const currentLabel = language === 'ar' ? 'الحين' : 'Now';
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
      aria-label={t('توزيع المصاريف والتوقع المالي')}
    >
      <article className="statement-insight-card">
        <header className="statement-insight-header">
          <div>
            <span className="statement-insight-kicker">{t('آخر ٤ أسابيع من الكشف')}</span>
            <h3>{t('متى تصرف أكثر؟')}</h3>
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
              aria-label={language === 'ar'
                ? `إجمالي المصاريف بآخر أربعة أسابيع ${formatStatementMoney(weeklySpending.totalAmount, currency, language)}. أعلى صرف في ${weeklySpending.highestWeek}.`
                : `Total expenses over the last four weeks: ${formatStatementMoney(weeklySpending.totalAmount, currency, language)}. Highest spending was in ${weeklySpending.highestWeek}.`}
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
                      formatStatementMoney(Number(value ?? 0), currency, language)
                    }
                  />
                  <Bar
                    dataKey="amount"
                    name={t('المصاريف')}
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
                          ? formatArabicNumber(Number(value), 0, language)
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
                {formatLocaleNumber(weeklySpending.highestShare, language)}{language === 'ar' ? '٪' : '%'} {t('من مصاريف الفترة كانت في')}{' '}
                <strong>{weeklySpending.highestWeek}</strong>.
              </span>
            </div>
          </>
        ) : (
          <div className="statement-insight-empty" role="status">
            {weeklySpending.state === 'no-conversion'
              ? t('تعذر تحويل المصاريف إلى العملة المختارة حاليًا.')
              : weeklySpending.state === 'no-spending'
                ? t('ما ظهرت مصاريف مؤرخة في آخر أربعة أسابيع من الكشف.')
                : t('ما لقينا تواريخ كافية في الكشف لعرض الصرف حسب الأسابيع.')}
          </div>
        )}
      </article>

      <article className="statement-insight-card statement-insight-card--forecast">
        <header className="statement-insight-header">
          <div>
            <span className="statement-insight-kicker">{t('توقع تقديري')}</span>
            <h3>{t('لو استمريت بنفس الوتيرة')}</h3>
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
                : formatStatementMoney(Math.abs(annualProjection), currency, language)}
            </strong>
            <span>
              {annualProjection === null
                ? t('التوقع غير متاح بهذه العملة')
                : annualProjection < 0
                  ? t('عجز تراكمي محتمل خلال سنة')
                  : t('فائض محتمل خلال سنة')}
            </span>
          </div>
          <p>
            على متوسط{' '}
            <b>
              {monthlySurplus === null
                ? '—'
                : formatStatementMoney(Math.abs(monthlySurplus), currency, language)}
            </b>{' '}
            {monthlySurplus !== null && monthlySurplus < 0
              ? t('عجز')
              : t('فائض')}{' '}
            {t('شهري.')}
          </p>
        </div>

        {monthlySurplus !== null ? (
          <div
            className="statement-insight-chart statement-insight-chart--forecast"
            role="img"
            aria-label={language === 'ar'
              ? `توقع خطي للفائض خلال ١٢ شهرًا. ${datedTransactions ? 'مبني على تواريخ الكشف.' : 'يفترض أن الكشف يمثل شهرًا واحدًا.'}`
              : `Projected surplus over 12 months. ${datedTransactions ? 'Based on statement dates.' : 'Assumes the statement represents one month.'}`}
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
                  x={currentLabel}
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
                      formatStatementMoney(Number(value ?? 0), currency, language)
                    }
                />
                <Area
                  dataKey="amount"
                  name={t('التقدير')}
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
            {t('ما توفرت أسعار تحويل كافية لعرض التوقع بهذه العملة.')}
          </div>
        )}

        <p className="statement-forecast-disclaimer">
          {datedTransactions
            ? t('يفترض ثبات متوسط الفائض، ولا يتوقع تغير الدخل أو المصروفات.')
            : t('تواريخ الكشف غير واضحة؛ التقدير يفترض أن الكشف يمثل شهرًا واحدًا.')}
        </p>
      </article>
    </section>
  );
}
