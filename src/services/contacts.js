import { ContactCollection } from '../db/models/contact.js';
import { SORT_ORDER } from '../constants/index.js';

export async function getAllContacts(
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  userId
) {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;
  // const contactsQuery = await ContactCollection.find();

  const [contacts, totalItems] = await Promise.all([
    await ContactCollection.find({ userId })
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: sortOrder })
      .exec(),
    ContactCollection.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page: page,
    perPage: perPage,
    totalItems: totalItems,
    totalPages: totalPages,
    hasNextPage: totalPages > 1,
    hasPreviousPage: page > 1,
  };
}

export async function getContactById(contactId, userId) {
  const res = await ContactCollection.findById({
    _id: contactId,
    userId: userId,
  });
  return res;
}

export async function createContact(payload, userId) {
  const res = await ContactCollection.create({
    name: payload.name,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
    isFavourite: payload.isFavourite,
    contactType: payload.contactType,
    userId: userId,
  });
  return res;
}

export async function deleContact(contactId, userId) {
  const res = ContactCollection.findByIdAndDelete({
    _id: contactId,
    userId: userId,
  });
  return res;
}

export async function upserContact(contactId, payload, userId) {
  const res = await ContactCollection.findByIdAndUpdate(
    { _id: contactId, userId: userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    }
  );
  console.log(res.value);
  return {
    value: res.value,
    updatedExisting: res.lastErrorObject.updatedExisting,
  };
}
