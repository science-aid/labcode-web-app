import { Project, User } from '../../../api/adminApi';

export type WizardStep = 'project' | 'config' | 'running' | 'complete';

export interface WizardState {
  currentStep: WizardStep;
  selectedProject: Project | null;
  selectedUser: User | null;
  protocolName: string;
  protocolFile: File | null;
  manipulateFile: File | null;
  runId: number | null;
  error: string | null;
  startTime: Date | null;
  endTime: Date | null;
}

export interface StepProps {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  users: User[];
  projects: Project[];
}
