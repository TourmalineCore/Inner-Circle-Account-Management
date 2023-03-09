import { ReactComponent as IconAnalytics } from '../../assets/icons/icon-analytics.svg';
import { ReactComponent as IconAnalyticsActive } from '../../assets/icons/icon-analytics-active.svg';
import { LINK_TO_DASHBOARD } from '../../common/config/config';

export const analyticsSidebarRoutes = [
  {
    isWindowRedirectNecessary: true,
    path: `${LINK_TO_DASHBOARD}analytics`,
    label: 'Analytics',
    icon: <IconAnalytics />,
    iconActive: <IconAnalyticsActive />,
  },
];
