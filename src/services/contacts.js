import { Contact } from '../models/contact.js';

// Повертає всі контакти
export const getAllContacts = async () => {
  return await Contact.find();
};

// Повертає контакт за ID
export const getContactById = async (id) => {
  return await Contact.findById(id);
};
