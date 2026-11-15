import { ChevronDown } from 'lucide-react';
import {
  currencies,
  useStatementAnalysis,
  type CurrencyCode,
} from '@/components/statement-analysis-provider';

export default function CurrencySelector({
  className = '',
}: {
  className?: string;
}) {
  const {
    currency,
    setCurrency,
    isExchangeRateLoading,
    exchangeRateUpdatedAt,
  } = useStatementAnalysis();
  const selectedCurrency =
    currencies.find((item) => item.value === currency) ?? currencies[0];
  const ratesAvailable = exchangeRateUpdatedAt !== null;
  const title = isExchangeRateLoading
    ? 'جاري تحديث أسعار الصرف'
    : ratesAvailable
      ? `عملة عرض التطبيق — أسعار تقريبية، آخر تحديث ${new Intl.DateTimeFormat(
          'ar-KW',
          { dateStyle: 'medium' },
        ).format(exchangeRateUpdatedAt)}`
      : 'تعذر تحميل أسعار الصرف؛ جرّب تحديث الصفحة';

  return (
    <label
      className={`clario-currency-picker ${className}`.trim()}
      title={title}
      data-testid="control-display-currency"
    >
      <span className="clario-currency-picker__flag" aria-hidden="true">
        {selectedCurrency.flag}
      </span>
      <span className="clario-currency-picker__code">{currency}</span>
      <ChevronDown
        className="clario-currency-picker__chevron"
        size={13}
        strokeWidth={2}
        aria-hidden="true"
      />
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
        disabled={!ratesAvailable}
        aria-label="عملة عرض التطبيق"
      >
        {currencies.map((item) => (
          <option key={item.value} value={item.value}>
            {item.flag} {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
