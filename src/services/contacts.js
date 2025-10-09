import { Contact } from '../models/contact.js';

// Pagination + sorting + filtering by userId + optional filters (type/isFavourite)
export const getAllContacts = async (
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite
) => {
  const filter = { userId };

  if (type) filter.contactType = type;
  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = isFavourite === 'true' || isFavourite === true;
  }

  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const [data, totalItems] = await Promise.all([
    Contact.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createNewContact = async (body, userId) => {
  const contactData = { ...body, userId };
  return await Contact.create(contactData);
};

export const updateContact = async (contactId, body, userId) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, body, {
    new: true,
    runValidators: true,
  });
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
