import { useMemo } from 'react';
import { Check, ListChecks, Repeat2, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import {
  formatStatementMoney,
  useStatementAnalysis,
} from '@/components/statement-analysis-provider';
import { categoryLabel } from '@/lib/statement-analysis';
import { buildMonthlyPlan } from '@/lib/monthly-plan';
import './monthly-plan.css';

export default function MonthlyPlan() {
  const { language, t } = useLanguage();
  const {
    analysis,
    isSample,
    currency,
    statementCurrency,
    convertBetween,
  } = useStatementAnalysis();
  const steps = useMemo(() => buildMonthlyPlan(analysis), [analysis]);

  const toDisplayCurrency = (amount: number) =>
    convertBetween(amount, statementCurrency, currency);
  const money = (amount: number) => {
    const converted = toDisplayCurrency(amount);
    return converted === null
      ? '—'
      : formatStatementMoney(converted, currency, language);
  };

  return (
    <section
      className="monthly-plan"
      id="monthly-plan"
      aria-labelledby="monthly-plan-title"
      data-testid="monthly-plan"
    >
      <div className="monthly-plan__header">
        <div>
          <span className="monthly-plan__kicker">
            <ListChecks size={15} aria-hidden="true" />
            {t('من الأرقام إلى خطوة عملية')}
          </span>
          <h3 id="monthly-plan-title">{t('خطتك هالشهر')}</h3>
          <p>{t('خطوات مقترحة من دخل ومصاريف فترة الكشف.')}</p>
        </div>
        <span className={`monthly-plan__badge${isSample ? ' is-sample' : ''}`}>
          {t(isSample ? 'مثال توضيحي' : 'مبنية على كشفك')}
        </span>
      </div>

      {steps.length > 0 ? (
        <ol className="monthly-plan__steps">
          {steps.map((step, index) => {
            const monthlyImpact = money(step.monthlyImpact);
            const annualImpact = money(step.monthlyImpact * 12);
            const StepIcon =
              step.type === 'subscription'
                ? Repeat2
                : step.type === 'saving'
                  ? Check
                  : TrendingDown;

            let title = '';
            let description = '';

            if (step.type === 'subscription') {
              title =
                language === 'ar'
                  ? 'راجع الاشتراك المتكرر'
                  : 'Review the recurring subscription';
              const label = isSample ? t(step.description) : step.description;
              description =
                language === 'ar'
                  ? `${label} يتكرر بمبلغ قريب كل شهر. إذا كانت إحدى الدفعات غير لازمة، إلغاؤها قد يوفر ${monthlyImpact} شهريًا، أي ${annualImpact} بالسنة.`
                  : `${label} appears at a similar amount each month. If one charge is unnecessary, cancelling it could save ${monthlyImpact} per month, or ${annualImpact} per year.`;
            } else if (step.type === 'category') {
              const label = t(categoryLabel(step.category));
              title =
                language === 'ar'
                  ? `حط سقفًا لمصروف ${label}`
                  : `Set a limit for ${label}`;
              description =
                language === 'ar'
                  ? `خفض ${step.reductionPercent}٪ من متوسط هذا البند قد يوفر ${monthlyImpact} شهريًا (${annualImpact} بالسنة)، إذا كان ممكنًا بدون تأثير على احتياجاتك الأساسية.`
                  : `Reducing this category by ${step.reductionPercent}% could free ${monthlyImpact} per month (${annualImpact} per year), if you can do it without affecting essentials.`;
            } else {
              title =
                language === 'ar'
                  ? `خصص ${step.savingPercent}٪ من الفائض`
                  : `Set aside ${step.savingPercent}% of your surplus`;
              description =
                language === 'ar'
                  ? `تحويل ${monthlyImpact} شهريًا إلى هدفك أو احتياطك يساوي ${annualImpact} خلال سنة.`
                  : `Putting ${monthlyImpact} toward a goal or buffer each month adds up to ${annualImpact} in a year.`;
            }

            return (
              <li className="monthly-plan__step" key={step.id}>
                <div className="monthly-plan__step-top">
                  <span className="monthly-plan__number">
                    {new Intl.NumberFormat(language === 'ar' ? 'ar-KW' : 'en-KW', {
                      minimumIntegerDigits: 2,
                      maximumFractionDigits: 0,
                    }).format(index + 1)}
                  </span>
                  <span className="monthly-plan__icon">
                    <StepIcon size={17} aria-hidden="true" />
                  </span>
                </div>
                <h4>{title}</h4>
                <p>{description}</p>
                <div className="monthly-plan__impact">
                  <span>{t('توفير محتمل بالشهر')}</span>
                  <strong>{monthlyImpact}</strong>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="monthly-plan__empty">
          {t('ما تكفي بيانات الكشف لاقتراح خطوات شهرية واضحة.')}
        </p>
      )}

      <p className="monthly-plan__disclaimer">
        <Check size={14} aria-hidden="true" />
        {t('هذي تقديرات مبنية على فترة الكشف، مو ضمان للتوفير. راجع كل بند قبل أي قرار.')}
      </p>
    </section>
  );
}
