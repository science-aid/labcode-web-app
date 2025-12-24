import React, { useState, useEffect } from 'react';
import { WizardState } from './types';
import { ProjectSelectStep } from './ProjectSelectStep';
import { ConfigStep } from './ConfigStep';
import { RunningStep } from './RunningStep';
import { CompleteStep } from './CompleteStep';
import { listUsers, listProjects, User, Project, AdminAPIError } from '../../../api/adminApi';

const steps = [
  { key: 'project', label: 'Select Project' },
  { key: 'config', label: 'Configure' },
  { key: 'running', label: 'Running' },
  { key: 'complete', label: 'Complete' },
] as const;

export const ExperimentWizard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<WizardState>({
    currentStep: 'project',
    selectedProject: null,
    selectedUser: null,
    protocolName: '',
    protocolFile: null,
    manipulateFile: null,
    runId: null,
    error: null,
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersData, projectsData] = await Promise.all([
          listUsers(),
          listProjects(),
        ]);
        setUsers(usersData);
        setProjects(projectsData);
      } catch (err) {
        if (err instanceof AdminAPIError) {
          setError(err.message);
        } else {
          setError('Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentStepIndex = steps.findIndex((s) => s.key === state.currentStep);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <svg
          className="animate-spin h-8 w-8 mx-auto mb-4 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      index < currentStepIndex
                        ? 'bg-purple-600 text-white'
                        : index === currentStepIndex
                        ? 'bg-purple-600 text-white ring-4 ring-purple-200'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {index < currentStepIndex ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${
                      index <= currentStepIndex
                        ? 'text-purple-600'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2
                    ${index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {state.currentStep === 'project' && (
          <ProjectSelectStep
            state={state}
            setState={setState}
            users={users}
            projects={projects}
          />
        )}
        {state.currentStep === 'config' && (
          <ConfigStep
            state={state}
            setState={setState}
            users={users}
            projects={projects}
          />
        )}
        {state.currentStep === 'running' && (
          <RunningStep
            state={state}
            setState={setState}
            users={users}
            projects={projects}
          />
        )}
        {state.currentStep === 'complete' && (
          <CompleteStep
            state={state}
            setState={setState}
            users={users}
            projects={projects}
          />
        )}
      </div>
    </div>
  );
};

export default ExperimentWizard;
