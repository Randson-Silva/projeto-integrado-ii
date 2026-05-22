import MyProfileForm from '../components/AdminProfileForm';
import { adminItems } from '../config/sidebarItems/adminItems';
import MainLayout from '../layouts/MainLayout';

const AdminProfilePage = () => {
  return (
    <MainLayout menuItems={adminItems} pageTitle="Meu Perfil">
      <MyProfileForm />
    </MainLayout>
  );
};

export default AdminProfilePage;
