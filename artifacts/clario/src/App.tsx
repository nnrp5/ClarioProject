import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CurrencySelector from '@/components/currency-selector';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import ClarioWordmark from '@/components/clario-wordmark';
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
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  Check,
  Goal,
  Lightbulb,
  LockKeyhole,
  Menu,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import GoalSaver from '@/components/goal-saver';
import HireSimulator from '@/components/hire-simulator';
import {
  formatStatementMoney,
  StatementAnalysisProvider,
  useStatementAnalysis,
} from '@/components/statement-analysis-provider';
import StatementExperience from '@/components/statement-experience';
import {
  DashboardHome,
  DashboardShell,
} from '@/pages/dashboard';

const queryClient = new QueryClient();

function Home() {
  const { currency, convertBetween } = useStatementAnalysis();
  const formatSampleAmount = (amount: number) => {
    const converted = convertBetween(amount, 'KWD', currency);
    return converted === null ? '—' : formatStatementMoney(converted, currency);
  };

  return (
    <main className="clario-page clario-public-home" dir="rtl" lang="ar">
      <div className="clario-container">
        <header className="clario-nav" data-testid="header-navigation">
          <a className="clario-logo" href="/" aria-label="كلاريو، بداية الصفحة" data-testid="link-home">
            <ClarioWordmark />
          </a>
          <nav className="nav-links" aria-label="التنقل الرئيسي">
            <a href="#analysis" data-testid="link-statement-analysis">حلّل كشفك</a>
            <a href="#how" data-testid="link-how-it-works">كيف الفكرة</a>
            <a href="#goal" data-testid="link-goal">هدفك الأول</a>
            <Link
              className="dashboard-menu-link"
              href="/dashboard"
              aria-label="لوحة التحكم"
              title="لوحة التحكم"
              data-testid="link-public-dashboard"
            >
              <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <CurrencySelector />
          </nav>
        </header>

        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow reveal">فلوسك، بسوالف واضحة</div>
            <h1 className="reveal delay-1" id="hero-title">
              قراراتك المالية<br />
              تصير <span>أوضح وأسهل.</span>
            </h1>
            <p className="hero-lede reveal delay-2">
              كلاريو يساعدك تفهم وضعك المالي بكلام بسيط، وتعرف وش تعني أرقامك لقراراتك اليومية.
            </p>
            <div className="hero-actions reveal delay-2">
              <a className="button-primary" href="#analysis" data-testid="link-explore-capabilities">
                ارفع كشفك وشوف النتيجة <ArrowLeft size={16} aria-hidden="true" />
              </a>
              <a className="text-link" href="#how" data-testid="link-learn-more">عن كلاريو</a>
            </div>
            <div className="hero-privacy-badge reveal delay-2">
              <LockKeyhole size={16} aria-hidden="true" />
              <span><strong>كشفك ما يغادر جهازك</strong> — نحلّله داخل متصفحك فقط.</span>
            </div>
            <p className="hero-footnote reveal delay-2">معلومة مفهومة. قرارك يظل لك.</p>
          </div>

          <div className="visual-stage" aria-label="تصوير توضيحي لطريقة كلاريو في تبسيط الأرقام">
            <div className="visual-disc" aria-hidden="true">
              <div className="sun-orbit">
                <div className="sun" />
                <span className="orbit-dot" />
              </div>
            </div>
            <article className="report-card" aria-label="مثال توضيحي لملخص مالي">
              <div className="report-top">
                <span><i className="status-dot" /> مثال توضيحي</span>
                <Sparkles size={15} aria-hidden="true" />
              </div>
              <h2 className="report-title">ملخص وضعك</h2>
              <p className="report-subtitle">نظرة بسيطة على الشهر</p>
              <div className="report-rule" />
              <div className="report-line">
                <span className="report-label"><i className="mini-icon"><WalletCards size={13} /></i> الدخل</span>
                <span className="report-value">{formatSampleAmount(850)}</span>
              </div>
              <div className="report-line">
                <span className="report-label"><i className="mini-icon"><ChartNoAxesColumnIncreasing size={13} /></i> المصاريف</span>
                <span className="report-value">{formatSampleAmount(560)}</span>
              </div>
              <div className="insight-note">
                <Lightbulb size={14} aria-hidden="true" />
                <span>باقي لك مبلغ بعد مصاريفك. تعرّف وين يروح قبل خطوتك الجاية.</span>
              </div>
            </article>
            <div className="floating-stamp" aria-label="بهدوء ووضوح">
              <span>خطوة بخطوة<br /><strong>على راحتك</strong></span>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true">كمّل واكتشف</div>
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
            <span className="section-kicker">الفكرة ببساطة</span>
            <h2 id="how-title">من صورة متفرقة، لفهم يطمّنّك.</h2>
            <p>كلاريو في بدايته يركز على تبسيط المعلومات المالية الأساسية. خطوة صغيرة، وصورة أوضح.</p>
          </div>
          <div className="steps">
            <article className="step">
              <span className="step-index">٠١</span>
              <div>
                <h3>نجمع لك الصورة</h3>
                <p>تشوف المعلومات المهمة في مكان واحد بدل ما تظل متفرقة في بالك.</p>
              </div>
            </article>
            <article className="step">
              <span className="step-index">٠٢</span>
              <div>
                <h3>نشرحها بلغة قريبة</h3>
                <p>المعنى يجيك بكلام واضح، مو مصطلحات مالية تزيد الحيرة.</p>
              </div>
            </article>
            <article className="step">
              <span className="step-index">٠٣</span>
              <div>
                <h3>تقرر وأنت أهدى</h3>
                <p>تفهم وضعك أكثر، وتختار بنفسك وش الخطوة المناسبة لك.</p>
              </div>
            </article>
            <article className="step">
              <span className="step-index">٠٤</span>
              <div>
                <h3>مصمم للمستقلين وأصحاب الأعمال والموظفين</h3>
                <p>عشان تفهم أرقامك وتختار خطوتك الجاية بوضوح.</p>
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
        <section className="public-home-tools" aria-labelledby="public-home-tools-title">
          <h2 id="public-home-tools-title">أدوات إضافية</h2>
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
                <strong>قرار التوظيف</strong>
                <small>جرّب أثر توظيف شخص على ميزانيتك.</small>
              </span>
              <ArrowLeft size={17} aria-hidden="true" />
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
                <strong>هدفك المالي الجاي</strong>
                <small>اختر هدفًا وشوف وش تحتاج له.</small>
              </span>
              <ArrowLeft size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <aside className="promise" aria-label="وعدنا لك" data-scroll-reveal>
          <div className="promise-copy">
            <span className="section-kicker">وعدنا لك</span>
            <h2>نوضح لك الصورة. ما نقرر عنك.</h2>
            <p>
              كلاريو أداة للفهم والوضوح، مو نصيحة استثمارية ولا بديل عن مختص.
              نؤمن إن القرار الأفضل يبدأ لما تكون الصورة قدامك.
            </p>
          </div>
          <div className="promise-mark" aria-hidden="true">
            <Check strokeWidth={1.5} />
          </div>
        </aside>

        <div className="section-divider public-home-footer-divider" aria-hidden="true" />

        <footer className="footer">
          <div className="footer-main">
            <a className="clario-logo" href="#top" aria-label="كلاريو، بداية الصفحة" data-testid="link-footer-home">
              <ClarioWordmark />
            </a>
            <div className="footer-note">
              <ArrowDown size={13} aria-hidden="true" />
              بداية أوضح لعلاقة أهدى مع فلوسك.
            </div>
            <p>كلاريو — خصوصيتك أولاً.</p>
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
      <div className="clario-page dashboard-service-surface" lang="ar" dir="rtl">
        <StatementExperience />
      </div>
    </DashboardShell>
  );
}

function DashboardHirePage() {
  return (
    <DashboardShell activeRoute="hire">
      <div className="clario-page dashboard-service-surface" lang="ar" dir="rtl">
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
      <div className="clario-page dashboard-service-surface" lang="ar" dir="rtl">
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
  );
}

export default App;
