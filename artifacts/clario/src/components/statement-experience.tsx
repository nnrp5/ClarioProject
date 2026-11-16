import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  FileText,
  LockKeyhole,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import MonthlyPlan from '@/components/monthly-plan';
import { categoryLabel } from '@/lib/statement-analysis';
import StatementInsights from '@/components/statement-insights';
import {
  currencies,
  formatArabicNumber,
  formatStatementMoney as formatMoney,
  useStatementAnalysis,
  type CurrencyCode,
} from '@/components/statement-analysis-provider';
import {
  formatLocaleNumber,
  translateAnalysisText,
} from '@/lib/localization';

function scoreDescription(score: number | null) {
  if (score === null) return 'ما تكفي بيانات الدخل';
  if (score >= 75) return 'مؤشر مطمئن في هذا الكشف';
  if (score >= 50) return 'فيه مجال للتحسين';
  return 'يحتاج انتباه';
}

interface StatementExperienceProps {
  variant?: 'standard' | 'home';
}

export default function StatementExperience({
  variant = 'standard',
}: StatementExperienceProps) {
  const { language, t } = useLanguage();
  const isCompactHome = variant === 'home';
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const {
    analysis,
    isSample,
    sampleName,
    isProcessing,
    errorMessage,
    currency,
    setCurrency,
    statementCurrency,
    setStatementCurrency,
    convertBetween,
    processFile,
    showNextSample,
  } = useStatementAnalysis();
  const [isDragging, setIsDragging] = useState(false);

  const topCategoryAmount = analysis.categories[0]?.amount ?? 0;
  const formatDisplayMoney = (amount: number) => {
    const converted = convertBetween(amount, statementCurrency, currency);
    return converted === null ? '—' : formatMoney(converted, currency, language);
  };
  const summary = useMemo(() => {
    if (analysis.income <= 0) {
      return t('ما قدرنا نحدد دخلًا واضحًا من هذا الكشف. راجع تصنيف الإيداعات ثم جرّب مرة ثانية.');
    }
    const savingsPercent = Math.round((analysis.net / analysis.income) * 100);
    if (language === 'en') {
      const remainingText = analysis.net >= 0
        ? `you have ${formatDisplayMoney(analysis.net)} left`
        : `expenses exceeded income by ${formatDisplayMoney(Math.abs(analysis.net))}`;
      const categoryText = analysis.categories[0]
        ? ` Your largest expense category was ${t(categoryLabel(analysis.categories[0].category))}.`
        : '';
      return `During this statement period, income was ${formatDisplayMoney(analysis.income)} and expenses were ${formatDisplayMoney(analysis.expenses)}; ${remainingText} (${formatLocaleNumber(savingsPercent, language)}% of income).${categoryText}`;
    }
    const remainingText =
      analysis.net >= 0
        ? `وبقي لك ${formatDisplayMoney(analysis.net)}`
        : `وتجاوزت مصاريفك دخلك بـ ${formatDisplayMoney(Math.abs(analysis.net))}`;
    const categoryText = analysis.categories[0]
      ? ` أكبر بند صرف كان ${t(categoryLabel(analysis.categories[0].category))}.`
      : '';
    return `خلال فترة الكشف، دخل ${formatDisplayMoney(analysis.income)} وصُرف ${formatDisplayMoney(analysis.expenses)}؛ ${remainingText} (${formatArabicNumber(savingsPercent, 0, language)}٪ من الدخل).${categoryText}`;
  }, [analysis, currency, statementCurrency, convertBetween, language, t]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (file) void processFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void processFile(file);
  }

  function handleTrySample() {
    showNextSample();
    resultRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'center',
    });
    resultRef.current?.focus({ preventScroll: true });
  }

  return (
    <section
      className={`statement-feature${isCompactHome ? ' statement-feature--home' : ''}`}
      id="analysis"
      aria-labelledby="statement-title"
    >
      <div className="clario-container">
        <div
          className={`statement-heading${isCompactHome ? ' statement-heading--visually-hidden' : ''}`}
          data-scroll-reveal
        >
          <span className="section-kicker">{t('صورة أوضح من كشف واحد')}</span>
          <h2 id="statement-title">{t('خلّنا نرتّب أرقامك.')}</h2>
          <p>
            {t('ارفع كشفًا واحدًا، وشوف ملخصًا مفهومًا ودرجة مبدئية مع أسبابها. تقدر تشوف المثال أولًا قبل ما تختار ملفك.')}
          </p>
          {!isCompactHome && (
            <div className="statement-privacy" role="note">
              <span className="statement-privacy-icon" aria-hidden="true">
                <LockKeyhole size={17} />
              </span>
              <span>
                <strong>{t('كشفك ما يغادر جهازك.')}</strong> {t('نقرأه داخل المتصفح فقط؛ ما نرفعه لخادم ولا نحفظ الملف. النتيجة ما تبقى بعد إغلاق الصفحة.')}
              </span>
            </div>
          )}
        </div>

        <div className="statement-workspace">
          <section
            className="statement-upload-card"
            aria-label={t('رفع كشف حساب')}
            data-scroll-reveal
          >
            <div
              className={`statement-dropzone${isDragging ? ' is-dragging' : ''}${isProcessing ? ' is-busy' : ''}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                className="statement-file-input"
                type="file"
                accept=".pdf,.xlsx,.csv,application/pdf,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                aria-label={t('اختر كشف حساب للتحليل')}
                onChange={handleFileChange}
              />
              <div className="statement-drop-icon" aria-hidden="true">
                {isProcessing ? (
                  <LoaderCircle className="statement-spinner" size={22} />
                ) : (
                  <FileText size={22} />
                )}
              </div>
              <h3>{t(isProcessing ? 'نقرأ الكشف على جهازك…' : 'ارفع كشف حسابك')}</h3>
              <p>{t('PDF نصّي، Excel (.xlsx)، أو CSV')}</p>
              <button
                type="button"
                className="statement-select-button"
                onClick={() => inputRef.current?.click()}
                disabled={isProcessing}
              >
                {t(isProcessing ? 'لحظة واحدة' : 'اختر ملفًا')}
                {!isProcessing && (language === 'ar' ? <ArrowLeft size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />)}
              </button>
              <span className="statement-drop-hint">{t('أو اسحب الملف إلى هنا')}</span>
            </div>

            <div
              className={`statement-demo-action${isCompactHome ? ' statement-demo-action--home' : ''}`}
            >
              <span>{t('ما تبي ترفع ملفك؟')}</span>
              <button
                type="button"
                className="statement-demo-button"
                onClick={handleTrySample}
                disabled={isProcessing}
                aria-label={t('بدّل إلى كشف تجريبي مختلف')}
                title={t('اضغط لعرض كشف تجريبي آخر')}
                data-testid="button-try-sample"
              >
                <span className="statement-demo-button__icon" aria-hidden="true">
                  <RotateCcw size={16} />
                </span>
                <span>{t('جرّب بكشف تجريبي')}</span>
              </button>
            </div>

            <div className="statement-upload-meta">
              <span>{t('حتى ١٠ ميغابايت')}</span>
              <label className="statement-currency">
                {t(isSample ? 'عملة المثال' : 'عملة الكشف')}
                <span>
                  <select
                    value={isSample ? currency : statementCurrency}
                    onChange={(event) =>
                      isSample
                        ? setCurrency(event.target.value as CurrencyCode)
                        : setStatementCurrency(event.target.value as CurrencyCode)
                    }
                    aria-label={t(isSample ? 'عملة عرض المثال التجريبي' : 'عملة المبالغ في الكشف')}
                  >
                    {currencies.map((item) => (
                      <option key={item.value} value={item.value}>
                        {t(item.label)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} aria-hidden="true" />
                </span>
              </label>
            </div>

            {isCompactHome && (
              <div className="statement-privacy statement-privacy--inline" role="note">
                <span className="statement-privacy-icon" aria-hidden="true">
                  <LockKeyhole size={15} />
                </span>
                <span>
                  <strong>{t('كشفك ما يغادر جهازك.')}</strong> {t('نقرأه داخل المتصفح فقط ولا نحفظ الملف.')}
                </span>
              </div>
            )}

            {!isSample && !isCompactHome && (
              <div className="statement-sample-row">
                <span>{t('تقدر ترجع للمثال متى ما بغيت.')}</span>
                <button type="button" onClick={showNextSample}>
                  {t('جرّب كشفًا تجريبيًا آخر')}
                </button>
              </div>
            )}

            {errorMessage && (
              <p className="statement-error" role="alert">
                <CircleAlert size={16} aria-hidden="true" />
                {t(errorMessage)}
              </p>
            )}
          </section>

          <section
            className="statement-result-card"
            aria-labelledby="statement-result-title"
            aria-live="polite"
            data-scroll-reveal
            tabIndex={-1}
            ref={resultRef}
          >
            <div className="statement-result-header">
              <div>
                <span className="statement-result-kicker">
                    {isSample ? `${language === 'ar' ? 'بيانات افتراضية · ' : 'Sample data · '}${t(sampleName)}` : t('نتيجة كشفك')}
                </span>
                <h3 id="statement-result-title">{t('ملخصك المالي')}</h3>
              </div>
              <span className={`statement-source-tag${isSample ? ' is-sample' : ''}`}>
                {t(isSample ? 'مثال توضيحي' : 'تحليل محلي')}
              </span>
            </div>

            <div className="statement-score-row">
              <div
                className="statement-score-ring"
                style={
                  {
                    '--score-angle': `${analysis.score ?? 0}%`,
                  } as CSSProperties
                }
                aria-label={
                  analysis.score === null
                    ? t('لا تتوفر درجة كافية')
                    : `${t('درجة الصحة المالية')} ${formatArabicNumber(analysis.score, 0, language)} ${language === 'ar' ? 'من' : 'out of'} ${formatArabicNumber(100, 0, language)}`
                }
              >
                <div>
                  <strong>
                    {analysis.score === null
                      ? '—'
                       : formatArabicNumber(analysis.score, 0, language)}
                  </strong>
                  <span>{language === 'ar' ? 'من' : 'of'} {formatArabicNumber(100, 0, language)}</span>
                </div>
              </div>
              <div className="statement-score-copy">
                <span className="statement-score-label">{t('درجة مبدئية')}</span>
                <strong>{t(scoreDescription(analysis.score))}</strong>
                <p>
                  {isCompactHome
                    ? translateAnalysisText(analysis.reasons[0] ?? 'مبنية على نسبة المتبقي من الدخل في هذا الكشف فقط.', language)
                    : t('مبنية على نسبة المتبقي من الدخل في هذا الكشف فقط.')}
                </p>
              </div>
            </div>

            <p className="statement-summary">{summary}</p>

            <div className="statement-metrics" aria-label={t('ملخص الأرقام')}>
              <div>
                <span>{t('الدخل')}</span>
                <strong>{formatDisplayMoney(analysis.income)}</strong>
              </div>
              <div>
                <span>{t('المصاريف')}</span>
                <strong>{formatDisplayMoney(analysis.expenses)}</strong>
              </div>
              <div className={analysis.net >= 0 ? 'is-positive' : 'is-negative'}>
                <span>{t('المتبقي')}</span>
                <strong>{formatDisplayMoney(analysis.net)}</strong>
              </div>
            </div>

            <div className="statement-reasons">
              <h4>
                <Sparkles size={15} aria-hidden="true" />
                {t('ليش طلعت هالدرجة؟')}
              </h4>
              <ul>
                {analysis.reasons.map((reason) => (
                  <li key={reason}>
                    <Check size={15} aria-hidden="true" />
                    <span>{translateAnalysisText(reason, language)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {analysis.categories.length > 0 && (
              <div className="statement-categories">
                <h4>{t('أبرز المصاريف')}</h4>
                {analysis.categories.slice(0, 3).map((item) => (
                  <div className="statement-category" key={item.category}>
                    <span>{t(categoryLabel(item.category))}</span>
                    <span className="statement-category-track" aria-hidden="true">
                      <i
                        style={{
                          width: `${Math.max(8, (item.amount / topCategoryAmount) * 100)}%`,
                        }}
                      />
                    </span>
                    <strong>{formatDisplayMoney(item.amount)}</strong>
                  </div>
                ))}
              </div>
            )}

            {analysis.notices.map((notice) => (
              <p className="statement-notice" key={notice}>
                <ShieldCheck size={15} aria-hidden="true" />
                {t(notice)}
              </p>
            ))}

            <details className="statement-transactions">
              <summary>
                {t('راجع الحركات المقروءة')} ({formatArabicNumber(analysis.transactions.length, 0, language)})
              </summary>
              <ul>
                {analysis.transactions.slice(0, 8).map((item, index) => (
                  <li key={`${item.description}-${index}`}>
                    <span>
                        <strong>{isSample ? t(item.description) : item.description}</strong>
                        <small>{t(categoryLabel(item.category))}</small>
                    </span>
                    <b className={item.amount > 0 ? 'is-income' : 'is-expense'}>
                      {item.amount > 0 ? '+' : '−'}
                      {formatDisplayMoney(Math.abs(item.amount))}
                    </b>
                  </li>
                ))}
              </ul>
              {analysis.transactions.length > 8 && (
                <span className="statement-transactions-foot">
                  {language === 'ar'
                    ? `أول ${formatArabicNumber(8, 0, language)} حركات من أصل ${formatArabicNumber(analysis.transactions.length, 0, language)}`
                    : `First ${formatLocaleNumber(8, language)} of ${formatLocaleNumber(analysis.transactions.length, language)} transactions`}
                </span>
              )}
            </details>

            {!isSample && (
              <button
                className="statement-reset-button"
                type="button"
                onClick={showNextSample}
              >
                <RotateCcw size={14} aria-hidden="true" />
                {t('امسح النتيجة وارجع للمثال')}
              </button>
            )}
          </section>
        </div>

        <StatementInsights />
        <MonthlyPlan />
      </div>
    </section>
  );
}
