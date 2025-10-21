import {
  getAllContacts,
  getContactById,
  createContact,
  deleContact,
  upserContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
export async function allContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    req.user._id
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function contactByIdController(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: {
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      isFavourite: contact.isFavourite,
      contactType: contact.contactType,
      email: contact.email,
    },
  });
}

export async function createContactController(req, res) {
  const photo = req.file;
  const userId = req.user._id;

  let photoUrl;
  console.log('FILE:', req.file);

  console.log('BODY:', req.body);

  if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
    photoUrl = await saveFileToCloudinary(photo);
  } else {
    photoUrl = await saveFileToUploadDir(photo);
  }
  const contact = await createContact(userId, { ...req.body, photo: photoUrl });

  res.status(201).json({
    status: 201,
    mesage: 'Successfully created a contact!',
    data: contact,
  });
}

export async function deleContactController(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
  }
  res.status(204).send();
}

export async function upsertContactController(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
    photoUrl = await saveFileToCloudinary(photo);
  } else {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const result = await upserContact(contactId, userId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  if (result.updatedExisting === true) {
    res.status(200).json({
      status: 201,
      message: 'Successfully patched a contact!',
      data: result,
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
}
