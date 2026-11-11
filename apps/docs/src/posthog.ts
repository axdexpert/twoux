import posthog from "posthog-js";

const key = import.meta.env.VITE_POSTHOG_KEY;
const host = import.meta.env.VITE_POSTHOG_HOST;

if (!key || !host) {
	if (import.meta.env.DEV) {
		const variable = key ? "VITE_POSTHOG_HOST" : "VITE_POSTHOG_KEY";
		throw new Error(
			`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
		);
	}
} else {
	posthog.init(key, {
		api_host: host,
		capture_exceptions: {
			capture_unhandled_errors: true,
			capture_unhandled_rejections: true,
			capture_console_errors: false,
		},
		logs: {
			serviceName: "twoux-docs",
			environment: import.meta.env.MODE,
		},
	});
}

type AnalyticsProperties = Record<string, string | number | boolean>;

function posthogCapture(event: string, properties: AnalyticsProperties) {
	if (key && host) posthog.capture(event, properties);
}

const posthogLogger = {
	info(message: string, attributes: AnalyticsProperties) {
		if (key && host) posthog.logger.info(message, attributes);
	},
};

export { posthog, posthogCapture, posthogLogger };
