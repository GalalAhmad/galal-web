/**
 * PII and Clinical Privacy Scrubber
 * Automatically redacts phone numbers, emails, passwords, auth tokens,
 * and clinical descriptions from error reports, logs, and telemetry.
 */

const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4,6}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const BASE64_IMG_REGEX = /data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]{50,}/gi;
const SECRET_KEY_REGEX = /^(password|token|secret|receipt|auth|key|clinical_notes|soap|answers)$/i;

export function redactString(str: string): string {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(EMAIL_REGEX, '[REDACTED_EMAIL]')
    .replace(PHONE_REGEX, (match) => (match.length >= 8 ? '[REDACTED_PHONE]' : match))
    .replace(BASE64_IMG_REGEX, '[REDACTED_IMAGE_BASE64]');
}

export function scrubObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return redactString(obj) as unknown as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => scrubObject(item)) as unknown as T;
  }

  const copy: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SECRET_KEY_REGEX.test(key)) {
      copy[key] = '[REDACTED_SENSITIVE]';
    } else if (typeof value === 'string') {
      copy[key] = redactString(value);
    } else if (typeof value === 'object' && value !== null) {
      copy[key] = scrubObject(value);
    } else {
      copy[key] = value;
    }
  }

  return copy as T;
}

/**
 * Sentry beforeSend hook to clean all event data
 */
export function sentryBeforeSend(event: any) {
  if (!event) return null;

  // 1. Scrub user object
  if (event.user) {
    delete event.user.ip_address;
    delete event.user.email;
    delete event.user.username;
    if (event.user.id) {
      // Keep only first 8 characters of ID for debugging without leaking personal identifiers
      event.user.id = String(event.user.id).slice(0, 8) + '...';
    }
  }

  // 2. Scrub request data
  if (event.request) {
    if (event.request.headers) {
      delete event.request.headers.cookie;
      delete event.request.headers.authorization;
    }
    if (event.request.query_string && typeof event.request.query_string === 'string') {
      event.request.query_string = redactString(event.request.query_string);
    }
    if (event.request.data) {
      event.request.data = scrubObject(event.request.data);
    }
  }

  // 3. Scrub breadcrumbs
  if (Array.isArray(event.breadcrumbs)) {
    event.breadcrumbs = event.breadcrumbs.map((b: any) => {
      if (b.message) b.message = redactString(b.message);
      if (b.data) b.data = scrubObject(b.data);
      return b;
    });
  }

  // 4. Scrub extra
  if (event.extra) {
    event.extra = scrubObject(event.extra);
  }

  return event;
}

/**
 * Sentry beforeBreadcrumb hook
 */
export function sentryBeforeBreadcrumb(breadcrumb: any) {
  if (!breadcrumb) return null;

  if (breadcrumb.message) {
    breadcrumb.message = redactString(breadcrumb.message);
  }

  if (breadcrumb.data) {
    breadcrumb.data = scrubObject(breadcrumb.data);
  }

  return breadcrumb;
}
