const STORAGE_KEY = "takeoff_onboarding";

export function getOnboardingContext() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveOnboardingContext(context) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
}

export function updateOnboardingContext(updates) {
  const current = getOnboardingContext() ?? {};

  const updated = {
    ...current,
    ...updates,
  };

  saveOnboardingContext(updated);

  return updated;
}

export function clearOnboardingContext() {
  sessionStorage.removeItem(STORAGE_KEY);
}