import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarRange,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  FileChartColumnIncreasing,
  Goal,
  LayoutDashboard,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';
import CurrencySelector from '@/components/currency-selector';
import ClarioWordmark from '@/components/clario-wordmark';
import { LanguageSwitcher, useLanguage } from '@/components/language-provider';
import MonthlyComparison from '@/components/monthly-comparison';
import MonthlyPlan from '@/components/monthly-plan';
import { formatLocaleNumber } from '@/lib/localization';
import '../../dashboard.css';

type DashboardRoute = 'overview' | 'analysis' | 'hire' | 'goal';

interface DashboardShellProps {
  activeRoute: DashboardRoute;
  children: ReactNode;
}

const navigation = [
  { route: 'overview' as const, href: '/dashboard', label: 'نظرة عامة', mobileLabel: 'الرئيسية', Icon: LayoutDashboard },
  { route: 'analysis' as const, href: '/dashboard/analysis', label: 'تحليل كشفك', mobileLabel: 'تحليل', Icon: FileChartColumnIncreasing },
  { route: 'hire' as const, href: '/dashboard/hire', label: 'قرار التوظيف', mobileLabel: 'التوظيف', Icon: BriefcaseBusiness },
  { route: 'goal' as const, href: '/dashboard/goal', label: 'هدفك المالي', mobileLabel: 'الهدف', Icon: Goal },
];

