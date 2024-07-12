// @ts-check
'use strict';

import express from 'express';
export const router = express.Router();

import * as todoController from '../controllers/todo.controller.js';
import { isAction } from '../middlewares/todo.middleware.js';
import { catchError } from '../middlewares/catchError.js';

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Retrieve a list of todos
 *     description: |
 *      Retrieve a list of all todos or todos by a specific user if `userId` is provided.
 *       *       
 *       ### Example Request
 *       ```http
 *       GET /todos?userId=11967
 *       ```
 *       
 *       ### Responses
 *       - **200 OK**: Returns a single todo item.
 *       - **404 Not Found**: If no todo matches the specified ID.
 *       - **500 Internal Server Error**: For server issues.
 * 
 *     tags:
 *       - Todos
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: false
 *         description: The ID of the user to retrieve todos for
 *     responses:
 *       200:
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       404:
 *         description: No todos found for the specified userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', catchError(todoController.get));
/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Retrieve a todo by ID
 *     description: |
 *       Fetch a single todo item by its **`id`**.
 *       Use the `GET` method with the todo ID in the path.
 *       
 *       ### Example Request
 *       ```http
 *       GET /todos/49894080-d3e4-11ee-8a1a-f51ed463b818
 *       ```
 *       
 *       ### Responses
 *       - **200 OK**: Returns a single todo item.
 *       - **404 Not Found**: If no todo matches the specified ID.
 *       - **500 Internal Server Error**: For server issues.
 *       
 *       [Learn more about error codes](https://example.com/errors)
 *       
 *       ![Todo Icon](https://example.com/todo-icon.png)
 *       
 *       ---
 *       *Ensure authentication headers are included.*
 *     tags:
 *       - Todos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the todo to retrieve
 *     responses:
 *       200:
 *         description: A single todo item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: No todo found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', catchError(todoController.getById));

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: SUMMARY
 *     description: `DESCRIPTION`.
 *     tags:
 *       - Todos
 *     parameters:
 *       - in: body
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: `userId` description
 *     responses:
 *       200:
 *         description: A single todo item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: No todo found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', catchError(todoController.post));

router.put('/:id', catchError(todoController.put));

router.patch('/:id', catchError(todoController.patchById));
router.patch('/', isAction('delete'), catchError(todoController.removeMany));// chain of responsibility
router.patch('/', isAction('update'), catchError(todoController.updateMany));
router.patch('/', catchError(todoController.patchBulkUnknown));

router.delete('/:id', catchError(todoController.remove));
