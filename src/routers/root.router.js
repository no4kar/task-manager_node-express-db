'use strict';
// @ts-check

import express from 'express';
import path from 'node:path';

/** @type {import('express').Router} */
export const router = express.Router();

router.get('^\/$|\/index(.html)?', getIndexFile);

/** @type {import('../types/func.type.js').Middleware} */
function getIndexFile(req, res) {
  res.sendFile(path.resolve('./public/views/index.html'));
}
