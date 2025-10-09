/* eslint-disable no-unused-vars */
import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createNewContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

// GET /contacts
export const fetchAllContacts = async (req, res, next) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const userId = req.user._id;

  const contacts = await getAllContacts(
    userId,
    Number(page),
    Number(perPage),
    sortBy,
    sortOrder,
    type,
    isFavourite
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// GET /contacts/:contactId
export const fetchContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// POST /contacts
export const createContact = async (req, res, next) => {
  const userId = req.user._id;
  const newContact = await createNewContact(req.body, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH /contacts/:contactId
export const patchContact = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const updatedContact = await updateContact(contactId, req.body, userId);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

// DELETE /contacts/:contactId
export const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deletedContact = await deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