export function DashboardShell({ activeRoute, children }: DashboardShellProps) {
  const { language, direction, t } = useLanguage();

  return (
    <div className="clario-dashboard" dir={direction} lang={language}>
      <aside className="clario-dashboard__sidebar" aria-label={t('قائمة التنقل')}>
        <Link
          className="clario-dashboard__brand"
          href="/"
          aria-label={t('كلاريو، العودة إلى الموقع')}
          title={t('العودة إلى الموقع')}
        >
          <ClarioWordmark />
        </Link>

        <div className="clario-dashboard__side-caption">{t('مساحتك المالية')}</div>
        <nav className="clario-dashboard__nav" aria-label={t('التنقل')}>
          {navigation.map(({ route, href, label, mobileLabel, Icon }) => (
            <Link
              key={route}
              href={href}
              className={`clario-dashboard__nav-link${activeRoute === route ? ' is-active' : ''}`}
              aria-current={activeRoute === route ? 'page' : undefined}
              data-testid={`link-dashboard-${route}`}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span className="clario-dashboard__nav-label">{t(label)}</span>
              <span className="clario-dashboard__nav-label-mobile">{t(mobileLabel)}</span>
              {activeRoute === route && <span className="clario-dashboard__active-mark" aria-hidden="true" />}
            </Link>
          ))}
        </nav>

        <div className="clario-dashboard__sidebar-bottom">
          <div className="clario-dashboard__trust">
            <span className="clario-dashboard__trust-icon"><ShieldCheck size={17} aria-hidden="true" /></span>
            <span>{t('قرارك يظل لك')}</span>
          </div>
          <Link className="clario-dashboard__home-link" href="/">
            {language === 'ar' ? <ArrowLeft size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
            <span>{t('العودة للموقع')}</span>
          </Link>
        </div>
      </aside>

      <div className="clario-dashboard__main">
        <header className="clario-dashboard__topbar">
          <div className="clario-dashboard__breadcrumb">
            <span>{t('كلاريو')}</span>
            <span className="clario-dashboard__breadcrumb-divider" aria-hidden="true">/</span>
            <span className="clario-dashboard__breadcrumb-current">
              {t(navigation.find((item) => item.route === activeRoute)?.label ?? '')}
            </span>
          </div>
          <div className="clario-dashboard__top-note">
            <span className="clario-dashboard__online-dot" aria-hidden="true" />
            <span>{t('مساحتك، على راحتك')}</span>
          </div>
          <div className="clario-dashboard__topbar-actions">
            <CurrencySelector className="clario-currency-picker--dashboard" />
            <LanguageSwitcher />
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
    number: 1,
    title: 'خلّنا نرتّب أرقامك',
    description: 'افهم كشفك المالي بصورة أوضح.',
    action: 'ابدأ التحليل',
    Icon: ChartNoAxesColumnIncreasing,
    className: 'analysis',
  },
  {
    href: '/dashboard/hire',
    number: 2,
    title: 'أقدر أوظف شخص؟',
    description: 'فكّر في أثر التوظيف على ميزانيتك.',
    action: 'جرّب المحاكاة',
    Icon: BriefcaseBusiness,
    className: 'hire',
  },
  {
    href: '/dashboard/goal',
    number: 3,
    title: 'هدفك المالي الجاي',
    description: 'رتّب هدفًا ماليًا يناسبك.',
    action: 'ابدأ هدفك',
    Icon: Goal,
    className: 'goal',
  },
];

export function DashboardHome() {
  const { language, t } = useLanguage();
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isMonthlyPlanOpen, setIsMonthlyPlanOpen] = useState(false);

  useEffect(() => {
    setIsComparisonOpen(false);
    setIsMonthlyPlanOpen(false);
  }, [language]);

  return (
    <div className="clario-dashboard__home">
      <section className="clario-dashboard__welcome" aria-labelledby="dashboard-welcome-title">
        <div className="clario-dashboard__welcome-copy">
          <div className="clario-dashboard__eyebrow"><span /> {t('مساحة أوضح لقراراتك')}</div>
          <h1 id="dashboard-welcome-title">{t('هلا بك في كلاريو.')}</h1>
          <p>{t('وش ودك ترتّب اليوم؟')}</p>
            <Link
              className="clario-dashboard__welcome-cta"
              href="/dashboard/analysis"
              data-testid="link-welcome-analysis"
            >
              {t('ابدأ بترتيب أرقامك')}
              {language === 'ar' ? <ArrowLeft size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
            </Link>
        </div>
        <div className="clario-dashboard__welcome-art" aria-hidden="true">
          <span className="clario-dashboard__art-orbit clario-dashboard__art-orbit--outer" />
          <span className="clario-dashboard__art-orbit clario-dashboard__art-orbit--inner" />
          <span className="clario-dashboard__art-sun" />
          <span className="clario-dashboard__art-dot" />
        </div>
      </section>

      <section
        className="clario-dashboard__services-section"
        aria-labelledby="dashboard-services-title"
        data-scroll-reveal
      >
        <div className="clario-dashboard__section-heading">
          <div>
            <span className="clario-dashboard__section-kicker">{t('اختر خطوتك')}</span>
            <h2 id="dashboard-services-title">{t('وش تحتاج اليوم؟')}</h2>
          </div>
          <span className="clario-dashboard__section-aside">{t('ثلاث أدوات، على قد حاجتك')}</span>
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
                <span className="clario-dashboard__service-number">{formatLocaleNumber(number, language, 2)}</span>
                <span className="clario-dashboard__service-icon"><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span>
              </div>
              <div className="clario-dashboard__service-copy">
                <h3>{t(title)}</h3>
                <p>{t(description)}</p>
              </div>
              <span className="clario-dashboard__service-action">
                {t(action)}
                {language === 'ar' ? <ArrowLeft size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="clario-dashboard__tools-section"
        aria-labelledby="dashboard-tools-title"
      >
        <div className="clario-dashboard__section-heading">
          <div>
            <span className="clario-dashboard__section-kicker">{t('أدوات إضافية')}</span>
            <h2 id="dashboard-tools-title">{t('المقارنة والخطة المالية')}</h2>
          </div>
        </div>
        <div className="clario-dashboard__tools">
          <button
            type="button"
            className="clario-dashboard__tool-card"
            aria-expanded={isComparisonOpen}
            aria-controls="dashboard-monthly-comparison"
            onClick={() => setIsComparisonOpen((open) => !open)}
            data-testid="button-dashboard-monthly-comparison"
          >
            <span className="clario-dashboard__tool-icon">
              <CalendarRange size={20} aria-hidden="true" />
            </span>
            <span className="clario-dashboard__tool-copy">
              <strong>{t('قارن بين أي شهرين')}</strong>
              <small>{t('مقارنة حسب الحركات المؤرخة')}</small>
            </span>
            {isComparisonOpen ? (
              <ChevronUp size={18} aria-hidden="true" />
            ) : (
              <ChevronDown size={18} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="clario-dashboard__tool-card"
            aria-expanded={isMonthlyPlanOpen}
            aria-controls="dashboard-monthly-plan"
            onClick={() => setIsMonthlyPlanOpen((open) => !open)}
            data-testid="button-dashboard-monthly-plan"
          >
            <span className="clario-dashboard__tool-icon">
              <ListChecks size={20} aria-hidden="true" />
            </span>
            <span className="clario-dashboard__tool-copy">
              <strong>{t('خطتك هالشهر')}</strong>
              <small>{t('خطوات مقترحة من دخل ومصاريف فترة الكشف.')}</small>
            </span>
            {isMonthlyPlanOpen ? (
              <ChevronUp size={18} aria-hidden="true" />
            ) : (
              <ChevronDown size={18} aria-hidden="true" />
            )}
          </button>
        </div>
        <div
          className="clario-dashboard__tool-panel"
          id="dashboard-monthly-comparison"
          hidden={!isComparisonOpen}
        >
          {isComparisonOpen ? <MonthlyComparison /> : null}
        </div>
        <div
          className="clario-dashboard__tool-panel"
          id="dashboard-monthly-plan"
          hidden={!isMonthlyPlanOpen}
        >
          {isMonthlyPlanOpen ? <MonthlyPlan /> : null}
        </div>
      </section>

      <aside
        className="clario-dashboard__note"
        aria-label={t('معلومة عن كلاريو')}
        data-scroll-reveal
      >
        <span className="clario-dashboard__note-icon"><CircleHelp size={18} aria-hidden="true" /></span>
        <p><strong>{t('على راحتك.')}</strong> {t('كلاريو يوضح لك الصورة، والقرار يظل قرارك.')}</p>
        <span className="clario-dashboard__note-rule" aria-hidden="true" />
      </aside>
    </div>
  );
}

