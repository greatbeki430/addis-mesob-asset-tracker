import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/client.js';
import useDebounce from './useDebounce.js';

const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined));

/**
 * Loads a paginated list. Filters are debounced, the page resets to 1
 * whenever a filter changes, and stale responses are ignored.
 */
export default function usePagedQuery(endpoint, filters = {}, limit = 10) {
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({ items: [], meta: { page: 1, pages: 1, total: 0 }, loading: true });

  const filterKey = useDebounce(JSON.stringify(filters), 350);
  const previousKey = useRef(filterKey);

  useEffect(() => {
    const filtersChanged = previousKey.current !== filterKey;
    previousKey.current = filterKey;
    if (filtersChanged && page !== 1) {
      setPage(1); // effect re-runs with page = 1
      return undefined;
    }

    let ignore = false;
    setState((s) => ({ ...s, loading: true }));

    api
      .get(endpoint, { params: { ...clean(JSON.parse(filterKey)), page, limit } })
      .then((res) => {
        if (!ignore) setState({ items: res.data, meta: res.meta, loading: false });
      })
      .catch((err) => {
        if (ignore) return;
        setState((s) => ({ ...s, loading: false }));
        toast.error(getErrorMessage(err));
      });

    return () => {
      ignore = true;
    };
  }, [endpoint, filterKey, page, limit, tick]);

  return { ...state, page, setPage, reload: () => setTick((t) => t + 1) };
}
