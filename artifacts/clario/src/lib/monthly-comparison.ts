import type {
  StatementTransaction,
  TransactionCategory,
} from '@/lib/statement-analysis';

export type StatementMonth = {
  key: string;
  year: number;
  monthIndex: number;
  income: number;
  incomeTransactionCount: number;
  expenses: number;
  net: number;
  transactionCount: number;
  variableExpenses: Partial<Record<TransactionCategory, number>>;
};

export type CategoryChange = {
  category: TransactionCategory;
  amount: number;
};

const comparableExpenseCategories: TransactionCategory[] = [
  'food',
  'transport',
  'utilities',
  'shopping',
  'business',
  'other',
];

export function buildStatementMonths(
  transactions: StatementTransaction[],
): StatementMonth[] {
  const months = new Map<string, StatementMonth>();

  for (const transaction of transactions) {
    if (
      !(transaction.date instanceof Date) ||
      !Number.isFinite(transaction.date.getTime()) ||
      !Number.isFinite(transaction.amount)
    ) {
      continue;
    }

    const year = transaction.date.getFullYear();
    const monthIndex = transaction.date.getMonth();
    const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    let month = months.get(key);

    if (!month) {
      month = {
        key,
        year,
        monthIndex,
        income: 0,
          incomeTransactionCount: 0,
        expenses: 0,
        net: 0,
        transactionCount: 0,
        variableExpenses: {},
      };
      months.set(key, month);
    }

    month.transactionCount += 1;
    if (transaction.amount > 0) {
      month.income += transaction.amount;
      month.incomeTransactionCount += 1;
      continue;
    }

    if (transaction.amount < 0) {
      const expense = Math.abs(transaction.amount);
      month.expenses += expense;
      if (comparableExpenseCategories.includes(transaction.category)) {
        month.variableExpenses[transaction.category] =
          (month.variableExpenses[transaction.category] ?? 0) + expense;
      }
    }
  }

  return [...months.values()]
    .map((month) => ({ ...month, net: month.income - month.expenses }))
    .sort((first, second) => first.key.localeCompare(second.key));
}

export function buildCategoryChanges(
  earlierMonth: StatementMonth,
  laterMonth: StatementMonth,
): CategoryChange[] {
  return comparableExpenseCategories
    .map((category) => ({
      category,
      amount:
        (laterMonth.variableExpenses[category] ?? 0) -
        (earlierMonth.variableExpenses[category] ?? 0),
    }))
    .filter((change) => Math.abs(change.amount) >= 0.005)
    .sort((first, second) => Math.abs(second.amount) - Math.abs(first.amount))
    .slice(0, 6);
}
