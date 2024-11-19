'use strict';
// @ts-check

import { Token } from '../../models/sequelize/Token.model.js';

/** @typedef {import('src/types/token.type.js').TyToken.Item} TyToken*/
/** @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes*/

export const tokenService = {
  getByRefreshToken,
  save,
  remove,
};

/** @param {TyTokenCreationAttributes} tokenCreationAttributes*/
async function save({ userId, refresh }) {
  const foundToken = await Token.findOne({
    where: { userId },
  });

  if (foundToken) {
    Object.assign(foundToken, {
      ...foundToken.dataValues,
      refresh,
    });

    return foundToken.save();

  }

  return Token.create({ userId, refresh });
}

/** @param {TyToken['refresh']} refresh */
function getByRefreshToken(refresh) {
  return Token.findOne({
    where: { refresh },
  });
}

/** @param {TyToken['userId']} userId */
function remove(userId) {
  return Token.destroy({
    where: { userId },
  });
}
