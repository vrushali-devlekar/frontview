const DEFAULT_TTL_SECONDS = 300;

const store = new Map();

const nowMs = () => Date.now();

const ttlToExpiresAt = (ttlSeconds = DEFAULT_TTL_SECONDS) => {
  const ttl = Number(ttlSeconds);
  const safeTtl = Number.isFinite(ttl) && ttl > 0 ? ttl : DEFAULT_TTL_SECONDS;
  return nowMs() + safeTtl * 1000;
};

const isExpired = (entry) => !entry || entry.expiresAt <= nowMs();

const get = (key) => {
  const entry = store.get(key);
  if (isExpired(entry)) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
};

const set = (key, value, ttlSeconds) => {
  store.set(key, {
    value,
    expiresAt: ttlToExpiresAt(ttlSeconds),
  });
  return true;
};

const del = (key) => {
  const existed = store.has(key);
  store.delete(key);
  return existed ? 1 : 0;
};

const flush = () => {
  store.clear();
};

module.exports = {
  get,
  set,
  del,
  flush,
};
