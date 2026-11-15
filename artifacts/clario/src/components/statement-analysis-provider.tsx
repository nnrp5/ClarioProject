import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  analyzeTransactions,
  parseStatementFile,
  sampleTransactions,
  type StatementAnalysis,
} from '@/lib/statement-analysis';

export const currencies = [
  { value: 'KWD', label: 'د.ك — دينار كويتي' },
  { value: 'SAR', label: 'ر.س — ريال سعودي' },
  { value: 'AED', label: 'د.إ — درهم إماراتي' },
  { value: 'QAR', label: 'ر.ق — ريال قطري' },
  { value: 'BHD', label: 'د.ب — دينار بحريني' },
  { value: 'OMR', label: 'ر.ع — ريال عُماني' },
] as const;

export type CurrencyCode = (typeof currencies)[number]['value'];

function currencyFractionDigits(currency: CurrencyCode) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
  }).resolvedOptions().maximumFractionDigits;
}

export function formatArabicNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('ar-KW', {
    maximumFractionDigits,
  }).format(value);
}

export function formatEditableAmount(value: number, currency: CurrencyCode) {
  const fractionDigits = currencyFractionDigits(currency);
  return new Intl.NumberFormat('ar-KW', {
    useGrouping: false,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function parseLocalizedNumber(value: string) {
  const westernDigits = value
    .replace(/[٠-٩]/g, (digit) =>
      String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)),
    )
    .replace(/[۰-۹]/g, (digit) =>
      String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)),
    )
    .replace(/[٬,]/g, '')
    .replace(/[٫]/g, '.')
    .replace(/[−–]/g, '-')
    .replace(/\s/g, '');
  if (!westernDigits) return Number.NaN;
  const parsed = Number(westernDigits);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

type ExchangeRates = Record<string, number>;

const currencyPreferenceKey = 'clario-display-currency';
const ratesCacheKey = 'clario-exchange-rates-v1';
const ratesCacheMaxAge = 24 * 60 * 60 * 1000;

function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' &&
    currencies.some((currency) => currency.value === value);
}

function readCachedRates(): { rates: ExchangeRates; updatedAt: number } | null {
  try {
    const raw = localStorage.getItem(ratesCacheKey);
    if (!raw) return null;
    const cached = JSON.parse(raw) as {
      rates?: unknown;
      updatedAt?: unknown;
    };
    if (
      typeof cached.rates !== 'object' ||
      cached.rates === null ||
      typeof cached.updatedAt !== 'number'
    ) {
      return null;
    }
    const rates = cached.rates as ExchangeRates;
    if (
      !currencies.every(
        ({ value }) => Number.isFinite(rates[value]) && rates[value] > 0,
      )
    ) {
      return null;
    }
    return { rates, updatedAt: cached.updatedAt };
  } catch {
    return null;
  }
}

