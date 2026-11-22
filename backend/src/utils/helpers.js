const env = require('../config/env');

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePagination = (query, { defaultLimit = 10, maxLimit = 100 } = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};

const buildMeta = (total, page, limit) => ({
  page,
  limit,
  total,
  pages: Math.max(Math.ceil(total / limit), 1),
});

const isDateString = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

// Start of a local (Ethiopian) calendar day, expressed as a UTC Date.
const localDayStart = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d) - env.tzOffsetMinutes * 60 * 1000);
};

const todayRange = () => {
  const offsetMs = env.tzOffsetMinutes * 60 * 1000;
  const localMidnight = Math.floor((Date.now() + offsetMs) / DAY_MS) * DAY_MS - offsetMs;
  return { start: new Date(localMidnight), end: new Date(localMidnight + DAY_MS) };
};

module.exports = {
  DAY_MS,
  HOUR_MS,
  escapeRegex,
  parsePagination,
  buildMeta,
  isDateString,
  localDayStart,
  todayRange,
};
