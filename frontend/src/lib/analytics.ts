/**
 * Google Analytics 4 (GA4) Integration
 * Provides type-safe functions for tracking events and page views
 */

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
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

/**
 * Track subscription/payment events
 */
export function trackSubscriptionStart(priceId?: string, referralCode?: string): void {
  trackEvent('begin_checkout', {
    currency: 'EUR',
    value: 5.0,
    items: [{
      item_id: priceId || 'pro_plan',
      item_name: 'Pro Plan',
      price: 5.0,
      quantity: 1
    }],
    referral_code: referralCode || undefined,
  });
}

export function trackPaymentSuccess(sessionId?: string, value?: number): void {
  trackEvent('purchase', {
    transaction_id: sessionId,
    currency: 'EUR',
    value: value || 5.0,
    items: [{
      item_id: 'pro_plan',
      item_name: 'Pro Plan',
      price: value || 5.0,
      quantity: 1
    }]
  });
}

export function trackPaymentCancel(): void {
  trackEvent('checkout_progress', {
    checkout_step: 0,
    checkout_option: 'cancelled'
  });
}

/**
 * Track workout events
 */
export function trackWorkoutStart(workoutId: string, moodBefore?: number): void {
  trackEvent('workout_start', {
    workout_id: workoutId,
    mood_before: moodBefore,
  });
}

export function trackWorkoutComplete(workoutId: string, duration?: number, exercisesCount?: number): void {
  trackEvent('workout_complete', {
    workout_id: workoutId,
    duration_seconds: duration,
    exercises_count: exercisesCount,
  });
}

export function trackWorkoutSkip(workoutId: string): void {
  trackEvent('workout_skip', {
    workout_id: workoutId,
  });
}

export function trackWorkoutEvaluation(workoutId: string, difficulty?: number, moodAfter?: number): void {
  trackEvent('workout_evaluation', {
    workout_id: workoutId,
    difficulty_rating: difficulty,
    mood_after: moodAfter,
  });
}

/**
 * Track mood logging
 */
export function trackMoodLog(mood: number, source?: string): void {
  trackEvent('mood_log', {
    mood_value: mood,
    mood_source: source || 'manual',
  });
}

/**
 * Track achievement unlocks
 */
export function trackAchievementUnlock(achievementId: string, achievementName: string): void {
  trackEvent('achievement_unlock', {
    achievement_id: achievementId,
    achievement_name: achievementName,
  });
}

/**
 * Track chatbot usage
 */
export function trackChatbotMessage(messageLength?: number, trainerId?: number): void {
  trackEvent('chatbot_message', {
    message_length: messageLength,
    trainer_id: trainerId,
  });
}

export function trackChatbotSessionStart(trainerId?: number): void {
  trackEvent('chatbot_session_start', {
    trainer_id: trainerId,
  });
}

