/* eslint-disable no-unused-vars */
import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createNewContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

// --- GET /contacts ---
// Підтримує пагінацію, сортування і фільтрацію
export const fetchAllContacts = async (req, res, next) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const contacts = await getAllContacts(
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

// --- GET /contacts/:contactId ---
export const fetchContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// --- POST /contacts ---
export const createContact = async (req, res, next) => {
  const newContact = await createNewContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// --- PATCH /contacts/:contactId ---
export const patchContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

// --- DELETE /contacts/:contactId ---
export const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send(); // ✅ 204 No Content
};
