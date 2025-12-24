import React, { useState } from 'react';
import { StepProps } from './types';
import { ProjectForm } from '../ProjectForm';
import { createProject } from '../../../api/adminApi';

export const ProjectSelectStep: React.FC<StepProps> = ({
  state,
  setState,
  users,
  projects,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [localProjects, setLocalProjects] = useState(projects);

  const handleProjectSelect = (projectId: number) => {
    const project = localProjects.find((p) => p.id === projectId);
    const user = users.find((u) => u.id === project?.user_id);
    setState((prev) => ({
      ...prev,
      selectedProject: project || null,
      selectedUser: user || null,
    }));
  };

  const handleCreateProject = async (name: string, userId: number) => {
    setIsCreating(true);
    try {
      const newProject = await createProject(name, userId);
      const user = users.find((u) => u.id === userId);
      setLocalProjects((prev) => [...prev, { ...newProject, owner_email: user?.email }]);
      setState((prev) => ({
        ...prev,
        selectedProject: { ...newProject, owner_email: user?.email },
        selectedUser: user || null,
      }));
    } finally {
      setIsCreating(false);
    }
  };

  const handleNext = () => {
    if (state.selectedProject) {
      setState((prev) => ({ ...prev, currentStep: 'config' }));
    }
  };

  const handleCancel = () => {
    setState((prev) => ({
      ...prev,
      selectedProject: null,
      selectedUser: null,
      protocolName: '',
      protocolFile: null,
      manipulateFile: null,
      currentStep: 'project',
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select Project
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project <span className="text-red-500">*</span>
          </label>
          <select
            value={state.selectedProject?.id || ''}
            onChange={(e) => handleProjectSelect(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Select a project...</option>
            {localProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.owner_email || 'Unknown owner'})
              </option>
            ))}
          </select>
        </div>

        {state.selectedProject && (
          <div className="p-4 bg-purple-50 rounded-lg mb-4">
            <p className="text-sm text-purple-700">
              <strong>Selected:</strong> {state.selectedProject.name}
            </p>
            <p className="text-sm text-purple-600">
              <strong>Owner:</strong> {state.selectedUser?.email || 'Unknown'}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <span className="flex-1 border-t border-gray-300"></span>
          <span>or</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full px-4 py-2 text-sm font-medium text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Project
          </span>
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleNext}
          disabled={!state.selectedProject}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateProject}
        users={users}
        isLoading={isCreating}
      />
    </div>
  );
};
