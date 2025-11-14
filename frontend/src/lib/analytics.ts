/**
 * Google Analytics 4 (GA4) Integration
 * Provides type-safe functions for tracking events and page views
 */

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const MEASUREMENT_ID = 'G-D6WRP94TDW';

/**
 * Initialize Google Analytics
 * This is called automatically by the script in index.html
 */
export function initAnalytics(): void {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('✅ Google Analytics initialized');
  } else {
    console.warn('⚠️ Google Analytics not loaded');
  }
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, eventParams);
}

/**
 * Track user registration
 */
export function trackRegistration(method: string = 'email'): void {
  trackEvent('sign_up', {
    method: method,
  });
}

/**
 * Track user login
 */
export function trackLogin(method: string = 'email'): void {
  trackEvent('login', {
    method: method,
  });
}

/**
 * Track onboarding completion
 */
export function trackOnboardingComplete(data?: {
  trainerId?: number;
  primaryGoal?: string;
  experienceLevel?: number;
}): void {
  trackEvent('onboarding_complete', {
    trainer_id: data?.trainerId,
    primary_goal: data?.primaryGoal,
    experience_level: data?.experienceLevel,
  });
}

/**
 * Track onboarding step progress
 */
export function trackOnboardingStep(step: number, stepName: string): void {
  trackEvent('onboarding_step', {
    step_number: step,
    step_name: stepName,
  });
}

/**
 * Track button clicks
 */
export function trackButtonClick(buttonName: string, location?: string): void {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location,
  });
}

/**
 * Track form submissions
 */
export function trackFormSubmit(formName: string, success: boolean): void {
  trackEvent('form_submit', {
    form_name: formName,
    success: success,
  });
}

/**
 * Track errors
 */
export function trackError(errorMessage: string, errorLocation?: string): void {
  trackEvent('exception', {
    description: errorMessage,
    fatal: false,
    location: errorLocation,
  });
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('set', 'user_properties', properties);
}

/**
 * Set user ID for tracking
 */
export function setUserId(userId: string): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', MEASUREMENT_ID, {
    user_id: userId,
  });
}

/**
 * Clear user ID (for logout)
 */
export function clearUserId(): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', MEASUREMENT_ID, {
    user_id: null,
  });
}

