import { type ReactNode } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  CircleHelp,
  FileChartColumnIncreasing,
  Goal,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import '../../dashboard.css';

type DashboardRoute = 'overview' | 'analysis' | 'hire' | 'goal';

interface DashboardShellProps {
  activeRoute: DashboardRoute;
  children: ReactNode;
}

const navigation = [
  { route: 'overview' as const, href: '/dashboard', label: 'نظرة عامة', Icon: LayoutDashboard },
  { route: 'analysis' as const, href: '/dashboard/analysis', label: 'تحليل كشفك', Icon: FileChartColumnIncreasing },
  { route: 'hire' as const, href: '/dashboard/hire', label: 'قرار التوظيف', Icon: BriefcaseBusiness },
  { route: 'goal' as const, href: '/dashboard/goal', label: 'هدفك المالي', Icon: Goal },
];

export function DashboardShell({ activeRoute, children }: DashboardShellProps) {
  return (
    <div className="clario-dashboard" dir="rtl" lang="ar">
      <aside className="clario-dashboard__sidebar" aria-label="القائمة الجانبية">
        <Link className="clario-dashboard__brand" href="/dashboard" aria-label="كلاريو، لوحة التحكم">
          <span className="clario-dashboard__brand-mark" aria-hidden="true">ك</span>
          <span className="clario-dashboard__brand-word">clario</span>
        </Link>

        <div className="clario-dashboard__side-caption">مساحتك المالية</div>
        <nav className="clario-dashboard__nav" aria-label="التنقل">
          {navigation.map(({ route, href, label, Icon }) => (
            <Link
              key={route}
              href={href}
              className={`clario-dashboard__nav-link${activeRoute === route ? ' is-active' : ''}`}
              aria-current={activeRoute === route ? 'page' : undefined}
              data-testid={`link-dashboard-${route}`}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
              {activeRoute === route && <span className="clario-dashboard__active-mark" aria-hidden="true" />}
            </Link>
          ))}
        </nav>

        <div className="clario-dashboard__sidebar-bottom">
          <div className="clario-dashboard__trust">
            <span className="clario-dashboard__trust-icon"><ShieldCheck size={17} aria-hidden="true" /></span>
            <span>قرارك يظل لك</span>
          </div>
          <Link className="clario-dashboard__home-link" href="/">
            <ArrowLeft size={15} aria-hidden="true" />
            <span>العودة للموقع</span>
          </Link>
        </div>
      </aside>

      <div className="clario-dashboard__main">
        <header className="clario-dashboard__topbar">
          <div className="clario-dashboard__breadcrumb">
            <span>كلاريو</span>
            <span className="clario-dashboard__breadcrumb-divider" aria-hidden="true">/</span>
            <span className="clario-dashboard__breadcrumb-current">
              {navigation.find((item) => item.route === activeRoute)?.label}
            </span>
          </div>
          <div className="clario-dashboard__top-note">
            <span className="clario-dashboard__online-dot" aria-hidden="true" />
            <span>مساحتك، على راحتك</span>
          </div>
        </header>
        <main className="clario-dashboard__content">{children}</main>
      </div>
    </div>
  );
}

const services = [
  {
    href: '/dashboard/analysis',
    number: '٠١',
    title: 'خلّنا نرتّب أرقامك',
    description: 'افهم كشفك المالي بصورة أوضح.',
    action: 'ابدأ التحليل',
    Icon: ChartNoAxesColumnIncreasing,
    className: 'analysis',
  },
  {
    href: '/dashboard/hire',
    number: '٠٢',
    title: 'أقدر أوظف شخص؟',
    description: 'فكّر في أثر التوظيف على ميزانيتك.',
    action: 'جرّب المحاكاة',
    Icon: BriefcaseBusiness,
    className: 'hire',
  },
  {
    href: '/dashboard/goal',
    number: '٠٣',
    title: 'هدفك المالي الجاي',
    description: 'رتّب هدفًا ماليًا يناسبك.',
    action: 'ابدأ هدفك',
    Icon: Goal,
    className: 'goal',
  },
];

export function DashboardHome() {
  return (
    <div className="clario-dashboard__home">
      <section className="clario-dashboard__welcome" aria-labelledby="dashboard-welcome-title">
        <div className="clario-dashboard__welcome-copy">
          <div className="clario-dashboard__eyebrow"><span /> مساحة أوضح لقراراتك</div>
          <h1 id="dashboard-welcome-title">هلا بك في كلاريو.</h1>
          <p>وش ودك ترتّب اليوم؟</p>
        </div>
        <div className="clario-dashboard__welcome-art" aria-hidden="true">
          <span className="clario-dashboard__art-orbit clario-dashboard__art-orbit--outer" />
          <span className="clario-dashboard__art-orbit clario-dashboard__art-orbit--inner" />
          <span className="clario-dashboard__art-sun" />
          <span className="clario-dashboard__art-dot" />
          <span className="clario-dashboard__art-label">وضوح، خطوة بخطوة</span>
        </div>
      </section>

      <section className="clario-dashboard__services-section" aria-labelledby="dashboard-services-title">
        <div className="clario-dashboard__section-heading">
          <div>
            <span className="clario-dashboard__section-kicker">اختر خطوتك</span>
            <h2 id="dashboard-services-title">وش تحتاج اليوم؟</h2>
          </div>
          <span className="clario-dashboard__section-aside">ثلاث أدوات، على قد حاجتك</span>
        </div>
        <div className="clario-dashboard__services">
          {services.map(({ href, number, title, description, action, Icon, className }) => (
            <Link
              key={href}
              href={href}
              className={`clario-dashboard__service-card clario-dashboard__service-card--${className}`}
              data-testid={`link-service-${className}`}
            >
              <div className="clario-dashboard__service-card-top">
                <span className="clario-dashboard__service-number">{number}</span>
                <span className="clario-dashboard__service-icon"><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span>
              </div>
              <div className="clario-dashboard__service-copy">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="clario-dashboard__service-action">
                {action}
                <ArrowLeft size={15} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <aside className="clario-dashboard__note" aria-label="معلومة عن كلاريو">
        <span className="clario-dashboard__note-icon"><CircleHelp size={18} aria-hidden="true" /></span>
        <p><strong>على راحتك.</strong> كلاريو يوضح لك الصورة، والقرار يظل قرارك.</p>
        <span className="clario-dashboard__note-rule" aria-hidden="true" />
      </aside>
    </div>
  );
}

