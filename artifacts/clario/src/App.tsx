import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CurrencySelector from '@/components/currency-selector';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import ClarioWordmark from '@/components/clario-wordmark';
import {
  LanguageProvider,
  LanguageSwitcher,
  useLanguage,
} from '@/components/language-provider';
import NotFound from '@/pages/not-found';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  Check,
  Goal,
  Lightbulb,
  LockKeyhole,
  ListChecks,
  Menu,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import GoalSaver from '@/components/goal-saver';
import HireSimulator from '@/components/hire-simulator';
import MonthlyPlan from '@/components/monthly-plan';
import {
  formatStatementMoney,
  StatementAnalysisProvider,
  useStatementAnalysis,
} from '@/components/statement-analysis-provider';
import { formatLocaleNumber } from '@/lib/localization';
import StatementExperience from '@/components/statement-experience';
import {
  DashboardHome,
  DashboardShell,
} from '@/pages/dashboard';

const queryClient = new QueryClient();

function Home() {
  const {
    currency,
    convertBetween,
    isProcessing,
    showNextSample,
  } = useStatementAnalysis();
  const { language, direction, t } = useLanguage();
  const [isMonthlyPlanOpen, setIsMonthlyPlanOpen] = useState(false);
  const formatSampleAmount = (amount: number) => {
    const converted = convertBetween(amount, 'KWD', currency);
    return converted === null
      ? '—'
      : formatStatementMoney(converted, currency, language);
  };
  function handleHeroSample() {
    showNextSample();
    window.setTimeout(() => {
      const result = document.querySelector<HTMLElement>(
        '.clario-public-home .statement-result-card',
      );
      result?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'center',
      });
      result?.focus({ preventScroll: true });
    }, 80);
  }

  useEffect(() => {
    if (!isMonthlyPlanOpen) return;
    const plan = document.getElementById('monthly-plan');
    plan?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });
  }, [isMonthlyPlanOpen]);

  useEffect(() => {
    setIsMonthlyPlanOpen(false);
  }, [language]);

  return (
    <main className="clario-page clario-public-home" dir={direction} lang={language}>
      <div className="clario-container">
        <header className="clario-nav" data-testid="header-navigation">
          <a className="clario-logo" href="/" aria-label={t('كلاريو، بداية الصفحة')} data-testid="link-home">
            <ClarioWordmark />
          </a>
          <nav className="nav-links" aria-label={t('التنقل الرئيسي')}>
            <a href="#analysis" data-testid="link-statement-analysis">{t('حلّل كشفك')}</a>
            <a href="#how" data-testid="link-how-it-works">{t('كيف الفكرة')}</a>
            <a href="#goal" data-testid="link-goal">{t('هدفك الأول')}</a>
            <Link
              className="dashboard-menu-link"
              href="/dashboard"
              aria-label={t('لوحة التحكم')}
              title={t('لوحة التحكم')}
              data-testid="link-public-dashboard"
            >
              <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <CurrencySelector />
            <LanguageSwitcher />
          </nav>
        </header>

        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow reveal">{t('فلوسك بشكل أوضح')}</div>
            <h1 className="reveal delay-1" id="hero-title">
              {t('قراراتك المالية')}<br />
              {t('تصير ')}<span>{t('أوضح وأسهل.')}</span>
            </h1>
            <p className="hero-lede reveal delay-2">
              {t('كلاريو يساعدك تفهم وضعك المالي بكلام بسيط، وتعرف وش تعني أرقامك لقراراتك اليومية.')}
            </p>
            <div className="hero-actions reveal delay-2">
              <a className="button-primary" href="#analysis" data-testid="link-explore-capabilities">
                {t('ارفع كشفك وشوف النتيجة')}{language === 'ar' ? <ArrowLeft size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
              </a>
              <button
                type="button"
                className="button-primary hero-sample-button"
                onClick={handleHeroSample}
                disabled={isProcessing}
                aria-label={t('جرّب بكشف تجريبي')}
                data-testid="button-hero-try-sample"
              >
                <Sparkles size={16} aria-hidden="true" />
                {t('جرّب بكشف تجريبي')}
              </button>
              <a className="text-link" href="#how" data-testid="link-learn-more">{t('عن كلاريو')}</a>
            </div>
            <div className="hero-privacy-badge reveal delay-2">
              <LockKeyhole size={16} aria-hidden="true" />
              <span><strong>{t('كشفك ما يغادر جهازك')}</strong>{t(' — نحلّله داخل متصفحك فقط.')}</span>
            </div>
            <p className="hero-footnote reveal delay-2">{t('معلومة مفهومة. قرارك يظل لك.')}</p>
          </div>

          <div className="visual-stage" aria-label={t('تصوير توضيحي لطريقة كلاريو في تبسيط الأرقام')}>
            <div className="visual-disc" aria-hidden="true">
              <div className="sun-orbit">
                <div className="sun" />
                <span className="orbit-dot" />
              </div>
            </div>
            <article className="report-card" aria-label={t('مثال توضيحي لملخص مالي')}>
              <div className="report-top">
                <span><i className="status-dot" /> {t('مثال توضيحي')}</span>
                <Sparkles size={15} aria-hidden="true" />
              </div>
              <h2 className="report-title">{t('ملخص وضعك')}</h2>
              <p className="report-subtitle">{t('نظرة بسيطة على الشهر')}</p>
              <div className="report-rule" />
              <div className="report-line">
                <span className="report-label"><i className="mini-icon"><WalletCards size={13} /></i> {t('الدخل')}</span>
                <span className="report-value">{formatSampleAmount(850)}</span>
              </div>
              <div className="report-line">
                <span className="report-label"><i className="mini-icon"><ChartNoAxesColumnIncreasing size={13} /></i> {t('المصاريف')}</span>
                <span className="report-value">{formatSampleAmount(560)}</span>
              </div>
              <div className="insight-note">
                <Lightbulb size={14} aria-hidden="true" />
                <span>{t('باقي لك مبلغ بعد مصاريفك. تعرّف وين يروح قبل خطوتك الجاية.')}</span>
              </div>
            </article>
            <div className="floating-stamp" aria-label={t('بهدوء ووضوح')}>
              <span>{t('خطوة بخطوة')}<br /><strong>{t('على راحتك')}</strong></span>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true">{t('كمّل واكتشف')}</div>
        </section>
      </div>

      <div className="clario-container">
        <div className="section-divider" aria-hidden="true" />
      </div>

      <div className="clario-container">
        <section
          className="how-section"
          id="how"
          aria-labelledby="how-title"
          data-scroll-reveal
        >
          <div className="how-intro">
            <span className="section-kicker">{t('الفكرة ببساطة')}</span>
            <h2 id="how-title">{t('من صورة متفرقة، لفهم يطمّنّك.')}</h2>
            <p>{t('كلاريو في بدايته يركز على تبسيط المعلومات المالية الأساسية. خطوة صغيرة، وصورة أوضح.')}</p>
          </div>
          <div className="steps">
            <article className="step">
              <span className="step-index">{formatLocaleNumber(1, language, 2)}</span>
              <div>
                <h3>{t('نجمع لك الصورة')}</h3>
                <p>{t('تشوف المعلومات المهمة في مكان واحد بدل ما تظل متفرقة في بالك.')}</p>
              </div>
            </article>
            <article className="step">
              <span className="step-index">{formatLocaleNumber(2, language, 2)}</span>
              <div>
                <h3>{t('نشرحها بلغة قريبة')}</h3>
                <p>{t('المعنى يجيك بكلام واضح، مو مصطلحات مالية تزيد الحيرة.')}</p>
              </div>
            </article>
            <article className="step">
              <span className="step-index">{formatLocaleNumber(3, language, 2)}</span>
              <div>
                <h3>{t('تقرر وأنت أهدى')}</h3>
                <p>{t('تفهم وضعك أكثر، وتختار بنفسك وش الخطوة المناسبة لك.')}</p>
              </div>
            </article>
            <article className="step">
              <span className="step-index">{formatLocaleNumber(4, language, 2)}</span>
              <div>
                <h3>{t('مصمم للمستقلين وأصحاب الأعمال والموظفين')}</h3>
                <p>{t('عشان تفهم أرقامك وتختار خطوتك الجاية بوضوح.')}</p>
              </div>
            </article>
          </div>
        </section>
      </div>

      <div className="clario-container">
        <div className="section-divider" aria-hidden="true" />
      </div>

      <StatementExperience variant="home" />

      <div className="clario-container">
        <div className="section-divider" aria-hidden="true" />
      </div>

      <div className="clario-container public-home-lower">
        <section
          className="public-home-tools"
          id="public-home-tools"
          aria-labelledby="public-home-tools-title"
        >
          <h2 id="public-home-tools-title">{t('أدوات إضافية')}</h2>
          <div className="public-home-tools-grid">
            <Link
              className="public-home-tool-card"
              href="/dashboard/hire"
              data-testid="link-public-hire"
            >
              <span className="public-home-tool-icon public-home-tool-icon--hire">
                <BriefcaseBusiness size={20} aria-hidden="true" />
              </span>
              <span className="public-home-tool-copy">
                <strong>{t('قرار التوظيف')}</strong>
                <small>{t('جرّب أثر توظيف شخص على ميزانيتك.')}</small>
              </span>
              {language === 'ar' ? <ArrowLeft size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
            </Link>
            <Link
              className="public-home-tool-card"
              href="/dashboard/goal"
              id="goal"
              data-testid="link-public-goal"
            >
              <span className="public-home-tool-icon public-home-tool-icon--goal">
                <Goal size={20} aria-hidden="true" />
              </span>
              <span className="public-home-tool-copy">
                <strong>{t('هدفك المالي الجاي')}</strong>
                <small>{t('اختر هدفًا وشوف وش تحتاج له.')}</small>
              </span>
              {language === 'ar' ? <ArrowLeft size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
            </Link>
            <button
              type="button"
              className="public-home-tool-card"
              aria-expanded={isMonthlyPlanOpen}
              aria-controls="home-monthly-plan"
              onClick={() => setIsMonthlyPlanOpen((open) => !open)}
              data-testid="button-public-monthly-plan"
            >
              <span className="public-home-tool-icon">
                <ListChecks size={20} aria-hidden="true" />
              </span>
              <span className="public-home-tool-copy">
                <strong>{t('خطتك هالشهر')}</strong>
                <small>{t('ثلاث خطوات عملية من واقع كشفك.')}</small>
              </span>
              {language === 'ar' ? <ArrowLeft size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </div>
          <div
            className="public-home-plan-panel"
            id="home-monthly-plan"
            hidden={!isMonthlyPlanOpen}
          >
            <MonthlyPlan />
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <aside className="promise" aria-label={t('وعدنا لك')} data-scroll-reveal>
          <div className="promise-copy">
            <span className="section-kicker">{t('وعدنا لك')}</span>
            <h2>{t('نوضح لك الصورة. ما نقرر عنك.')}</h2>
            <p>
              {t('كلاريو أداة للفهم والوضوح، مو نصيحة استثمارية ولا بديل عن مختص.')}
              {' '}{t('نؤمن إن القرار الأفضل يبدأ لما تكون الصورة قدامك.')}
            </p>
          </div>
          <div className="promise-mark" aria-hidden="true">
            <Check strokeWidth={1.5} />
          </div>
        </aside>

        <div className="section-divider public-home-footer-divider" aria-hidden="true" />

        <footer className="footer">
          <div className="footer-main">
            <a className="clario-logo" href="#top" aria-label={t('كلاريو، بداية الصفحة')} data-testid="link-footer-home">
              <ClarioWordmark />
            </a>
            <div className="footer-note">
              <ArrowDown size={13} aria-hidden="true" />
              {t('بداية أوضح لعلاقة أهدى مع فلوسك.')}
            </div>
            <p>{t('كلاريو — خصوصيتك أولاً.')}</p>
          </div>
          <div className="footer-contact" aria-label="Contact information" dir="ltr">
            <a href="mailto:azaou@outlook.com">Email:azaou@outlook.com</a>
            <a href="tel:+96550205073">Phone:+965 50205073</a>
          </div>
          <p className="footer-credit" dir="ltr">
            Made by: Abdulaziz ali hamada
          </p>
        </footer>
      </div>
    </main>
  );
}

function DashboardOverviewPage() {
  return (
    <DashboardShell activeRoute="overview">
      <DashboardHome />
    </DashboardShell>
  );
}

function DashboardAnalysisPage() {
  return (
    <DashboardShell activeRoute="analysis">
      <div className="clario-page dashboard-service-surface">
        <StatementExperience />
      </div>
    </DashboardShell>
  );
}

function DashboardHirePage() {
  return (
    <DashboardShell activeRoute="hire">
      <div className="clario-page dashboard-service-surface">
        <div className="clario-container">
          <HireSimulator />
        </div>
      </div>
    </DashboardShell>
  );
}

function DashboardGoalPage() {
  return (
    <DashboardShell activeRoute="goal">
      <div className="clario-page dashboard-service-surface">
        <div className="clario-container">
          <GoalSaver />
        </div>
      </div>
    </DashboardShell>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={DashboardOverviewPage} />
        <Route path="/dashboard/analysis" component={DashboardAnalysisPage} />
        <Route path="/dashboard/hire" component={DashboardHirePage} />
        <Route path="/dashboard/goal" component={DashboardGoalPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const observed = new Set<Element>();
    const root = document.documentElement;
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    const observeNewSections = () => {
      document.querySelectorAll('[data-scroll-reveal]').forEach((target) => {
        if (observed.has(target)) return;
        observed.add(target);
        target.setAttribute('data-reveal-watching', '');
        revealObserver.observe(target);
      });
    };
    const routeObserver = new MutationObserver(observeNewSections);

    root.classList.add('clario-motion-ready');
    observeNewSections();
    routeObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      routeObserver.disconnect();
      revealObserver.disconnect();
      observed.forEach((target) => {
        target.removeAttribute('data-reveal-watching');
        target.classList.remove('is-revealed');
      });
      root.classList.remove('clario-motion-ready');
    };
  }, []);

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <StatementAnalysisProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
          </StatementAnalysisProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
