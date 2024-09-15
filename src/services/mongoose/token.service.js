'use strict';
// @ts-check

import { Token as Tokens } from '../../models/mongoose/Token.model.js';

/**
 * @typedef {import('src/types/token.type.js').TyToken.Item} TyToken
 * @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes
*/

export const tokenService = {
  getByRefreshToken,
  save,
  remove,
};

/**
 * @param {TyTokenCreationAttributes} param0
 * @returns */
async function save({
  userId,
  refreshToken,
}) {
  const query
    = Tokens.findOne({ userId });

  const foundToken = await query.exec();

  if (foundToken) {
    foundToken.refreshToken = refreshToken;

    return foundToken.save();
  }

  return Tokens.create({ userId, refreshToken });
}

/**
 * @param {TyToken['refreshToken']} refreshToken
 * @returns */
function getByRefreshToken(refreshToken) {
  const query
    = Tokens.findOne({ refreshToken });

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
