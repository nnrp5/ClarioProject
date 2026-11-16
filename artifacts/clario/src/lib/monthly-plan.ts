import type {
  StatementAnalysis,
  StatementTransaction,
  TransactionCategory,
} from '@/lib/statement-analysis';

export type MonthlyPlanStep =
  | {
      id: string;
      type: 'subscription';
      description: string;
      monthlyImpact: number;
    }
  | {
      id: string;
      type: 'category';
      category: TransactionCategory;
      reductionPercent: number;
      monthlyImpact: number;
    }
  | {
      id: string;
      type: 'saving';
      savingPercent: number;
      monthlyImpact: number;
    };

const subscriptionTerms =
  /اشتراك|subscription|netflix|spotify|shahid|osn|youtube premium|icloud|adobe|amazon prime|disney\+?/i;
const flexibleCategories = new Set<TransactionCategory>([
  'food',
  'shopping',
  'transport',
  'other',
  'business',
  'utilities',
]);

function findMonthlySubscription(transactions: StatementTransaction[]) {
  const byDescription = new Map<string, StatementTransaction[]>();

  for (const item of transactions) {
    if (item.amount >= 0 || !subscriptionTerms.test(item.description)) continue;
    const key = item.description.trim().toLocaleLowerCase();
    const entries = byDescription.get(key) ?? [];
    entries.push(item);
    byDescription.set(key, entries);
  }

  for (const entries of byDescription.values()) {
    const dated = entries
      .filter((item) => item.date instanceof Date)
      .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    if (dated.length < 2) continue;

    const intervals = dated.slice(1).map((item, index) => {
      const days =
        (item.date!.getTime() - dated[index].date!.getTime()) /
        (24 * 60 * 60 * 1000);
      return days;
    });
    const monthlyIntervals = intervals.filter((days) => days >= 20 && days <= 40);
    if (monthlyIntervals.length === 0) continue;

    const amounts = dated.map((item) => Math.abs(item.amount));
    const averageAmount =
      amounts.reduce((total, amount) => total + amount, 0) / amounts.length;
    const similarAmounts = amounts.every(
      (amount) => Math.abs(amount - averageAmount) <= Math.max(1, averageAmount * 0.15),
    );
    if (!similarAmounts) continue;

    return {
      description: dated[0].description,
      monthlyAmount: averageAmount,
    };
  }

  return null;
}

export function buildMonthlyPlan(analysis: StatementAnalysis): MonthlyPlanStep[] {
  if (analysis.transactions.length < 2 || analysis.income <= 0) return [];

  const steps: MonthlyPlanStep[] = [];
  const subscription = findMonthlySubscription(analysis.transactions);
  const categories = analysis.categories
    .filter(
      (item) =>
        flexibleCategories.has(item.category) &&
        item.amount / Math.max(analysis.periodMonths, 1) >= 10,
    )
    .sort((a, b) => b.amount - a.amount);
  const positiveSurplus = Math.max(analysis.monthlySurplus, 0);
  const includeSavingsStep = positiveSurplus > 0;

  if (subscription) {
    steps.push({
      id: `subscription-${subscription.description}`,
      type: 'subscription',
      description: subscription.description,
      monthlyImpact: subscription.monthlyAmount,
    });
  }

  const categoryStepCount = includeSavingsStep
    ? Math.max(0, 2 - steps.length)
    : 3 - steps.length;

  categories.slice(0, categoryStepCount).forEach((item, index) => {
    const reductionPercent = index === 0 ? 10 : 5;
    const monthlyCategoryAmount = item.amount / Math.max(analysis.periodMonths, 1);
    steps.push({
      id: `category-${item.category}`,
      type: 'category',
      category: item.category,
      reductionPercent,
      monthlyImpact: (monthlyCategoryAmount * reductionPercent) / 100,
    });
  });

  if (includeSavingsStep && steps.length < 3) {
    const savingPercent = 20;
    steps.push({
      id: 'save-surplus',
      type: 'saving',
      savingPercent,
      monthlyImpact: (positiveSurplus * savingPercent) / 100,
    });
  }

  if (steps.length < 3) {
    const usedCategories = new Set(
      steps.flatMap((step) => step.type === 'category' ? [step.category] : []),
    );
    categories
      .filter((item) => !usedCategories.has(item.category))
      .slice(0, 3 - steps.length)
      .forEach((item) => {
        const monthlyCategoryAmount =
          item.amount / Math.max(analysis.periodMonths, 1);
        const reductionPercent = 5;
        steps.push({
          id: `category-${item.category}`,
          type: 'category',
          category: item.category,
          reductionPercent,
          monthlyImpact: (monthlyCategoryAmount * reductionPercent) / 100,
        });
      });
  }

  return steps.slice(0, 3);
}
