// @ts-check
'use strict';

import * as todosServer from './todosServer.js';
import { env } from './configs/env.config.js';

/**
 * @param {string} serverName
 * @param {Object} configs */
function serverRunInfo(serverName, configs) {
  return (`
${serverName} is running 
server: ${configs.server.host}
client: ${configs.client.host}
`);
};

todosServer.app.listen(env.todo.server.port, () => {
  console.info(serverRunInfo('todosServer', env.todo));
});
