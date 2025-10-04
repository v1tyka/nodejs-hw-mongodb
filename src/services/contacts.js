import { Contact } from '../models/contact.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite
) => {
  const filter = {};

  if (type) filter.contactType = type;
  if (isFavourite !== undefined)
    filter.isFavourite = isFavourite === 'true' ? true : false;

  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const totalItems = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(perPage);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createNewContact = async (body) => {
  return await Contact.create(body);
};

export const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
    runValidators: true,
  });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
