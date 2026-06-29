import { PersonOutlined } from '@mui/icons-material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { SidebarItem } from '../../components/Sidebar';

export const adminItems: SidebarItem[] = [
  {
    label: 'Associados',
    href: '/associados',
    icon: GroupOutlinedIcon,
  },
  {
    label: 'Comunicação',
    href: '/comunicacao',
    icon: MessageOutlinedIcon,
  },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: SettingsOutlinedIcon,
  },
  {
    label: 'Meu Perfil',
    href: '/meu-perfil',
    icon: PersonOutlined,
  },
];
