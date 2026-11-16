import { type ReactNode } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  CircleHelp,
  FileChartColumnIncreasing,
  Goal,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import CurrencySelector from '@/components/currency-selector';
import ClarioWordmark from '@/components/clario-wordmark';
import { LanguageSwitcher, useLanguage } from '@/components/language-provider';
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

