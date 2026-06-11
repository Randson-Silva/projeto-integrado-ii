import { PersonOutlined } from '@mui/icons-material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import type { SidebarItem } from '../../components/Sidebar';

export const consultantItems: SidebarItem[] = [
  {
    label: 'Associados',
    href: '/associados',
    icon: GroupOutlinedIcon,
  },
  {
    label: 'Meu Perfil',
    href: '/meu-perfil',
    icon: PersonOutlined,
  },
];
