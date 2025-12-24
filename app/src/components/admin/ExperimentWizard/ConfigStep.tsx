import React from 'react';
import { StepProps } from './types';
import { FileUploader } from '../FileUploader';

export const ConfigStep: React.FC<StepProps> = ({
  state,
  setState,
}) => {
  const handleBack = () => {
    setState((prev) => ({ ...prev, currentStep: 'project' }));
  };

  const handleRunExperiment = () => {
    setState((prev) => ({
      ...prev,
      currentStep: 'running',
      startTime: new Date(),
    }));
  };

  const isValid =
    state.protocolName.trim() !== '' &&
    state.protocolFile !== null &&
    state.manipulateFile !== null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Configure Experiment
        </h3>

        {/* Project Info */}
        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <p className="text-sm text-gray-600">
            <strong>Project:</strong> {state.selectedProject?.name}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Owner:</strong> {state.selectedUser?.email}
          </p>
        </div>

        {/* Protocol Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Protocol Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={state.protocolName}
            onChange={(e) =>
              setState((prev) => ({ ...prev, protocolName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="experiment_2025_01"
          />
        </div>

        {/* Protocol YAML */}
        <FileUploader
          label="Protocol YAML"
          file={state.protocolFile}
          onChange={(file) =>
            setState((prev) => ({ ...prev, protocolFile: file }))
          }
          required
        />

        {/* Manipulate YAML */}
        <FileUploader
          label="Manipulate YAML"
          file={state.manipulateFile}
          onChange={(file) =>
            setState((prev) => ({ ...prev, manipulateFile: file }))
          }
          required
        />
      </div>

      <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Back
        </button>
        <button
          onClick={handleRunExperiment}
          disabled={!isValid}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Run Experiment
        </button>
      </div>
    </div>
  );
};
