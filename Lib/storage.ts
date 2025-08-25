const memory = new Map<string, string>();

export async function getItem(key: string): Promise<string | null> {
  try {
    const AS = require('@react-native-async-storage/async-storage').default;
    return await AS.getItem(key);
  } catch (e) {
    return memory.get(key) ?? null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    const AS = require('@react-native-async-storage/async-storage').default;
    await AS.setItem(key, value);
  } catch (e) {
    memory.set(key, value);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    const AS = require('@react-native-async-storage/async-storage').default;
    await AS.removeItem(key);
  } catch (e) {
    memory.delete(key);
  }
}