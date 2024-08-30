'use strict';
// @ts-check

import { Token } from '../../models/sequelize/Token.model.js';

/** @typedef {import('src/types/token.type.js').TyToken.Item} TyTokenItem*/
/** @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes*/

export const tokenService = {
  getByRefreshToken,
  save,
  remove,
};

/** @param {TyTokenCreationAttributes} tokenCreationAttributes*/
async function save({ userId, refreshToken }) {
  const foundToken = await Token.findOne({
    where: { userId },
  });

  if (foundToken) {
    Object.assign(foundToken, {
      ...foundToken.dataValues,
      refreshToken,
    });

    return foundToken.save();

  }

  return Token.create({ userId, refreshToken });
}

/** @param {TyTokenItem['refreshToken']} refreshToken */
function getByRefreshToken(refreshToken) {
  return Token.findOne({
    where: { refreshToken },
  });
}

/** @param {TyTokenItem['userId']} userId */
function remove(userId) {
  return Token.destroy({
    where: { userId },
  });
}
