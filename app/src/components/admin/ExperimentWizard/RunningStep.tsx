import React, { useEffect, useState } from 'react';
import { StepProps } from './types';
import { runExperiment, AdminAPIError } from '../../../api/adminApi';

export const RunningStep: React.FC<StepProps> = ({
  state,
  setState,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Run experiment on mount
  useEffect(() => {
    let isMounted = true;

    const executeExperiment = async () => {
      if (
        !state.selectedProject ||
        !state.selectedUser ||
        !state.protocolFile ||
        !state.manipulateFile
      ) {
        setState((prev) => ({
          ...prev,
          error: 'Missing required data for experiment',
          currentStep: 'config',
        }));
        return;
      }

      try {
        const result = await runExperiment(
          state.selectedProject.id,
          state.protocolName,
          state.selectedUser.id,
          state.protocolFile,
          state.manipulateFile
        );

        if (isMounted) {
          setState((prev) => ({
            ...prev,
            runId: result.run_id,
            endTime: new Date(),
            currentStep: 'complete',
          }));
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof AdminAPIError
              ? err.message
              : 'Experiment failed';
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            endTime: new Date(),
            currentStep: 'complete',
          }));
        }
      }
    };

    executeExperiment();

    return () => {
      isMounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.startTime) {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - state.startTime.getTime()) / 1000
        );
        setElapsedSeconds(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="mb-6">
          <svg
            className="animate-spin h-16 w-16 mx-auto text-purple-600"
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
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Running Experiment...
        </h3>

        <p className="text-gray-500 mb-6">
          Please wait while the experiment is being executed.
        </p>

        <div className="inline-block bg-gray-100 rounded-lg px-4 py-2">
          <p className="text-sm text-gray-600">
            Elapsed: <strong>{formatTime(elapsedSeconds)}</strong>
          </p>
        </div>

        <div className="mt-8 p-4 bg-purple-50 rounded-lg max-w-md mx-auto text-left">
          <p className="text-sm text-purple-700">
            <strong>Project:</strong> {state.selectedProject?.name}
          </p>
          <p className="text-sm text-purple-600">
            <strong>Protocol:</strong> {state.protocolName}
          </p>
          <p className="text-sm text-purple-600">
            <strong>User:</strong> {state.selectedUser?.email}
          </p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400">
        <p>This may take several minutes depending on the protocol complexity.</p>
        <p>Do not close this page while the experiment is running.</p>
      </div>
    </div>
  );
};
