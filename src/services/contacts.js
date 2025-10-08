import { Contact } from '../models/contact.js';
import createHttpError from 'http-errors';

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

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) throw createHttpError(404, 'Contact not found');
  return contact;
};

export const createNewContact = async (body, userId) => {
  return await Contact.create({ ...body, userId });
};

export const updateContact = async (contactId, body, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!contact) throw createHttpError(404, 'Contact not found');
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!contact) throw createHttpError(404, 'Contact not found');
  return contact;
};