export function formatStatementMoney(value: number, currency: CurrencyCode) {
  const fractionDigits = currencyFractionDigits(currency);
  return new Intl.NumberFormat('ar-KW', {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

const sampleAnalysis = analyzeTransactions(sampleTransactions);

type StatementAnalysisContextValue = {
  analysis: StatementAnalysis;
  isSample: boolean;
  isProcessing: boolean;
  errorMessage: string;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  statementCurrency: CurrencyCode;
  setStatementCurrency: (currency: CurrencyCode) => void;
  convertBetween: (
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
  ) => number | null;
  isExchangeRateLoading: boolean;
  exchangeRateUpdatedAt: number | null;
  monthlySalary: string;
  setMonthlySalary: (salary: string) => void;
  processFile: (file: File) => Promise<void>;
  showSample: () => void;
};

const StatementAnalysisContext =
  createContext<StatementAnalysisContextValue | null>(null);

export function StatementAnalysisProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [analysis, setAnalysis] = useState<StatementAnalysis>(sampleAnalysis);
  const [isSample, setIsSample] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('KWD');
  const [statementCurrency, setStatementCurrency] =
    useState<CurrencyCode>('KWD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [exchangeRateUpdatedAt, setExchangeRateUpdatedAt] = useState<number | null>(null);
  const [isExchangeRateLoading, setIsExchangeRateLoading] = useState(true);
  const [monthlySalary, setMonthlySalary] = useState(
    formatEditableAmount(600, 'KWD'),
  );

  useEffect(() => {
    let active = true;
    const savedCurrency = localStorage.getItem(currencyPreferenceKey);
    const cached = readCachedRates();
    if (cached) {
      setExchangeRates(cached.rates);
      setExchangeRateUpdatedAt(cached.updatedAt);
      setIsExchangeRateLoading(false);
      if (isCurrencyCode(savedCurrency)) setCurrency(savedCurrency);
    }

    async function loadExchangeRates() {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) throw new Error('Exchange-rate service unavailable.');
        const result = (await response.json()) as {
          result?: string;
          time_last_update_unix?: number;
          rates?: ExchangeRates;
        };
        if (
          result.result !== 'success' ||
          !result.rates ||
          !currencies.every(
            ({ value }) =>
              Number.isFinite(result.rates?.[value]) &&
              (result.rates?.[value] ?? 0) > 0,
          )
        ) {
          throw new Error('Exchange-rate response is incomplete.');
        }

        const updatedAt = (result.time_last_update_unix ?? Date.now() / 1000) * 1000;
        if (!active) return;
        setExchangeRates(result.rates);
        setExchangeRateUpdatedAt(updatedAt);
        setIsExchangeRateLoading(false);
        if (isCurrencyCode(savedCurrency)) setCurrency(savedCurrency);
        localStorage.setItem(
          ratesCacheKey,
          JSON.stringify({ rates: result.rates, updatedAt }),
        );
      } catch {
        if (active) setIsExchangeRateLoading(false);
      }
    }

    const cacheIsFresh =
      cached !== null && Date.now() - cached.updatedAt < ratesCacheMaxAge;
    if (!cacheIsFresh) void loadExchangeRates();

    return () => {
      active = false;
    };
  }, []);

  const convertBetween = useCallback(
    (amount: number, from: CurrencyCode, to: CurrencyCode) => {
      if (from === to) return amount;
      if (!exchangeRates) return null;
      const sourceRate = exchangeRates[from];
      const targetRate = exchangeRates[to];
      if (!Number.isFinite(sourceRate) || !Number.isFinite(targetRate)) {
        return null;
      }
      return amount * (targetRate / sourceRate);
    },
    [exchangeRates],
  );

  const changeDisplayCurrency = useCallback(
    (nextCurrency: CurrencyCode) => {
      if (nextCurrency !== currency && exchangeRates) {
        const salaryAmount = parseLocalizedNumber(monthlySalary);
        if (Number.isFinite(salaryAmount) && salaryAmount > 0) {
          const convertedSalary = convertBetween(
            salaryAmount,
            currency,
            nextCurrency,
          );
          if (convertedSalary !== null) {
            setMonthlySalary(formatEditableAmount(convertedSalary, nextCurrency));
          }
        }
      }
      setCurrency(nextCurrency);
      localStorage.setItem(currencyPreferenceKey, nextCurrency);
    },
    [convertBetween, currency, exchangeRates, monthlySalary],
  );

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

  function showSample() {
    setAnalysis(sampleAnalysis);
    setIsSample(true);
    setErrorMessage('');
  }

  return (
    <StatementAnalysisContext.Provider
      value={{
        analysis,
        isSample,
        isProcessing,
        errorMessage,
        currency,
        setCurrency: changeDisplayCurrency,
        statementCurrency,
        setStatementCurrency,
        convertBetween,
        isExchangeRateLoading,
        exchangeRateUpdatedAt,
        monthlySalary,
        setMonthlySalary,
        processFile,
        showSample,
      }}
    >
      {children}
    </StatementAnalysisContext.Provider>
  );
}

export function useStatementAnalysis() {
  const context = useContext(StatementAnalysisContext);
  if (!context) {
    throw new Error(
      'useStatementAnalysis must be used inside StatementAnalysisProvider.',
    );
  }
  return context;
}
