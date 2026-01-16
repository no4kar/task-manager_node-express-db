'use strict';
// @ts-check

import mongoose from 'mongoose';

/** @type {mongoose.mongo.GridFSBucket | null} */
let _bucket = null;

/**
 * Call once after mongoose connection is ready
 * @param {Object} [options]
 * @param {string} [options.bucketName='images']
 * @return {mongoose.mongo.GridFSBucket | never}*/
function initGridFSBucket({
  bucketName = 'images',
} = {}) {
  if (!mongoose.connection?.db) {
    throw new Error('Mongo connection not ready yet');
  }

  _bucket = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db, {
    bucketName,
  });

  return _bucket;
}

/**
 * @returns {mongoose.mongo.GridFSBucket} */
export function getBucket() {
  if (!_bucket) {
    initGridFSBucket();

    if (!_bucket) {
      throw new Error('GridFSBucket not initialized');
    }
  }

  return _bucket;
}
