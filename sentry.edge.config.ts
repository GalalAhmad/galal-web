import * as Sentry from "@sentry/nextjs";
import { sentryBeforeSend, sentryBeforeBreadcrumb } from "@/lib/piiScrubber";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  debug: false,
  beforeSend: sentryBeforeSend,
  beforeBreadcrumb: sentryBeforeBreadcrumb,
});
