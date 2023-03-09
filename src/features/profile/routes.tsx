import { ReactComponent as IconProfile } from '../../assets/icons/icon-profile.svg';
import { ReactComponent as IconProfileActive } from '../../assets/icons/icon-profile-active.svg';
import { LINK_TO_DASHBOARD } from '../../common/config/config';

export const profileSidebarRoutes = [
  {
    isWindowRedirectNecessary: true,
    path: `${LINK_TO_DASHBOARD}profile`,
    label: 'Profile',
    icon: <IconProfile />,
    iconActive: <IconProfileActive />,
  },
];
