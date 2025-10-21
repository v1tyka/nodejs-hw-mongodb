import { SORT_ORDER } from '../constants/index.js';

function parseSortBy(sortBy) {
  if (typeof sortBy === 'undefined') {
    return '_id';
  }

  const params = [
    '_id',
    'name',
    'age',
    'gender',
    'avgMark',
    'onDuty',
    'createdAt',
    'updatedAt',
  ];
  if (params.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
}

function parseSortOrder(sortOrder) {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) {
    return sortOrder;
  }

  return SORT_ORDER.ASC;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
