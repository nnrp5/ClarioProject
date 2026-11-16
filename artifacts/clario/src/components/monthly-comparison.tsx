import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Info,
  Minus,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import {
  formatStatementMoney,
  useStatementAnalysis,
} from '@/components/statement-analysis-provider';
import { categoryLabel } from '@/lib/statement-analysis';
import {
  buildCategoryChanges,
  buildStatementMonths,
  type StatementMonth,
} from '@/lib/monthly-comparison';
import './monthly-comparison.css';

type MetricKind = 'income' | 'expenses' | 'remaining';

function monthLabel(month: StatementMonth, language: 'ar' | 'en') {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-KW' : 'en-KW', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(month.year, month.monthIndex, 1));
}

function deltaTone(delta: number, kind: MetricKind) {
  if (Math.abs(delta) < 0.005) return 'neutral';
  const positiveIsGood = kind !== 'expenses';
  return (delta > 0) === positiveIsGood ? 'good' : 'bad';
}

export default function MonthlyComparison({
  isHome = false,
}: {
  isHome?: boolean;
}) {
  const { language, t } = useLanguage();
  const {
    analysis,
    currency,
    statementCurrency,
    convertBetween,
  } = useStatementAnalysis();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedEarlierMonth, setSelectedEarlierMonth] = useState('');
  const [selectedLaterMonth, setSelectedLaterMonth] = useState('');

  const months = useMemo(
    () => buildStatementMonths(analysis.transactions),
    [analysis.transactions],
  );

  const defaultLaterMonth = months.at(-1)?.key ?? '';
  const defaultEarlierMonth = months.at(-2)?.key ?? '';
  const laterMonthKey =
    selectedLaterMonth && months.some((month) => month.key === selectedLaterMonth)
      ? selectedLaterMonth
      : defaultLaterMonth;
  const earlierMonthKey =
    selectedEarlierMonth &&
    selectedEarlierMonth !== laterMonthKey &&
    months.some((month) => month.key === selectedEarlierMonth)
      ? selectedEarlierMonth
      : months.find(
          (month) =>
            month.key === defaultEarlierMonth && month.key !== laterMonthKey,
        )?.key ??
        months.find((month) => month.key !== laterMonthKey)?.key ??
        '';

  const earlierMonth = months.find((month) => month.key === earlierMonthKey);
  const laterMonth = months.find((month) => month.key === laterMonthKey);
  const categoryChanges = useMemo(
    () =>
      earlierMonth && laterMonth
        ? buildCategoryChanges(earlierMonth, laterMonth)
        : [],
    [earlierMonth, laterMonth],
  );

  const conversionAvailable =
    convertBetween(1, statementCurrency, currency) !== null;
  const toDisplayMoney = (amount: number) => {
    const converted = convertBetween(amount, statementCurrency, currency);
    return converted === null
      ? '—'
      : formatStatementMoney(converted, currency, language);
  };

  const expenseChange =
    earlierMonth && laterMonth
      ? laterMonth.expenses - earlierMonth.expenses
      : 0;
  const largestCategoryChange = categoryChanges[0];
  const maxCategoryChange = Math.max(
    0,
    ...categoryChanges.map((change) => Math.abs(change.amount)),
  );

  function formatExpenseSummary() {
    if (!earlierMonth || !laterMonth) return '';
    if (Math.abs(expenseChange) < 0.005) {
      return language === 'ar'
        ? 'مصاريف الشهرين متقاربة.'
        : 'Spending was similar in both months.';
    }

    const amount = toDisplayMoney(Math.abs(expenseChange));
    const previousLabel = monthLabel(earlierMonth, language);
    const category = largestCategoryChange
      ? t(categoryLabel(largestCategoryChange.category))
      : '';

    if (language === 'ar') {
      return `صرفت ${amount} ${expenseChange > 0 ? 'أكثر' : 'أقل'} من ${previousLabel}${category ? `، وأكبر تغير في ${category}` : ''}.`;
    }
    return `You spent ${amount} ${expenseChange > 0 ? 'more' : 'less'} than ${previousLabel}${category ? `, with the largest change in ${category}` : ''}.`;
  }

  function renderMetricDelta(
    delta: number,
    kind: MetricKind,
    isComparable = true,
  ) {
    if (!isComparable) {
      return (
        <span className="monthly-comparison__delta is-neutral">
          {t('لا توجد إيداعات مسجلة')}
        </span>
      );
    }
    const tone = deltaTone(delta, kind);
    const Icon = delta > 0.005 ? ArrowUp : delta < -0.005 ? ArrowDown : Minus;
    if (Math.abs(delta) < 0.005) {
      return (
        <span className={`monthly-comparison__delta is-${tone}`}>
          <Minus size={13} aria-hidden="true" />
          {t('ثابت')}
        </span>
      );
    }
    return (
      <span className={`monthly-comparison__delta is-${tone}`}>
        <Icon size={13} aria-hidden="true" />
        {toDisplayMoney(Math.abs(delta))} {t(delta > 0 ? 'أكثر' : 'أقل')}
      </span>
    );
  }

  return (
    <section
      className="monthly-comparison"
      aria-label={t('مقارنة المصاريف بين شهرين')}
      data-testid="monthly-comparison"
    >
      <button
        type="button"
        className="monthly-comparison__toggle"
        aria-expanded={isOpen}
        aria-controls="monthly-comparison-panel"
        onClick={() => setIsOpen((open) => !open)}
        data-testid="button-monthly-comparison"
      >
        <span className="monthly-comparison__toggle-icon" aria-hidden="true">
          <CalendarDays size={18} />
        </span>
        <span>{t('قارن مع الشهر اللي قبل')}</span>
        {isOpen ? (
          <ChevronUp size={18} aria-hidden="true" />
        ) : (
          <ChevronDown size={18} aria-hidden="true" />
        )}
      </button>

      <div
        className="monthly-comparison__panel"
        id="monthly-comparison-panel"
        hidden={!isOpen}
      >
        <div className="monthly-comparison__header">
          <div className="monthly-comparison__title">
            <span className="monthly-comparison__kicker">
              <CalendarDays size={15} aria-hidden="true" />
              {t('مقارنة حسب الحركات المؤرخة')}
            </span>
            <h3>{t('قارن بين شهرين')}</h3>
          </div>

          {months.length >= 2 && (
            <div className="monthly-comparison__selectors">
              <label>
                <span>{t('الشهر الأقدم')}</span>
                <select
                  value={earlierMonthKey}
                  onChange={(event) =>
                    setSelectedEarlierMonth(event.target.value)
                  }
                  aria-label={t('الشهر الأقدم')}
                >
                  {months.map((month) => (
                    <option
                      key={month.key}
                      value={month.key}
                      disabled={month.key === laterMonthKey}
                    >
                      {monthLabel(month, language)}
                    </option>
                  ))}
                </select>
              </label>
              <span className="monthly-comparison__selector-arrow" aria-hidden="true">↔</span>
              <label>
                <span>{t('الشهر الأحدث')}</span>
                <select
                  value={laterMonthKey}
                  onChange={(event) =>
                    setSelectedLaterMonth(event.target.value)
                  }
                  aria-label={t('الشهر الأحدث')}
                >
                  {months.map((month) => (
                    <option
                      key={month.key}
                      value={month.key}
                      disabled={month.key === earlierMonthKey}
                    >
                      {monthLabel(month, language)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>

        {months.length < 2 || !earlierMonth || !laterMonth ? (
          <div className="monthly-comparison__empty" role="status">
            <Info size={18} aria-hidden="true" />
            <div>
              <strong>{t('نحتاج شهرين مختلفين للمقارنة')}</strong>
              <p>{t('ارفع كشفًا فيه معاملات مؤرخة من شهرين مختلفين لتظهر المقارنة.')}</p>
            </div>
          </div>
        ) : !conversionAvailable ? (
          <div className="monthly-comparison__empty" role="status">
            <Info size={18} aria-hidden="true" />
            <strong>{t('تعذر تحويل العملة المختارة لعرض المقارنة.')}</strong>
          </div>
        ) : (
          <>
            <p className="monthly-comparison__summary">{formatExpenseSummary()}</p>

            <div className="monthly-comparison__metrics">
              <article>
                <span>{t('الدخل')}</span>
                <strong>
                  {laterMonth.incomeTransactionCount > 0
                    ? toDisplayMoney(laterMonth.income)
                    : '—'}
                </strong>
                {renderMetricDelta(
                  laterMonth.income - earlierMonth.income,
                  'income',
                  earlierMonth.incomeTransactionCount > 0 &&
                    laterMonth.incomeTransactionCount > 0,
                )}
              </article>
              <article>
                <span>{t('المصاريف')}</span>
                <strong>{toDisplayMoney(laterMonth.expenses)}</strong>
                {renderMetricDelta(
                  laterMonth.expenses - earlierMonth.expenses,
                  'expenses',
                )}
              </article>
              <article>
                <span>{t('المتبقي')}</span>
                <strong>
                  {laterMonth.incomeTransactionCount > 0
                    ? toDisplayMoney(laterMonth.net)
                    : '—'}
                </strong>
                {renderMetricDelta(
                  laterMonth.net - earlierMonth.net,
                  'remaining',
                  earlierMonth.incomeTransactionCount > 0 &&
                    laterMonth.incomeTransactionCount > 0,
                )}
              </article>
            </div>

            <div className="monthly-comparison__category-section">
              <h4>{t('وين تغير صرفك؟')}</h4>
              {categoryChanges.length > 0 ? (
                <ul className="monthly-comparison__categories">
                  {categoryChanges.map((change) => (
                    <li
                      className={
                        change.amount > 0
                          ? 'is-increase'
                          : 'is-decrease'
                      }
                      key={change.category}
                    >
                      <span className="monthly-comparison__category-name">
                        {t(categoryLabel(change.category))}
                      </span>
                      <span className="monthly-comparison__bar" aria-hidden="true">
                        <span
                          style={{
                            width: `${Math.max(
                              4,
                              (Math.abs(change.amount) / maxCategoryChange) * 100,
                            )}%`,
                          }}
                        />
                      </span>
                      <span className="monthly-comparison__category-delta">
                        {change.amount > 0 ? '+' : '−'}
                        {toDisplayMoney(Math.abs(change.amount))}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="monthly-comparison__no-changes">
                  {t('ما ظهر فرق واضح في فئات الصرف المتغيرة.')}
                </p>
              )}
            </div>

            <footer className="monthly-comparison__footer">
              {isHome && (
                <a href="#public-home-tools">
                  {t('اذهب للأدوات الإضافية')}
                  <ArrowUp size={14} aria-hidden="true" />
                </a>
              )}
              <p>
                <Info size={14} aria-hidden="true" />
                {t('الدخل والسكن مستبعدان من فروقات الفئات.')}
                {' '}{t('المقارنة مبنية على الحركات الموجودة في كل شهر وقد يكون أحدهما جزئيًا.')}
              </p>
            </footer>
          </>
        )}
      </div>
    </section>
  );
}
