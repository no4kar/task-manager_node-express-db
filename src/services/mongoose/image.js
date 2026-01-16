'use strict';
// @ts-check

import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import mongoose from 'mongoose';

import { getBucket } from '#services/mongoose/gridFs.js';

/**
 * @typedef {mongoose.Types.ObjectId} ObjectId
 *
 * @typedef {mongoose.mongo.GridFSFile} GridFSFile
 *
 * @typedef {mongoose.mongo.Sort} Sort
 *
 * @typedef {import('#types/db.type.js')
 * .TyMongoose.Query.RawFilter<GridFSFile>
 * } GridFSFileFilter
 */

export default {
  upload,
  downloadStreamById,
  downloadStreamByFilename,
  getByOptions,
  removeById,

  normalize,
  toObjectId,
}

/**
 * Convert hex string to mongoose.Types.ObjectId
 * @param {string} id
 * @return {ObjectId | null} */
function toObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return mongoose.Types.ObjectId.createFromHexString(id);
}

/** 
 * @param {GridFSFile} item
 * @returns {{    
 *   id: mongoose.mongo.BSON.ObjectId;
 *   length: number;
 *   filename: string;
 *   metadata?: mongoose.mongo.BSON.Document;
 *   uploadDate: Date; }} 
 * */
function normalize(item) {
  return {
    id: item._id,
    length: item.length,
    filename: item.filename,
    metadata: item.metadata,
    uploadDate: item.uploadDate,
  };
}

/**
 * Upload a file buffer to GridFS.
 *
 * @param {Object} params - File upload parameters.
 * @param {string} params.originalname - Original file name from client.
 * @param {string} params.mimetype - MIME type of the file.
 * @param {Buffer} params.buffer - File data as a Buffer.
 * @param {string} params.uploadedBy - Identifier of the uploader.
 * @returns {Promise<{
 *   id: ObjectId,
 *   filename: string,
 *   options: {
 *     contentType?: string,
 *     chunkSizeBytes?: number,
 *     metadata?: Record<string, any>
 *   }
 * }>} Resolves with basic upload info once the stream finishes.
*/
async function upload({
  originalname,
  mimetype,
  buffer,
  uploadedBy,
}) {
  const bucket = getBucket();

  const uploadStream
    = bucket.openUploadStream(
      originalname, {
      contentType: mimetype,
      metadata: {
        originalname,
        uploadedBy,
      },
    });

  Readable.from(buffer).pipe(uploadStream);

  return finished(uploadStream)
    .then(() => ({
      id: uploadStream.id,
      filename: uploadStream.filename,
      options: uploadStream.options,
    }));
}

/**
 * comment need
 *
 * @param {ObjectId} id
 * @returns */
function downloadStreamById(id) {
  const bucket = getBucket();
  return bucket.openDownloadStream(id);
}

/**
 * comment need
 *
 * @param {string} filename
 * @returns */
function downloadStreamByFilename(filename) {
  const bucket = getBucket();
  return bucket.openDownloadStreamByName(filename);
}

/**
 * Upload a file buffer to GridFS.
 *
 * @param {Object} getParams - File upload parameters.
 * @param {ObjectId} [getParams.id]
 * @param {string} [getParams.filename] - Original file name from client.
 * @param {number} [limit]
 * @param {number} [offset]
 * @param {Sort} [sort]
 * @returns {Promise<GridFSFile[]>}*/
function getByOptions({
  id,
  filename,
},
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
  sort = { uploadDate: -1 },
) {
  const bucket = getBucket();

  /** @type {GridFSFileFilter} */
  const whereConditions = {};

  if (id) {
    whereConditions._id
      = id;
  }
  if (filename) {
    whereConditions.filename
      = filename;
  }

  return bucket.find(whereConditions)
    .sort(sort)
    .limit(limit)
    .skip(offset)
    .toArray();
}

/**
 * comment need
 *
 * @param {ObjectId} id
 * @returns {Promise<number>}*/
function removeById(id) {
  const bucket = getBucket();

  return bucket.delete(id)
    .then(() => 1);
}
