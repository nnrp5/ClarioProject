import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
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
  ChartNoAxesColumnIncreasing,
  Check,
  Lightbulb,
  Menu,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import GoalSaver from '@/components/goal-saver';
import HireSimulator from '@/components/hire-simulator';
import {
  StatementAnalysisProvider,
} from '@/components/statement-analysis-provider';
import StatementExperience from '@/components/statement-experience';
import {
  DashboardHome,
  DashboardShell,
} from '@/pages/dashboard';

const queryClient = new QueryClient();

function Home() {
  return (
    <main className="clario-page" dir="rtl" lang="ar">
      <div className="clario-container">
        <header className="clario-nav" data-testid="header-navigation">
          <a className="clario-logo" href="#top" aria-label="كلاريو، بداية الصفحة" data-testid="link-home">
            <span className="clario-mark" aria-hidden="true">ك</span>
            <span>clario</span>
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
              <a className="button-primary" href="#goal" data-testid="link-explore-capabilities">
                احفظ هدفك الأول <ArrowLeft size={16} aria-hidden="true" />
              </a>
              <a className="text-link" href="#how" data-testid="link-learn-more">عن كلاريو</a>
            </div>
            <p className="hero-footnote reveal delay-2">معلومة مفهومة. قرارك يظل لك.</p>
          </div>

          <div className="visual-stage" aria-label="تصوير توضيحي لطريقة كلاريو في تبسيط الأرقام">
            <div className="visual-disc" aria-hidden="true">
              <div className="sun-orbit">
                <div className="sun" />
                <span className="orbit-dot" />
              </div>
              <span className="orbit-label">من الأرقام إلى الصورة الأوضح</span>
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
                <span className="report-value">12,400 ر.س</span>
              </div>
              <div className="report-line">
                <span className="report-label"><i className="mini-icon"><ChartNoAxesColumnIncreasing size={13} /></i> المصاريف</span>
                <span className="report-value">8,260 ر.س</span>
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

        <section className="intro-band" aria-labelledby="intro-title">
          <div>
            <span className="section-kicker">مو لازم تكون خبير</span>
            <h2 id="intro-title">المال جزء من يومك. فهمه ما يحتاج قاموس.</h2>
          </div>
          <div className="intro-text">
            <p>بين دخل يتغيّر، التزامات، ومصاريف ما توقف — أحيانًا الصورة الكبيرة تضيع. كلاريو يرتّبها لك ويشرحها بلغة قريبة منك.</p>
            <p>مصمم لأهل الخليج: للمستقل، وصاحب المشروع الصغير، والموظف اللي يبي ياخذ قراره وهو فاهم.</p>
            <div className="audience-strip" aria-label="لمن صمم كلاريو">
              <span>للمستقلين</span><span>لأصحاب الأعمال</span><span>للموظفين</span>
            </div>
          </div>
        </section>
      </div>

      <div className="clario-container">
        <section className="how-section" id="how" aria-labelledby="how-title">
          <div className="how-intro">
            <span className="section-kicker">الفكرة ببساطة</span>
            <h2 id="how-title">من صورة متفرقة، لفهم يطمنّك.</h2>
            <p>كلاريو في بدايته يركز على تبسيط المعلومات المالية الأساسية. خطوة صغيرة، وصورة أوضح.</p>
          </div>
          <div className="steps">
            <article className="step">
              <span className="step-index">01</span>
              <div>
                <h3>نجمع لك الصورة</h3>
                <p>تشوف المعلومات المهمة في مكان واحد بدل ما تظل متفرقة في بالك.</p>
              </div>
            </article>
            <article className="step">
              <span className="step-index">02</span>
              <div>
                <h3>نشرحها بلغة قريبة</h3>
                <p>المعنى يجيك بكلام واضح، مو مصطلحات مالية تزيد الحيرة.</p>
              </div>
            </article>
            <article className="step">
              <span className="step-index">03</span>
              <div>
                <h3>تقرر وأنت أهدى</h3>
                <p>تفهم وضعك أكثر، وتختار بنفسك وش الخطوة المناسبة لك.</p>
              </div>
            </article>
          </div>
        </section>
      </div>

      <StatementExperience />

      <div className="clario-container">
        <HireSimulator />
        <GoalSaver />

        <aside className="promise" aria-label="مبادئ كلاريو">
          <div className="promise-copy">
            <span className="section-kicker">وعدنا لك</span>
            <h2>نوضح لك الصورة. ما نقرر عنك.</h2>
            <p>كلاريو أداة للفهم والوضوح، مو نصيحة استثمارية ولا بديل عن مختص. نؤمن إن القرار الأفضل يبدأ لما تكون الصورة قدامك.</p>
          </div>
          <div className="promise-mark" aria-hidden="true"><Check strokeWidth={1.5} /></div>
        </aside>

        <footer className="footer">
          <div className="footer-main">
            <a className="clario-logo" href="#top" data-testid="link-footer-home">
              <span className="clario-mark" aria-hidden="true">ك</span><span>clario</span>
            </a>
            <div className="footer-note"><ArrowDown size={13} aria-hidden="true" /> بداية أوضح لعلاقة أهدى مع فلوسك.</div>
            <p>كلاريو — نفهمها معك.</p>
          </div>
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
