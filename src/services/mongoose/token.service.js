'use strict';
// @ts-check

import { Token as Tokens } from '../../models/mongoose/Token.model.js';

/**
 * @typedef {import('src/types/token.type.js').TyToken.Item} TyToken
 * @typedef {import('src/types/token.type.js').TyToken.GetParams} TyTokenGetParams
 * @typedef {import('src/types/token.type.js').TyToken.UpdateParams} TyTokenUpdateParams
 * @typedef {import('src/types/db.type.js').TyMongoose.Document<unknown,{},TyToken>} TyTokenDocument
 * @typedef {import('src/types/db.type.js').TyMongoose.Query.Filter<TyToken>} TyTokenFilterQuery
 * @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes
*/

export const tokenService = {
  create,
  getByOptions,
  getByUserId,
  getByRefreshToken,
  getDataValue,
  update,
  put,
  remove,
};

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
 * @param {TyTokenCreationAttributes} param0
 * @returns */
async function put({
  userId,
  refresh,
  activation,
}) {
  const query
    = Tokens.findOne({ userId });

  const foundToken = await query.exec();

  if (foundToken) {
    return foundToken.set({ refresh, activation }).save();
  }

  return Tokens.create({ userId, refresh, activation });
}


/**
 * @param {TyTokenGetParams} param0
 * @returns */
function getByOptions({
  userId,
  activation,
  refresh,
}) {
  /** @type {TyTokenFilterQuery} */
  const whereConditions = {};

  if (userId !== undefined) {
    whereConditions.userId = userId;
  }

  if (activation !== undefined) {
    whereConditions.activation = activation;
  }

  if (refresh !== undefined) {
    whereConditions.refresh = refresh;
  }

  const query = Tokens.findOne(whereConditions);

  return query.exec();
}

/**
 * @param {TyTokenDocument} document 
 * @returns */
function getDataValue(document) {
  return document.toObject();
}

/**
 * @param {TyToken['userId']} userId
 * @returns */
function getByUserId(userId) {
  const query
    = Tokens.findOne({ userId });

  return query.exec();
}

/**
 * @param {TyToken['refresh']} refreshToken
 * @returns */
function getByRefreshToken(refreshToken) {
  const query
    = Tokens.findOne({ refresh: refreshToken });

  return query.exec();
}

/**
 * @param {TyToken['userId']} userId
 * @returns {Promise<{ acknowledged: boolean, deletedCount: number }>}*/
function remove(userId) {
  const query
    = Tokens.findOne({ userId });

  return query.deleteOne().exec();
}
