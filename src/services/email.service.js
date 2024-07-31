// @ts-check
'use strict';

import nodemailer from 'nodemailer';
import { smtp as smtpConfig } from '../config.js';

export {
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
* @param {Object} param0 
* @param {string} param0.email 
* @param {string} param0.subject 
* @param {string} param0.html  */
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
  const link = `${process.env.CLIENT_URL}/activate/${token}`;

  return send({
    email,
    subject: 'Account activation',
    html: `
      <h1>Account activation</h1>
      <a href="${link}">${link}</a>
    `,
  });
}
