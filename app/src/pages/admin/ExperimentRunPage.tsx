import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ExperimentWizard } from '../../components/admin/ExperimentWizard';

export const ExperimentRunPage: React.FC = () => {
  return (
    <AdminLayout title="Run Experiment">
      <ExperimentWizard />
    </AdminLayout>
  );
};
