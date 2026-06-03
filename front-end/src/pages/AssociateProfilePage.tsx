import AssociateProfile from '../components/AdminAssociateProfile';
import { adminItems } from '../config/sidebarItems/adminItems';
import MainLayout from '../layouts/MainLayout';

const AssociateProfilePage = () => {
  return (
    <MainLayout menuItems={adminItems} pageTitle="Perfil de Associado">
      <AssociateProfile />
    </MainLayout>
  );
};

export default AssociateProfilePage;
