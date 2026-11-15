import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { Check, ChevronDown } from 'lucide-react';
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
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    if (!isOpen) return;

    const focusSelectedOption = requestAnimationFrame(() => {
      menuRef.current
        ?.querySelector<HTMLButtonElement>('[role="option"][aria-selected="true"]')
        ?.focus();
    });
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      cancelAnimationFrame(focusSelectedOption);
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  function focusOption(index: number) {
    const options = menuRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="option"]',
    );
    if (!options?.length) return;
    const safeIndex = (index + options.length) % options.length;
    options[safeIndex]?.focus();
  }

  function handleOptionKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusOption(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusOption(currencies.length - 1);
    }
  }

  return (
    <div
      ref={pickerRef}
      className={`clario-currency-picker${!ratesAvailable ? ' is-disabled' : ''} ${className}`.trim()}
      title={title}
      data-testid="control-display-currency"
      onBlur={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget as Node | null,
          )
        ) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        className="clario-currency-picker__trigger"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        disabled={!ratesAvailable}
        aria-label={`عملة عرض التطبيق: ${selectedCurrency.flag} ${currency}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        title={title}
      >
        <span className="clario-currency-picker__flag-wrap" aria-hidden="true">
          <span className="clario-currency-picker__flag">
            {selectedCurrency.flag}
          </span>
        </span>
        <span className="clario-currency-picker__code">{currency}</span>
        <ChevronDown
          className="clario-currency-picker__chevron"
          size={13}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className="clario-currency-picker__menu"
        >
          <div className="clario-currency-picker__menu-heading">
            <strong>عملة العرض</strong>
            <span>تتغير الأرقام داخل كلاريو</span>
          </div>
          <div
            id={menuId}
            className="clario-currency-picker__options"
            role="listbox"
            aria-label="اختيار عملة العرض"
          >
            {currencies.map((item, index) => {
              const isSelected = item.value === currency;
              return (
                <button
                  key={item.value}
                  className={`clario-currency-picker__option${isSelected ? ' is-selected' : ''}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setCurrency(item.value as CurrencyCode);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                >
                  <span className="clario-currency-picker__option-flag" aria-hidden="true">
                    {item.flag}
                  </span>
                  <span className="clario-currency-picker__option-copy">
                    <strong>{item.value}</strong>
                    <small>{item.label}</small>
                  </span>
                  {isSelected && <Check size={17} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
