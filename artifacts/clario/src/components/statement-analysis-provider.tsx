import {
  createContext,
  useContext,
  useState,
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

export function formatStatementMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('ar-KW', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
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
  const [monthlySalary, setMonthlySalary] = useState('600');

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
        setCurrency,
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
