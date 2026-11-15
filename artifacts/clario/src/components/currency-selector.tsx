import { Coins } from 'lucide-react';
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
      <Coins size={16} aria-hidden="true" />
      <span className="clario-currency-picker__code">{currency}</span>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
        disabled={!ratesAvailable}
        aria-label="عملة عرض التطبيق"
      >
        {currencies.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
