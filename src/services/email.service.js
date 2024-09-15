'use strict';
// @ts-check

import nodemailer from 'nodemailer';
import { env } from '../configs/env.config.js';

export const emailService = {
  send,
  sendActivationLink,
};

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.smtp.user,
    pass: env.smtp.password,
  },
});

/**
* @param {{email: string, subject: string, html: string}} params */
function send({ email, subject, html }) {
  return transporter.sendMail({
    from: 'Task Manager API', // sender address
    to: email,
    subject,
    text: '',
    html,
  });
}

/**
 * @param {string} email
 * @param {string} token */
function sendActivationLink(email, token) {
  const link = `${env.todo.client.host}/activate/${token}`;

  return send({
    email,
    subject: 'Account activation',
    html: `
      <h1>Account activation</h1>
      <a href="${link}">${link}</a>
    `,
  });
}
