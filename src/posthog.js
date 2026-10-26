import posthog from 'posthog-js';

const apiKey = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;
const missingVariable = !apiKey ? 'VITE_POSTHOG_KEY' : !apiHost ? 'VITE_POSTHOG_HOST' : null;
export const isPostHogConfigured = !missingVariable;

if (missingVariable) {
  if (import.meta.env.DEV) {
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(apiKey, {
    api_host: apiHost,
    defaults: '2026-05-30',
    logs: {
      serviceName: 'design-tokens-chatbot',
      environment: import.meta.env.MODE,
    },
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
}

export function logAppInteraction(message, attributes) {
  if (isPostHogConfigured) posthog.logger.info(message, attributes);
}

export default posthog;
