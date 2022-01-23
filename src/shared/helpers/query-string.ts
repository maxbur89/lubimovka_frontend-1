// TODO: текущая реализация примитивная и не умеет в сложные структуры данных
export const stringify = (object: Record<string, unknown>): string => {
  if (!object) return '';

  return '?' + Object.keys(object).reduce((acc, key) => {
    if (!object[key]) return acc;

    return `${acc}${acc && '&'}${key}=${object[key]}`;
  }, '');
};
