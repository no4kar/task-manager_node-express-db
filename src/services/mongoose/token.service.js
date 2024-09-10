// @ts-check
'use strict';

import { Token } from '../../models/mongoose/Token.model.js';

/** @typedef {import('src/types/token.type.js').TyToken.Item} TyToken*/
/** @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes*/
/** @typedef {import('mongoose').FilterQuery<TyToken>} TyTokenFilterQuery */
/** @typedef {import('src/types/db.type.js').TyMongoose.Query.Item<TyToken>} TyTokenQueryItem */


export const tokenService = {
  getByRefreshToken,
  save,
  remove,
};

/** @param {TyTokenCreationAttributes} tokenCreationAttributes*/
async function save({ userId, refreshToken }) {
  /** @type {TyTokenQueryItem} */
  const query
    = Token.findOne({ userId });

  const foundToken = await query.exec();

  if (foundToken) {
    foundToken.refreshToken = refreshToken;

    return foundToken.save();
  }

  return Token.create({ userId, refreshToken });
}

/** @param {TyToken['refreshToken']} refreshToken */
async function getByRefreshToken(refreshToken) {
  /** @type {TyTokenQueryItem} */
  const query
    = Token.findOne({ refreshToken });

  return query.exec();
}

/** 
 * @param {TyToken['userId']} userId 
 * @returns {Promise<{acknowledged: boolean, deletedCount: number}>} */
function remove(userId) {
  /** @type {TyTokenQueryItem} */
  const query = Token.findOne({ userId });

  return query.deleteOne().exec();
}
