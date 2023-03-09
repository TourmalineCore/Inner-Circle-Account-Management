import { ReactComponent as IconEmployees } from '../../assets/icons/icon-employees.svg';
import { ReactComponent as IconEmployeesActive } from '../../assets/icons/icon-employees-active.svg';
import { LINK_TO_DASHBOARD } from '../../common/config/config';

export const employeesSidebarRoutes = [
  {
    isWindowRedirectNecessary: true,
    path: `${LINK_TO_DASHBOARD}employees`,
    label: 'Employees',
    icon: <IconEmployees />,
    iconActive: <IconEmployeesActive />,
  },
];
