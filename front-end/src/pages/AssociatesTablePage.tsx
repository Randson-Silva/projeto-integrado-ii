import AssociatesTable from '../components/AssociatesTable';
import { adminItems } from '../config/sidebarItems/adminItems';
import MainLayout from '../layouts/MainLayout';

const AssociatesTablePage = () => {
  return (
    <MainLayout menuItems={adminItems} pageTitle="Associados">
      <AssociatesTable />
    </MainLayout>
  );
};

export default AssociatesTablePage;
