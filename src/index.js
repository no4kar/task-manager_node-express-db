// @ts-check
'use strict';

import * as todosServer from './todosServer.js';
import { todo as todoConfig } from './configs/env.config.js';

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

todosServer.app.listen(todoConfig.server.port, () => {
  console.info(serverRunInfo('todosServer', todoConfig));
});
