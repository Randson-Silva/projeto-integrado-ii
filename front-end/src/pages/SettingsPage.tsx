import SettingsForm from '../components/SettingsForm';
import { adminItems } from '../config/sidebarItems/adminItems';
import MainLayout from '../layouts/MainLayout';

const SettingsPage = () => {
  return (
    <MainLayout menuItems={adminItems} pageTitle="Configurações">
      <SettingsForm />
    </MainLayout>
  );
};

export default SettingsPage;
