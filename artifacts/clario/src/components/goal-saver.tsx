import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, LoaderCircle, TrendingUp } from 'lucide-react';
import { supabase, supabaseConfigIssue } from '@/lib/supabase';
import {
  currencies,
  formatArabicNumber,
  formatEditableAmount,
  formatStatementMoney,
  parseLocalizedNumber,
  useStatementAnalysis,
  type CurrencyCode,
} from '@/components/statement-analysis-provider';

const goalOptions = [
  { value: 'car', label: 'سيارة' },
  { value: 'travel', label: 'سفر' },
  { value: 'expansion', label: 'توسّع' },
] as const;

type GoalType = (typeof goalOptions)[number]['value'];

type SavedGoal = {
  goal_type: GoalType;
  target_amount: number;
  currency_code: CurrencyCode;
};

function isGoalType(value: string): value is GoalType {
  return goalOptions.some((option) => option.value === value);
}

function isCurrencyCode(value: string): value is CurrencyCode {
  return currencies.some((currency) => currency.value === value);
}

function getArabicError(error: unknown, stage: 'auth' | 'goal') {
  const details =
    typeof error === 'object' && error !== null
      ? (error as { message?: unknown; code?: unknown; status?: unknown })
      : {};
  const message =
    typeof details.message === 'string' ? details.message.toLowerCase() : '';
  const code = typeof details.code === 'string' ? details.code : '';
  const status =
    typeof details.status === 'number' ? details.status : undefined;

  if (
    message.includes('anonymous sign-ins are disabled') ||
    message.includes('anonymous provider')
  ) {
    return 'الحفظ الآمن يحتاج تفعيل تسجيل الدخول المجهول من إعدادات Supabase.';
  }

  if (stage === 'auth' && status === 404) {
    return 'ما لقينا مشروع Supabase عند رابط الاتصال (404). تأكد أن رابط VITE_SUPABASE_URL من مشروع Clario نفسه.';
  }

  if (stage === 'auth' && (status === 401 || status === 403)) {
    return 'رابط المشروع وصل، لكن مفتاح VITE_SUPABASE_ANON_KEY لا يطابقه أو يحتاج مراجعة إعدادات المفتاح.';
  }

  if (stage === 'goal' && (status === 401 || status === 403)) {
    return 'وصلنا إلى Supabase لكن قراءة الهدف مرفوضة. راجع سياسات الوصول للجدول وإعدادات المفتاح.';
  }

  if (
    code === 'PGRST205' ||
    message.includes('financial_goals') ||
    message.includes('schema cache')
  ) {
    return 'جدول الأهداف ما تجهّز في Supabase للحين. نحتاج إعداد قاعدة البيانات قبل الحفظ.';
  }

  if (stage === 'goal' && status === 404) {
    return 'ما لقينا جدول financial_goals في مشروع Supabase المتصل. تأكد أنك أنشأته في مشروع Clario نفسه.';
  }

  return 'ما قدرنا نوصل للحفظ الآن. جرّب مرة ثانية بعد قليل.';
}

