'use strict';
// @ts-check

import * as todosServer from './todosServer.js';

/**
 * @param {string} serverName
 * @param {number} port
 * @param {string} clientUrl
 */
function serverRunInfo(serverName, port, clientUrl) {
  return (`
${serverName} is running on PORT=${port}
origin: ${clientUrl}
`);
};

todosServer.app.listen(todosServer.PORT, () => {
  console.info(serverRunInfo('todosServer', Number(todosServer.PORT), 'localhost'));
});
