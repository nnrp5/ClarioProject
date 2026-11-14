import {
  Check,
  CircleAlert,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import {
  formatStatementMoney,
  useStatementAnalysis,
} from '@/components/statement-analysis-provider';

export default function HireSimulator() {
  const {
    analysis,
    isSample,
    currency,
    monthlySalary,
    setMonthlySalary,
  } = useStatementAnalysis();
  const parsedSalary = Number(monthlySalary);
  const remainingAfterHire =
    Number.isFinite(parsedSalary) && parsedSalary > 0
      ? analysis.monthlySurplus - parsedSalary
      : null;

  return (
    <section className="hire-simulator" id="hire" aria-labelledby="hire-title">
      <div className="hire-copy">
        <span className="section-kicker">القرار اللي يفرق</span>
        <h3 id="hire-title">أقدر أوظف شخص؟</h3>
        <p>
          جرّب راتبًا شهريًا وشوف وش يبقى من الفائض حسب أرقام الكشف. غيّر الرقم
          وشاهد النتيجة فورًا.
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
            data-testid="input-hire-salary"
          />
        </label>
        <div className="hire-baseline">
          <span>الفائض الشهري حسب الكشف</span>
          <strong>
            {formatStatementMoney(analysis.monthlySurplus, currency)}
          </strong>
        </div>
        <div
          className={`hire-outcome${remainingAfterHire !== null && remainingAfterHire >= 0 ? ' is-covered' : ' is-tight'}`}
          role="status"
          aria-live="polite"
          data-testid="status-hire-outcome"
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
                <strong>
                  {formatStatementMoney(remainingAfterHire, currency)}
                </strong>{' '}
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
                <strong>
                  {formatStatementMoney(Math.abs(remainingAfterHire), currency)}
                </strong>{' '}
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
  );
}
