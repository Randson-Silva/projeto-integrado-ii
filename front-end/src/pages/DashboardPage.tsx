import { Typography } from '@mui/material';

import { useAuth } from '../hooks/useAuth';

import { adminItems } from '../config/sidebarItems/adminItems';
import { associateItems } from '../config/sidebarItems/associateItems';
import { consultantItems } from '../config/sidebarItems/consultantItems';
import { superAdminItems } from '../config/sidebarItems/superAdminItems';

import MainLayout from '../layouts/MainLayout';
import { decodeJwt } from '../services/auth/jwt.config';

const DashboardPage = () => {
  const { token } = useAuth();

  if (!token) {
    return null;
  }

  const user = decodeJwt(token);

  if (!user) {
    return null;
  }

  const menuItemsByRole = {
    SUPER_ADMIN: superAdminItems,
    ADMIN: adminItems,
    CONSULTANT: consultantItems,
    ASSOCIATE: associateItems,
  };

  const menuItems = menuItemsByRole[user.role];

  return (
    <MainLayout menuItems={menuItems}>
      <Typography sx={{ mt: 2 }}>Perfil atual: {user.role}</Typography>
    </MainLayout>
  );
};

export default DashboardPage;
