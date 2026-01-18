'use strict';
// @ts-check

import Tokens from '#models/mongoose/Token.js';

/**
 * @typedef {import('src/types/token.type.js').TyToken.Item} TyToken
 * @typedef {import('src/types/token.type.js').TyToken.GetParams} TyTokenGetParams
 * @typedef {import('src/types/token.type.js').TyToken.UpdateParams} TyTokenUpdateParams
 * @typedef {import('src/types/db.type.js').TyMongoose.Document<unknown,{},TyToken>} TyTokenDocument
 * @typedef {import('src/types/db.type.js').TyMongoose.Query.Filter<TyToken>} TyTokenFilterQuery
 * @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes
*/

export default {
  create,
  getByOptions,
  getOneByOptions,
  update,
  put,
  remove,
  removeByUserId,

  toObject,
  getValue,
};

/**
 * @param {TyTokenDocument} document 
 * @returns */
function toObject(document) {
  return document.toObject();
}

/**
 * Extracts a field value from a Mongoose document.
 * @template {keyof TyToken} K
 * @param {TyTokenDocument} document
 * @param {K} key
 * @returns {TyToken[K]} */
function getValue(document, key) {
  return document.get(key);
}

/**
 * @param {TyTokenCreationAttributes} param0
 * @returns */
async function create({
  userId,
  refresh,
  activation
}) {
  return Tokens.create({ userId, refresh, activation });
}

/**
 * @param {TyTokenDocument} document
 * @param {TyTokenUpdateParams} properties
 * @returns */
function update(document, properties) {
  return document.set(properties).save();
}

/**
 * @param {TyTokenCreationAttributes} tokenData
 * @returns */
async function put({
  userId,
  refresh,
  activation,
}) {
  const foundToken
    = await getOneByOptions({ userId });

  if (foundToken) {
    return update(foundToken, { refresh, activation });
  }

  return create({ userId, refresh, activation });
}

/**
 * @param {TyTokenFilterQuery} whereConditions
 * @returns */
function getByOptions(whereConditions) {
  const query = Tokens.find(whereConditions);

  return query.exec();
}

/**
 * @param {TyTokenFilterQuery} whereConditions
 * @returns */
function getOneByOptions(whereConditions) {
  const query = Tokens.findOne(whereConditions);

  return query.exec();
}

/**
 * @param {TyTokenDocument} document
 * @returns */
function remove(document) {
  return document.deleteOne()
    .then(res => res.deletedCount);
}

/**
 * @param {TyToken['userId']} userId
 * @returns {Promise<number>}*/
function removeByUserId(userId) {
  const query
    = Tokens.findOne({ userId });

  return query.deleteOne().exec()
    .then(res => res.deletedCount);
}
