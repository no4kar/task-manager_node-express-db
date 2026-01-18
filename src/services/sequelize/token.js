'use strict';
// @ts-check

import Tokens from '#models/sequelize/Token.js';

/**
 * @typedef {import('src/types/token.type.js').TyToken.Item} TyToken
 * @typedef {import('src/types/token.type.js').TyToken.GetParams} TyTokenGetParams
 * @typedef {import('src/types/token.type.js').TyToken.UpdateParams} TyTokenUpdateParams
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyToken,TyTokenCreationAttributes>} TyTokenModel
 * @typedef {import('src/types/db.type.js').TySequelize.Query.WhereOptions<TyToken>} TyTokenWhereConditions
 * @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes
*/

export default {
  create,
  getByOptions,
  getOneByOptions,
  update,
  put, // This is essentially an upsert based on userId
  remove,
  removeByUserId,

  toObject,
  getValue,
};

/** Creates a new token record.
 * @param {TyTokenCreationAttributes} creationAttributes - Data for the new token.
 */
async function create(creationAttributes) {
  return Tokens.create(creationAttributes);
}

/**
 * Updates specific properties of an existing token model.
 * Requires the model to be fetched first.
 * @param {TyTokenModel} model - The Sequelize model instance to update.
 * @param {TyTokenUpdateParams} properties - An object containing the properties to update.
 * @returns {Promise<TyTokenModel>} A promise resolving to the updated token model.*/
function update(model, properties) {
  return model.set(properties).save();
}

/** Finds a token by userId. If found, updates refresh and activation tokens.
 * If not found, creates a new token record. (Upsert based on userId).
 * @param {TyTokenCreationAttributes} tokenData - Data containing userId, refresh, and activation tokens.
 * @returns {Promise<TyTokenModel>} A promise resolving to the updated or created token model.
 */
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

/** Finds multiple token models matching the given filter conditions.
 * @param {TyTokenWhereConditions} whereConditions - Sequelize filter query object.
 * @returns {Promise<TyTokenModel[]>} A promise resolving to an array of found token models.*/
function getByOptions(whereConditions) {
  return Tokens.findAll({ where: whereConditions });
}

/** Finds a single token model matching the given filter conditions.
 * @param {TyTokenWhereConditions} whereConditions - Sequelize filter query object.
 * @returns {Promise<TyTokenModel | null>} A promise resolving to the found token model or null. */
function getOneByOptions(whereConditions) {
  return Tokens.findOne({ where: whereConditions });
}

/** Converts a Sequelize model instance to a plain JavaScript object.
 * @param {TyTokenModel} model - The Sequelize model instance.
 * @returns {TyToken} The plain JavaScript object representation.*/
function toObject(model) {
  return model.dataValues;
}

/**
 * Extracts a field value from a Sequelize document.
 * @template {keyof TyToken} K
 * @param {TyTokenModel} model
 * @param {K} key
 * @returns {TyToken[K]} */
function getValue(model, key) {
  return model.getDataValue(key);
}

/** Removes a specific token model instance.
 * Requires the model to be fetched first.
 * @param {TyTokenModel} model - The Sequelize model instance to remove.
 * @returns {Promise<number>} A promise resolving to the number of models deleted (0 or 1).*/
function remove(model) {
  return model.destroy()
    .then(() => 1);
}

/**
 * Removes a token model based on the user ID.
 * @param {TyToken['userId']} userId - The ID of the user whose token should be removed.
 * @returns {Promise<number>} A promise resolving to the number of models deleted (0 or 1).*/
function removeByUserId(userId) {
  // Using deleteOne directly is more efficient than findOne + deleteOne
  return Tokens.destroy({ where: { userId } });
}
