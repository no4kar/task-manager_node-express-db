// @ts-check
import * as todosServer from './todosServer.js';

const serverRunInfo = (serverName, port, clientUrl) => (`
${serverName} is running on PORT=${port}
origin: ${clientUrl}
`);

todosServer.app.listen(todosServer.PORT, () => {
  console.info(serverRunInfo('todosServer', todosServer.PORT));
});
