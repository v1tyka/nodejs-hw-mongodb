import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
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
