import * as Storage from '../Lib/storage';

const KEY = 'global_search_history_v1';

export async function addQuery(q: string, limit = 10) {
  const list = await Storage.getJson<string[]>(KEY, []);
  const norm = q.trim(); if (!norm) return;
  const next = [norm, ...list.filter(x => x !== norm)].slice(0, limit);
  await Storage.setItem(KEY, JSON.stringify(next));
}

export async function getQueries() {
  return Storage.getJson<string[]>(KEY, []);
}

export async function clear() {
  await Storage.setItem(KEY, JSON.stringify([]));
}

