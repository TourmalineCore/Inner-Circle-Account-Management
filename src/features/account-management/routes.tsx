import { ReactComponent as IconAnalytics } from '../../assets/icons/icon-analytics.svg';
import { ReactComponent as IconAnalyticsActive } from '../../assets/icons/icon-analytics-active.svg';

import AccountManagementPage from './AccountManagementPage';
import CreateAccount from './components/CreateAccount/CreateAccount';

export const accountManagementRoutes = [
  {
    path: '/account-management',
    breadcrumb: 'Account management',
    Component: AccountManagementPage,
  },
  {
    path: '/account-management/add',
    breadcrumb: 'Add an employee',
    Component: CreateAccount,
  },
];

export const accountManagementSidebarRoutes = [
  {
    path: '/account-management',
    label: 'Account management',
    icon: <IconAnalytics />,
    iconActive: <IconAnalyticsActive />,
  },
];
