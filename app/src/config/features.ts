/**
 * Feature Flags for conditional feature enabling
 *
 * Features can be enabled/disabled via environment variables.
 * This allows for safe rollout of new features and easy removal if needed.
 */
export const FEATURES = {
  /**
   * Admin Panel - User and Project management UI
   * Enable: VITE_FEATURE_ADMIN_PANEL=true
   */
  ADMIN_PANEL: import.meta.env.VITE_FEATURE_ADMIN_PANEL === 'true',

  /**
   * Experiment Runner - UI for running experiments
   * Enable: VITE_FEATURE_EXPERIMENT_RUNNER=true
   */
  EXPERIMENT_RUNNER: import.meta.env.VITE_FEATURE_EXPERIMENT_RUNNER === 'true',
} as const;

export type FeatureFlags = typeof FEATURES;
