const localStorageUtils = {
  set<T>(key: string, value: T) {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
    } catch (err) {
      console.warn(`Failed to save "${key}" to localStorage:`, err);
    }
  },

  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (err) {
      console.warn(`Failed to parse localStorage item "${key}":`, err);
      return null;
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`Failed to remove localStorage key "${key}":`, err);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (err) {
      console.warn('Failed to clear localStorage:', err);
    }
  },
};

export default localStorageUtils;
