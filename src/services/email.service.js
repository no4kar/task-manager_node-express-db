// @ts-check
'use strict';

import nodemailer from 'nodemailer';
import { 
  smtp as smtpConfig,
  todos as todosConfig,
 } from '../config.js';

export const emailService = {
  send,
  sendActivationLink,
};

const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.password,
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
  const link = `${todosConfig.server.host}/activate/${token}`;

  return send({
    email,
    subject: 'Account activation',
    html: `
      <h1>Account activation</h1>
      <a href="${link}">${link}</a>
    `,
  });
}
