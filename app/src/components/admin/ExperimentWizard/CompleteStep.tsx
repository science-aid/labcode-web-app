import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { StepProps } from './types';

export const CompleteStep: React.FC<StepProps> = ({
  state,
  setState,
}) => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();

  const isSuccess = !state.error && state.runId !== null;

  // Check if the logged-in user can view the results
  // (only the Run owner can view the Run details)
  const canViewResults = isSuccess &&
    loggedInUser?.email === state.selectedUser?.email;

  const getDuration = () => {
    if (state.startTime && state.endTime) {
      const ms = state.endTime.getTime() - state.startTime.getTime();
      const seconds = Math.floor(ms / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs.toString().padStart(2, '0')}s`;
    }
    return '-';
  };

  const handleViewResults = () => {
    if (state.runId && canViewResults) {
      navigate(`/runs/${state.runId}`);
    }
  };

  const handleRunAnother = () => {
    setState({
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
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleGoToRunList = () => {
    navigate('/runs');
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        {isSuccess ? (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
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
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Experiment Completed!
            </h3>

            <div className="mt-6 p-4 bg-green-50 rounded-lg max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs text-gray-500">Run ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {state.runId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {getDuration()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="text-sm font-medium text-gray-900">
                    {state.selectedUser?.email || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-green-600">
                    Completed
                  </p>
                </div>
              </div>
            </div>

            {/* Warning when logged-in user is different from Run owner */}
            {isSuccess && !canViewResults && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
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
                  <div className="text-left">
                    <p className="text-sm font-medium text-yellow-800">
                      Cannot view results directly
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This Run belongs to <strong>{state.selectedUser?.email}</strong>.
                      You are logged in as <strong>{loggedInUser?.email}</strong>.
                      To view this Run's details, please log in as the owner.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Experiment Failed
            </h3>

            <div className="mt-6 p-4 bg-red-50 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-red-700">
                {state.error || 'An unknown error occurred'}
              </p>
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 max-w-xs mx-auto">
          {isSuccess && canViewResults && (
            <button
              onClick={handleViewResults}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
            >
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              View Results
            </button>
          )}

          {isSuccess && !canViewResults && (
            <button
              onClick={handleGoToRunList}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Go to My Run List
            </button>
          )}

          <button
            onClick={handleRunAnother}
            className="w-full px-4 py-2 text-sm font-medium text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 flex items-center justify-center gap-2"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Run Another Experiment
          </button>
          <button
            onClick={handleBackToDashboard}
            className="w-full px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
