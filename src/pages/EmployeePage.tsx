import React from 'react';
import Layout from '../components/common/Layout';
import EmployeeDashboard from '../components/employee/Dashboard';

const EmployeePage: React.FC = () => {
  return (
    <Layout>
      <EmployeeDashboard />
    </Layout>
  );
};

export default EmployeePage;