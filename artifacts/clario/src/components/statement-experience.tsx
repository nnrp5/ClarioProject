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
  Check,
  ChevronDown,
  CircleAlert,
  FileText,
  LockKeyhole,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  WalletCards,
} from 'lucide-react';
import {
  analyzeTransactions,
  categoryLabel,
  parseStatementFile,
  sampleTransactions,
  type StatementAnalysis,
} from '@/lib/statement-analysis';

const currencies = [
  { value: 'KWD', label: 'د.ك — دينار كويتي' },
  { value: 'SAR', label: 'ر.س — ريال سعودي' },
  { value: 'AED', label: 'د.إ — درهم إماراتي' },
  { value: 'QAR', label: 'ر.ق — ريال قطري' },
  { value: 'BHD', label: 'د.ب — دينار بحريني' },
  { value: 'OMR', label: 'ر.ع — ريال عُماني' },
] as const;

type CurrencyCode = (typeof currencies)[number]['value'];

const sampleAnalysis = analyzeTransactions(sampleTransactions);

function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('ar-KW', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function scoreDescription(score: number | null) {
  if (score === null) return 'ما تكفي بيانات الدخل';
  if (score >= 75) return 'مؤشر مطمئن في هذا الكشف';
  if (score >= 50) return 'فيه مجال للتحسين';
  return 'يحتاج انتباه';
}

export default function StatementExperience() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [analysis, setAnalysis] = useState<StatementAnalysis>(sampleAnalysis);
  const [isSample, setIsSample] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('KWD');
  const [monthlySalary, setMonthlySalary] = useState('600');

  const topCategoryAmount = analysis.categories[0]?.amount ?? 0;
  const summary = useMemo(() => {
    if (analysis.income <= 0) {
      return 'ما قدرنا نحدد دخلًا واضحًا من هذا الكشف. راجع تصنيف الإيداعات ثم جرّب مرة ثانية.';
    }
    const savingsPercent = Math.round((analysis.net / analysis.income) * 100);
    const remainingText =
      analysis.net >= 0
        ? `وبقي لك ${formatMoney(analysis.net, currency)}`
        : `وتجاوزت مصاريفك دخلك بـ ${formatMoney(Math.abs(analysis.net), currency)}`;
    const categoryText = analysis.categories[0]
      ? ` أكبر بند صرف كان ${categoryLabel(analysis.categories[0].category)}.`
      : '';
    return `خلال فترة الكشف، دخل ${formatMoney(analysis.income, currency)} وصُرف ${formatMoney(analysis.expenses, currency)}؛ ${remainingText} (${savingsPercent}٪ من الدخل).${categoryText}`;
  }, [analysis, currency]);

  const parsedSalary = Number(monthlySalary);
  const remainingAfterHire =
    Number.isFinite(parsedSalary) && parsedSalary > 0
      ? analysis.monthlySurplus - parsedSalary
      : null;

  async function processFile(file: File) {
    setErrorMessage('');
    setIsProcessing(true);
    try {
      const parsed = await parseStatementFile(file);
      setAnalysis(analyzeTransactions(parsed.transactions, parsed.notices));
      setIsSample(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'ما قدرنا نقرأ الملف. جرّب كشفًا نصيًا أو Excel/CSV.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

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

  function showSample() {
    setAnalysis(sampleAnalysis);
    setIsSample(true);
    setErrorMessage('');
  }

  return (
    <section
      className="statement-feature"
      id="analysis"
      aria-labelledby="statement-title"
    >
      <div className="clario-container">
        <div className="statement-heading">
          <span className="section-kicker">صورة أوضح من كشف واحد</span>
          <h2 id="statement-title">خلّنا نرتّب أرقامك.</h2>
          <p>
            ارفع كشفًا واحدًا، وشوف ملخصًا مفهومًا ودرجة مبدئية مع أسبابها.
            تقدر تشوف المثال أولًا قبل ما تختار ملفك.
          </p>
          <div className="statement-privacy" role="note">
            <span className="statement-privacy-icon" aria-hidden="true">
              <LockKeyhole size={17} />
            </span>
            <span>
              <strong>كشفك ما يغادر جهازك.</strong> نقرأه داخل المتصفح فقط؛ ما
              نرفعه لخادم ولا نحفظ الملف. النتيجة ما تبقى بعد إغلاق الصفحة.
            </span>
          </div>
        </div>

        <div className="statement-workspace">
          <section className="statement-upload-card" aria-label="رفع كشف حساب">
            <div className="statement-card-eyebrow">
              <span className="statement-upload-icon" aria-hidden="true">
                <Upload size={19} />
              </span>
              <span>ملف واحد يكفي للبداية</span>
            </div>

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
                aria-label="اختر كشف حساب للتحليل"
                onChange={handleFileChange}
              />
              <div className="statement-drop-icon" aria-hidden="true">
                {isProcessing ? (
                  <LoaderCircle className="statement-spinner" size={22} />
                ) : (
                  <FileText size={22} />
                )}
              </div>
              <h3>{isProcessing ? 'نقرأ الكشف على جهازك…' : 'ارفع كشف حسابك'}</h3>
              <p>PDF نصّي، Excel (.xlsx)، أو CSV</p>
              <button
                type="button"
                className="statement-select-button"
                onClick={() => inputRef.current?.click()}
                disabled={isProcessing}
              >
                {isProcessing ? 'لحظة واحدة' : 'اختر ملفًا'}
                {!isProcessing && <ArrowLeft size={15} aria-hidden="true" />}
              </button>
              <span className="statement-drop-hint">أو اسحب الملف إلى هنا</span>
            </div>

            <div className="statement-upload-meta">
              <span>حتى 10 ميغابايت</span>
              <label className="statement-currency">
                العملة
                <span>
                  <select
                    value={currency}
                    onChange={(event) =>
                      setCurrency(event.target.value as CurrencyCode)
                    }
                    aria-label="عملة المبالغ في التحليل"
                  >
                    {currencies.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} aria-hidden="true" />
                </span>
              </label>
            </div>

            <div className="statement-sample-row">
              <span>ما أنت متأكد من الرفع؟</span>
              <button type="button" onClick={showSample}>
                {isSample ? 'أنت تشوف مثالًا الآن' : 'اعرض مثالًا بدل كشفك'}
              </button>
            </div>

            {errorMessage && (
              <p className="statement-error" role="alert">
                <CircleAlert size={16} aria-hidden="true" />
                {errorMessage}
              </p>
            )}
          </section>

          <section
            className="statement-result-card"
            aria-labelledby="statement-result-title"
            aria-live="polite"
          >
            <div className="statement-result-header">
              <div>
                <span className="statement-result-kicker">
                  {isSample ? 'بيانات افتراضية' : 'نتيجة كشفك'}
                </span>
                <h3 id="statement-result-title">ملخصك المالي</h3>
              </div>
              <span className={`statement-source-tag${isSample ? ' is-sample' : ''}`}>
                {isSample ? 'مثال توضيحي' : 'تحليل محلي'}
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
                    ? 'لا تتوفر درجة كافية'
                    : `درجة الصحة المالية ${analysis.score} من 100`
                }
              >
                <div>
                  <strong>{analysis.score ?? '—'}</strong>
                  <span>من 100</span>
                </div>
              </div>
              <div className="statement-score-copy">
                <span className="statement-score-label">درجة مبدئية</span>
                <strong>{scoreDescription(analysis.score)}</strong>
                <p>مبنية على نسبة المتبقي من الدخل في هذا الكشف فقط.</p>
              </div>
            </div>

            <p className="statement-summary">{summary}</p>

            <div className="statement-metrics" aria-label="ملخص الأرقام">
              <div>
                <span>الدخل</span>
                <strong>{formatMoney(analysis.income, currency)}</strong>
              </div>
              <div>
                <span>المصاريف</span>
                <strong>{formatMoney(analysis.expenses, currency)}</strong>
              </div>
              <div className={analysis.net >= 0 ? 'is-positive' : 'is-negative'}>
                <span>المتبقي</span>
                <strong>{formatMoney(analysis.net, currency)}</strong>
              </div>
            </div>

            <div className="statement-reasons">
              <h4>
                <Sparkles size={15} aria-hidden="true" />
                ليش طلعت هالدرجة؟
              </h4>
              <ul>
                {analysis.reasons.map((reason) => (
                  <li key={reason}>
                    <Check size={15} aria-hidden="true" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {analysis.categories.length > 0 && (
              <div className="statement-categories">
                <h4>أبرز المصاريف</h4>
                {analysis.categories.slice(0, 3).map((item) => (
                  <div className="statement-category" key={item.category}>
                    <span>{categoryLabel(item.category)}</span>
                    <span className="statement-category-track" aria-hidden="true">
                      <i
                        style={{
                          width: `${Math.max(8, (item.amount / topCategoryAmount) * 100)}%`,
                        }}
                      />
                    </span>
                    <strong>{formatMoney(item.amount, currency)}</strong>
                  </div>
                ))}
              </div>
            )}

            {analysis.notices.map((notice) => (
              <p className="statement-notice" key={notice}>
                <ShieldCheck size={15} aria-hidden="true" />
                {notice}
              </p>
            ))}

            <details className="statement-transactions">
              <summary>
                راجع الحركات المقروءة ({analysis.transactions.length})
              </summary>
              <ul>
                {analysis.transactions.slice(0, 8).map((item, index) => (
                  <li key={`${item.description}-${index}`}>
                    <span>
                      <strong>{item.description}</strong>
                      <small>{categoryLabel(item.category)}</small>
                    </span>
                    <b className={item.amount > 0 ? 'is-income' : 'is-expense'}>
                      {item.amount > 0 ? '+' : '−'}
                      {formatMoney(Math.abs(item.amount), currency)}
                    </b>
                  </li>
                ))}
              </ul>
              {analysis.transactions.length > 8 && (
                <span className="statement-transactions-foot">
                  أول 8 حركات من أصل {analysis.transactions.length}
                </span>
              )}
            </details>

            {!isSample && (
              <button
                className="statement-reset-button"
                type="button"
                onClick={showSample}
              >
                <RotateCcw size={14} aria-hidden="true" />
                امسح النتيجة وارجع للمثال
              </button>
            )}
          </section>
        </div>

        <section className="hire-simulator" id="hire" aria-labelledby="hire-title">
          <div className="hire-copy">
            <span className="section-kicker">القرار اللي يفرق</span>
            <h3 id="hire-title">أقدر أوظف شخص؟</h3>
            <p>
              جرّب راتبًا شهريًا وشوف وش يبقى من الفائض حسب أرقام الكشف. غيّر
              الرقم وشاهد النتيجة فورًا.
            </p>
            <div className="hire-trust-note">
              <WalletCards size={16} aria-hidden="true" />
              <span>
                تقدير مبسّط من هذا الكشف، ولا يشمل تكاليف التوظيف الإضافية أو
                التزامات ما ظهرت فيه.
              </span>
            </div>
          </div>

          <div className="hire-calculator">
            <label className="hire-salary-field">
              <span>الراتب الشهري المتوقع</span>
              <input
                type="number"
                min="0"
                step="50"
                inputMode="decimal"
                dir="ltr"
                value={monthlySalary}
                onChange={(event) => setMonthlySalary(event.target.value)}
                placeholder="مثال: 600"
              />
            </label>
            <div className="hire-baseline">
              <span>الفائض الشهري حسب الكشف</span>
              <strong>{formatMoney(analysis.monthlySurplus, currency)}</strong>
            </div>
            <div
              className={`hire-outcome${remainingAfterHire !== null && remainingAfterHire >= 0 ? ' is-covered' : ' is-tight'}`}
              role="status"
              aria-live="polite"
            >
              {remainingAfterHire === null ? (
                <span>أدخل راتبًا لمعرفة أثره على الفائض.</span>
              ) : remainingAfterHire >= 0 ? (
                <>
                  <span className="hire-outcome-icon" aria-hidden="true">
                    <Check size={17} />
                  </span>
                  <span>
                    على أرقام الكشف، يبقى تقريبًا{' '}
                    <strong>{formatMoney(remainingAfterHire, currency)}</strong>{' '}
                    بعد الراتب كل شهر.
                  </span>
                </>
              ) : (
                <>
                  <span className="hire-outcome-icon" aria-hidden="true">
                    <CircleAlert size={17} />
                  </span>
                  <span>
                    الراتب يتجاوز الفائض الحالي بـ{' '}
                    <strong>{formatMoney(Math.abs(remainingAfterHire), currency)}</strong>{' '}
                    شهريًا.
                  </span>
                </>
              )}
            </div>
            {isSample && (
              <span className="hire-sample-label">
                <Sparkles size={13} aria-hidden="true" />
                جرّبها الآن على المثال، أو ارفع كشفك لتحليل أرقامك.
              </span>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
