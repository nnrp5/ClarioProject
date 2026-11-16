import {
  Check,
  CircleAlert,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import {
  formatEditableAmount,
  formatStatementMoney,
  parseLocalizedNumber,
  useStatementAnalysis,
} from '@/components/statement-analysis-provider';

export default function HireSimulator() {
  const { language, t } = useLanguage();
  const {
    analysis,
    isSample,
    currency,
    statementCurrency,
    convertBetween,
    monthlySalary,
    setMonthlySalary,
  } = useStatementAnalysis();
  const parsedSalary = parseLocalizedNumber(monthlySalary);
  const monthlySurplusInDisplayCurrency = convertBetween(
    analysis.monthlySurplus,
    statementCurrency,
    currency,
  );
  const remainingAfterHire =
    Number.isFinite(parsedSalary) &&
    parsedSalary > 0 &&
    monthlySurplusInDisplayCurrency !== null
      ? monthlySurplusInDisplayCurrency - parsedSalary
      : null;

  return (
    <section
      className="hire-simulator"
      id="hire"
      aria-labelledby="hire-title"
      data-scroll-reveal
    >
      <div className="hire-copy">
        <span className="section-kicker">{t('القرار اللي يفرق')}</span>
        <h3 id="hire-title">{t('أقدر أوظف شخص؟')}</h3>
        <p>
          {t('يعتمد قرار التوظيف على كشف حسابك، وفي حال استخدام المثال التجريبي فالحسبة مبنية عليه.')}
        </p>
        <div className="hire-trust-note">
          <WalletCards size={16} aria-hidden="true" />
          <span>
            {t('تقدير مبسّط من هذا الكشف، ولا يشمل تكاليف التوظيف الإضافية أو التزامات ما ظهرت فيه.')}
          </span>
        </div>
      </div>

      <div className="hire-calculator">
        <label className="hire-salary-field">
          <span>{t('الراتب الشهري المتوقع')}</span>
          <input
            type="text"
            inputMode="decimal"
            dir="ltr"
            value={monthlySalary}
            onChange={(event) => setMonthlySalary(event.target.value)}
            onBlur={(event) => {
              const enteredSalary = parseLocalizedNumber(event.currentTarget.value);
              if (Number.isFinite(enteredSalary) && enteredSalary >= 0) {
                setMonthlySalary(formatEditableAmount(enteredSalary, currency, language));
              }
            }}
            placeholder={t('مثال: ٦٠٠')}
            data-testid="input-hire-salary"
          />
        </label>
        <div className="hire-baseline">
          <span>{t('الفائض الشهري حسب الكشف')}</span>
          <strong>
            {monthlySurplusInDisplayCurrency === null
              ? '—'
              : formatStatementMoney(monthlySurplusInDisplayCurrency, currency, language)}
          </strong>
        </div>
        <div
          className={`hire-outcome${remainingAfterHire !== null && remainingAfterHire >= 0 ? ' is-covered' : ' is-tight'}`}
          role="status"
          aria-live="polite"
          data-testid="status-hire-outcome"
        >
          {remainingAfterHire === null ? (
            <span>{t('أدخل راتبًا لمعرفة أثره على الفائض.')}</span>
          ) : remainingAfterHire >= 0 ? (
            <>
              <span className="hire-outcome-icon" aria-hidden="true">
                <Check size={17} />
              </span>
              <span>
                {t('على أرقام الكشف، يبقى تقريبًا')}{' '}
                <strong>
                    {formatStatementMoney(remainingAfterHire, currency, language)}
                </strong>{' '}
                {t('بعد الراتب كل شهر.')}
              </span>
            </>
          ) : (
            <>
              <span className="hire-outcome-icon" aria-hidden="true">
                <CircleAlert size={17} />
              </span>
              <span>
                {t('الراتب يتجاوز الفائض الحالي بـ')}{' '}
                <strong>
                  {formatStatementMoney(Math.abs(remainingAfterHire), currency, language)}
                </strong>{' '}
                {t('شهريًا.')}
              </span>
            </>
          )}
        </div>
        {isSample && (
          <span className="hire-sample-label">
            <Sparkles size={13} aria-hidden="true" />
            {t('جرّبها الآن على المثال، أو ارفع كشفك لتحليل أرقامك.')}
          </span>
        )}
      </div>
    </section>
  );
}
