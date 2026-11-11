import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, LoaderCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const goalOptions = [
  { value: 'car', label: 'سيارة' },
  { value: 'travel', label: 'سفر' },
  { value: 'expansion', label: 'توسّع' },
] as const;

const currencies = [
  { value: 'KWD', label: 'د.ك — دينار كويتي' },
  { value: 'SAR', label: 'ر.س — ريال سعودي' },
  { value: 'AED', label: 'د.إ — درهم إماراتي' },
  { value: 'QAR', label: 'ر.ق — ريال قطري' },
  { value: 'BHD', label: 'د.ب — دينار بحريني' },
  { value: 'OMR', label: 'ر.ع — ريال عُماني' },
] as const;

type GoalType = (typeof goalOptions)[number]['value'];
type CurrencyCode = (typeof currencies)[number]['value'];

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

function formatAmount(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('ar-KW', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getArabicError(error: unknown) {
  const details =
    typeof error === 'object' && error !== null
      ? (error as { message?: unknown; code?: unknown; status?: unknown })
      : {};
  const message =
    typeof details.message === 'string' ? details.message.toLowerCase() : '';
  const code = typeof details.code === 'string' ? details.code : '';

  if (
    message.includes('anonymous sign-ins are disabled') ||
    message.includes('anonymous provider')
  ) {
    return 'الحفظ الآمن يحتاج تفعيل تسجيل الدخول المجهول من إعدادات Supabase.';
  }

  if (
    code === 'PGRST205' ||
    message.includes('financial_goals') ||
    message.includes('schema cache')
  ) {
    return 'جدول الأهداف ما تجهّز في Supabase للحين. نحتاج إعداد قاعدة البيانات قبل الحفظ.';
  }

  return 'ما قدرنا نوصل للحفظ الآن. جرّب مرة ثانية بعد قليل.';
}

export default function GoalSaver() {
  const [userId, setUserId] = useState<string | null>(null);
  const [goalType, setGoalType] = useState<GoalType>('car');
  const [amount, setAmount] = useState('');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('KWD');
  const [savedGoal, setSavedGoal] = useState<SavedGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadGoal() {
      if (!supabase) {
        if (active) {
          setErrorMessage('إعدادات Supabase غير مكتملة في بيئة التشغيل.');
          setLoading(false);
        }
        return;
      }

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
          setAmount(String(loadedGoal.target_amount));
          setCurrencyCode(loadedGoal.currency_code);
        }
      } catch (error) {
        if (active) setErrorMessage(getArabicError(error));
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

    const targetAmount = Number(amount);
    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      setErrorMessage('اكتب مبلغاً أكبر من صفر.');
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
            currency_code: currencyCode,
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
      setErrorMessage(getArabicError(error));
    } finally {
      setSaving(false);
    }
  }

  const selectedGoalLabel =
    goalOptions.find((option) => option.value === savedGoal?.goal_type)?.label ?? '';

  return (
    <section className="goal-section" id="goal" aria-labelledby="goal-title">
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
                {formatAmount(savedGoal.target_amount, savedGoal.currency_code)}
              </strong>
            </span>
          </div>
        )}
      </div>

      <form className="goal-form" onSubmit={handleSubmit} data-testid="form-save-goal">
        <div className="goal-form-heading">
          <span className="section-kicker">هدف واحد كبداية</span>
          <span className="goal-count">01 / 01</span>
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
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              dir="ltr"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="مثال: 2500"
              required
              disabled={loading || saving || Boolean(errorMessage)}
              data-testid="input-goal-amount"
            />
          </label>
          <label className="goal-field">
            <span>العملة</span>
            <select
              value={currencyCode}
              onChange={(event) =>
                setCurrencyCode(event.target.value as CurrencyCode)
              }
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
