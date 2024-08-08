'use strict';
// @ts-check

import express from 'express';
import path from 'node:path';

/** @type {import('express').Router} */
export const rootRouter = express.Router();

rootRouter.get('^\/$|\/index(.html)?', getIndexFile);

/** @type {import('src/types/func.type.js').Middleware} */
function getIndexFile(req, res) {
  res.sendFile(path.resolve('./public/views/index.html'));
}
