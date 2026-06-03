import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar, { type SidebarItem } from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { authGetProfile } from '../services/auth/authService';
import { normalizeRoleView } from '../services/auth/roles';

const DRAWER_WIDTH = 224;

const UserMenu = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        if (!token) {
          setDisplayName('Usuário');
          setRole('Indefinido');
          return;
        }

        const user = await authGetProfile({ token });

        if (!user) {
          setDisplayName('Usuário');
          setRole('Indefinido');
          return;
        }

        setDisplayName(user.name?.split(' ')[0] ?? 'Usuário');
        setRole(normalizeRoleView(user.role));
      } catch {
        setDisplayName('Usuário');
        setRole('Indefinido');
      }
    };

    loadUserInfo();
  }, [token]);

  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    setAnchor(null);
    logout();
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={1.5}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ cursor: 'pointer', userSelect: 'none', alignItems: 'center' }}
      >
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: 'primary.main',
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {initial}
        </Avatar>
        <Stack sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.2 }}
          >
            {role}
          </Typography>
        </Stack>
        <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
      </Stack>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: { sx: { borderRadius: 2, minWidth: 160, mt: 0.5 } },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
            navigate('/meu-perfil');
          }}
        >
          Meu Perfil
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          Sair
        </MenuItem>
      </Menu>
    </>
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
  menuItems: SidebarItem[];
  pageTitle?: string;
}

const MainLayout = ({ children, menuItems, pageTitle }: MainLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawer = <Sidebar items={menuItems} />;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          display: { sm: 'none' },
          bgcolor: 'background.paper',
          color: 'text.primary',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton onClick={() => setMobileOpen(true)} edge="start">
            <MenuIcon />
          </IconButton>
          {pageTitle && (
            <Typography variant="h6" sx={{ flex: 1, ml: 1, fontWeight: 700 }}>
              {pageTitle}
            </Typography>
          )}
          <UserMenu />
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            border: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'auto',
          pt: { xs: '56px', sm: 0 },
        }}
      >
        {/* Desktop top bar */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          {pageTitle ? (
            <Typography
              variant="h5"
              sx={{ fontWeight: 700 }}
              color="text.primary"
            >
              {pageTitle}
            </Typography>
          ) : (
            <Box />
          )}
          <UserMenu />
        </Box>

        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
