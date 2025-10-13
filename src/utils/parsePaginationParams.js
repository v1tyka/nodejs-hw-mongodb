function parseNumbers(number, defaultValue) {
  if (typeof number === 'undefined') {
    return defaultValue;
  }

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }

  return number;
}

export function parsePaginationParams(query) {
  const { page, perPage } = query;

  const parsedPage = parseNumbers(page, 1);
  const parsedPerPage = parseNumbers(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
}
