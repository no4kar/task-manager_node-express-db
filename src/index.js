// @ts-check
'use strict';

import * as todosServer from './todosServer.js';
import { todo as todoConfig } from './config.js';

/**
 * @param {string} serverName
 * @param {number} port
 * @param {string} clientUrl */
function serverRunInfo(serverName, port, clientUrl) {
  return (`
${serverName} is running on PORT=${port}
origin: ${clientUrl}
`);
};

todosServer.app.listen(todoConfig.server.port, () => {
  console.info(serverRunInfo('todosServer', Number(todoConfig.server.port), 'localhost'));
});