export default function GoalSaver() {
  const {
    analysis,
    isSample,
    currency,
    setCurrency,
    statementCurrency,
    convertBetween,
  } = useStatementAnalysis();
  const [userId, setUserId] = useState<string | null>(null);
  const [goalType, setGoalType] = useState<GoalType>('car');
  const [amount, setAmount] = useState('');
  const [amountCurrency, setAmountCurrency] = useState<CurrencyCode>('KWD');
  const [savedGoal, setSavedGoal] = useState<SavedGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const parsedAmount = parseLocalizedNumber(amount);
  const amountInDisplayCurrency =
    amount === '' || !Number.isFinite(parsedAmount)
      ? null
      : convertBetween(parsedAmount, amountCurrency, currency);
  const displayAmount =
    amount === ''
      ? ''
      : amountCurrency === currency
        ? amount
        : amountInDisplayCurrency === null
        ? ''
        : formatEditableAmount(amountInDisplayCurrency, currency);

  useEffect(() => {
    let active = true;

    async function loadGoal() {
      if (!supabase) {
        if (active) {
          const configMessage =
            supabaseConfigIssue === 'invalid-url'
              ? 'رابط Supabase غير صالح. انسخ Project URL كاملة من إعدادات مشروع Clario، وتأكد أنها تبدأ بـ https://.'
              : supabaseConfigIssue === 'missing-url'
                ? 'رابط مشروع Supabase غير موجود في أسرار Replit.'
                : 'مفتاح anon غير موجود في أسرار Replit.';
          setErrorMessage(configMessage);
          setLoading(false);
        }
        return;
      }

      let stage: 'auth' | 'goal' = 'auth';
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        let currentUser = sessionData.session?.user ?? null;

        if (!currentUser) {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          currentUser = data.user;
        }

        if (!currentUser) {
          throw new Error('Could not create a secure session.');
        }

        stage = 'goal';
        const { data, error } = await supabase
          .from('financial_goals')
          .select('goal_type, target_amount, currency_code')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (error) throw error;

        if (!active) return;

        setUserId(currentUser.id);

        if (data && isGoalType(data.goal_type) && isCurrencyCode(data.currency_code)) {
          const loadedGoal = {
            goal_type: data.goal_type,
            target_amount: Number(data.target_amount),
            currency_code: data.currency_code,
          };
          setSavedGoal(loadedGoal);
          setGoalType(loadedGoal.goal_type);
          setAmount(
            formatEditableAmount(
              loadedGoal.target_amount,
              loadedGoal.currency_code,
            ),
          );
          setAmountCurrency(loadedGoal.currency_code);
        }
      } catch (error) {
        if (active) setErrorMessage(getArabicError(error, stage));
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadGoal();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!supabase || !userId) {
      setErrorMessage('الحفظ الآمن مو جاهز للحين. حدّث الصفحة أو جرّب بعد قليل.');
      return;
    }

    const targetAmount = parseLocalizedNumber(displayAmount);
    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      setErrorMessage(
        amount !== '' && displayAmount === ''
          ? 'ننتظر تحديث أسعار الصرف لتحويل مبلغ هدفك.'
          : 'اكتب مبلغاً أكبر من صفر.',
      );
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .upsert(
          {
            user_id: userId,
            goal_type: goalType,
            target_amount: targetAmount,
            currency_code: currency,
          },
          { onConflict: 'user_id' },
        )
        .select('goal_type, target_amount, currency_code')
        .single();

      if (error) throw error;
      if (!isGoalType(data.goal_type) || !isCurrencyCode(data.currency_code)) {
        throw new Error('Saved goal returned an unexpected value.');
      }

      const nextGoal = {
        goal_type: data.goal_type,
        target_amount: Number(data.target_amount),
        currency_code: data.currency_code,
      };
      setSavedGoal(nextGoal);
      setSuccessMessage('انحفظ هدفك. تقدر تعدله متى ما بغيت.');
    } catch (error) {
      setErrorMessage(getArabicError(error, 'goal'));
    } finally {
      setSaving(false);
    }
  }

  const selectedGoalLabel =
    goalOptions.find((option) => option.value === savedGoal?.goal_type)?.label ?? '';
  const savedGoalDisplayAmount = savedGoal
    ? convertBetween(
        savedGoal.target_amount,
        savedGoal.currency_code,
        currency,
      )
    : null;
  const monthlySavingsDisplayAmount = convertBetween(
    analysis.monthlySurplus,
    statementCurrency,
    currency,
  );
  const monthsToGoal =
    savedGoalDisplayAmount !== null &&
    monthlySavingsDisplayAmount !== null &&
    monthlySavingsDisplayAmount > 0
      ? Math.ceil(savedGoalDisplayAmount / monthlySavingsDisplayAmount)
      : null;
  const monthlyGoalProgress =
    savedGoalDisplayAmount !== null &&
    monthlySavingsDisplayAmount !== null &&
    savedGoalDisplayAmount > 0 &&
    monthlySavingsDisplayAmount > 0
      ? Math.min(
          100,
          Math.round(
            (monthlySavingsDisplayAmount / savedGoalDisplayAmount) * 100,
          ),
        )
      : 0;
  const goalMonthLabel =
    monthsToGoal === 1
      ? 'شهر'
      : monthsToGoal === 2
        ? 'شهرين'
        : monthsToGoal !== null && monthsToGoal <= 10
          ? 'شهور'
          : 'شهر';

  return (
    <section
      className="goal-section"
      id="goal"
      aria-labelledby="goal-title"
      data-scroll-reveal
    >
      <div className="goal-copy">
        <span className="section-kicker">خطوة صغيرة وواضحة</span>
        <h2 id="goal-title">وش هدفك المالي الجاي؟</h2>
        <p>
          اختر هدفاً واحداً وحط المبلغ اللي تبيه. نحفظه لك عشان تكون البداية
          مرتبة.
        </p>
        <p className="goal-privacy-note">
          الحفظ مرتبط بهذا المتصفح حالياً. إذا مسحت بيانات التصفح، ممكن تفقد
          الوصول لهدفك.
        </p>
        {savedGoal && (
          <div className="saved-goal" data-testid="text-saved-goal">
            <span className="saved-goal-icon" aria-hidden="true">
              <Check size={16} />
            </span>
            <span>
              هدفك الحالي: <strong>{selectedGoalLabel}</strong> —{' '}
              <strong>
                {formatStatementMoney(
                  savedGoalDisplayAmount ?? savedGoal.target_amount,
                  savedGoalDisplayAmount === null
                    ? savedGoal.currency_code
                    : currency,
                )}
              </strong>
            </span>
          </div>
        )}
        {savedGoal && (
          <div
            className="goal-forecast"
            data-testid="goal-forecast"
            aria-live="polite"
          >
            <div className="goal-forecast-heading">
              <span className="goal-forecast-icon" aria-hidden="true">
                <TrendingUp size={17} />
              </span>
              <span>{isSample ? 'على المثال التوضيحي' : 'على حسب كشفك'}</span>
            </div>
            {monthsToGoal !== null && monthlySavingsDisplayAmount !== null ? (
              <>
                <p className="goal-forecast-result">
                  بهالمعدل توصل هدفك بعد{' '}
                  <strong>
                    {formatArabicNumber(monthsToGoal)} {goalMonthLabel}
                  </strong>
                  تقريباً.
                </p>
                <p className="goal-forecast-rate">
                  إذا ادّخرت{' '}
                  <strong>
                    {formatStatementMoney(
                      monthlySavingsDisplayAmount,
                      currency,
                    )}
                  </strong>{' '}
                  كل شهر.
                </p>
                <div className="goal-forecast-progress-copy">
                  <span>ادخار شهر واحد</span>
                  <strong>{formatArabicNumber(monthlyGoalProgress)}٪ من الهدف</strong>
                </div>
                <div
                  className="goal-forecast-progress"
                  data-testid="goal-progress"
                  role="progressbar"
                  aria-label="نسبة ادخار شهر واحد من الهدف"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={monthlyGoalProgress}
                  aria-valuetext={`${formatArabicNumber(monthlyGoalProgress)}٪ من الهدف`}
                >
                  <span style={{ width: `${monthlyGoalProgress}%` }} />
                </div>
              </>
            ) : monthlySavingsDisplayAmount === null ||
              savedGoalDisplayAmount === null ? (
              <p className="goal-forecast-message">
                ننتظر سعر الصرف عشان نحسب المدة بعملة هدفك.
              </p>
            ) : (
              <p className="goal-forecast-message">
                هذا الكشف ما يبيّن فائضًا شهريًا موجبًا، فما نقدر نقدّر مدة
                الوصول لهدفك للحين.
              </p>
            )}
            <p className="goal-forecast-footnote">
              {isSample
                ? 'تقدير المثال للتجربة فقط؛ ما يعكس وضعك الحقيقي.'
                : 'تقدير على وتيرة هذا الكشف، مو على مبلغ محفوظ فعليًا.'}
            </p>
          </div>
        )}
      </div>

      <form className="goal-form" onSubmit={handleSubmit} data-testid="form-save-goal">
        <div className="goal-form-heading">
          <span className="section-kicker">هدف واحد كبداية</span>
          <span className="goal-count">{formatArabicNumber(1)} / {formatArabicNumber(1)}</span>
        </div>

        <label className="goal-field">
          <span>نوع الهدف</span>
          <select
            value={goalType}
            onChange={(event) => setGoalType(event.target.value as GoalType)}
            disabled={loading || saving || Boolean(errorMessage)}
            data-testid="select-goal-type"
          >
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="goal-form-row">
          <label className="goal-field">
            <span>المبلغ المستهدف</span>
            <input
              type="text"
              inputMode="decimal"
              dir="ltr"
              value={displayAmount}
              onChange={(event) => {
                setAmount(event.target.value);
                setAmountCurrency(currency);
              }}
              placeholder="مثال: ٢٥٠٠"
              required
              disabled={
                loading ||
                saving ||
                Boolean(errorMessage) ||
                (amount !== '' && displayAmount === '')
              }
              data-testid="input-goal-amount"
            />
          </label>
          <label className="goal-field">
            <span>العملة</span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              disabled={loading || saving || Boolean(errorMessage)}
              data-testid="select-goal-currency"
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {errorMessage && (
          <p className="goal-message goal-error" role="alert" data-testid="status-goal-error">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p
            className="goal-message goal-success"
            role="status"
            aria-live="polite"
            data-testid="status-goal-success"
          >
            <Check size={16} aria-hidden="true" />
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          className="goal-submit"
          disabled={loading || saving || Boolean(errorMessage)}
          data-testid="button-save-goal"
        >
          {loading || saving ? (
            <>
              <LoaderCircle size={17} className="goal-spinner" aria-hidden="true" />
              {loading ? 'لحظة، نجهّز الحفظ' : 'جاري الحفظ'}
            </>
          ) : (
            <>
              {savedGoal ? 'حدّث هدفك' : 'احفظ هدفك'}
              <ArrowLeft size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </section>
  );
}
