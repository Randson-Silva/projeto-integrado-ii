import { useAuth } from '../hooks/useAuth';

import { adminItems } from '../config/sidebarItems/adminItems';
import { associateItems } from '../config/sidebarItems/associateItems';
import { consultantItems } from '../config/sidebarItems/consultantItems';
import { superAdminItems } from '../config/sidebarItems/superAdminItems';

import MainLayout from '../layouts/MainLayout';
import { decodeJwt } from '../services/auth/jwt.config';

import type { JSX } from 'react';
import AssociateDashboard from '../components/Dashboards/AssociateDashboard';

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

  const dashboardByRole: { [key: string]: JSX.Element } = {
    // TODO: implmentar dashboards para cada tipo de usuário
    // SUPER_ADMIN: <SuperAdminDashboard />,
    // ADMIN: <AdminDashboard />,
    // CONSULTANT: <ConsultantDashboard />,
    ASSOCIATE: <AssociateDashboard />,
  };

  const menuItems = menuItemsByRole[user.role];
  const dashboard = dashboardByRole[user.role];

  return <MainLayout menuItems={menuItems}>{dashboard}</MainLayout>;
};

export default DashboardPage;
