/**
 * Environment variable utility
 * Provides type-safe access to environment variables
 */

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  apiBaseUrl: string;
  environment: string;
}

/**
 * Get environment configuration
 * @returns The environment configuration object
 */
export const getEnvConfig = (): EnvironmentConfig => {
  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
    environment: import.meta.env.VITE_ENV || "development",
  };
};

/**
 * Check if the current environment is development
 * @returns true if the current environment is development
 */
export const isDevelopment = (): boolean => {
  return getEnvConfig().environment === "development";
};

/**
 * Check if the current environment is test
 * @returns true if the current environment is test
 */
export const isTest = (): boolean => {
  return getEnvConfig().environment === "test";
};

/**
 * Check if the current environment is production
 * @returns true if the current environment is production
 */
export const isProduction = (): boolean => {
  return getEnvConfig().environment === "production";
};
