// TODO: текущая реализация примитивная и не умеет в сложные структуры данных
export const stringify = (object: Record<string, unknown>): string => {
  if (!object) return '';

  return Object.keys(object).reduce((acc, key, index, arr) => {
    if (!object[key]) return acc;

    return `${key}=${object[key]}${index < arr.length ? '&' : ''}`;
  }, '?');
};
