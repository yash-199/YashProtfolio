// Immutable helpers for reading/writing nested values by path, e.g.
// ["journey", "experience", 0, "role"].

export const getIn = (obj, path) => path.reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

export const setIn = (obj, path, value) => {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  const current = obj?.[key];
  const next = setIn(current, rest, value);
  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[key] = next;
    return copy;
  }
  return { ...obj, [key]: next };
};

/** Array helpers that return new arrays. */
export const move = (arr, from, to) => {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};
export const removeAt = (arr, index) => arr.filter((_, i) => i !== index);
export const insertAt = (arr, index, item) => [...arr.slice(0, index), item, ...arr.slice(index)];

export const uid = (prefix = "id") => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
