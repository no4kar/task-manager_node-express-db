import 'dotenv/config';

import todosServer from './todosServer.js';

const PORT = process.env.TODOS_PORT || 3015;

const serverRunInfo = (serverName, port, clientUrl) => (`
${serverName} is running on PORT=${port}
origin: ${clientUrl}
`);

todosServer.listen(PORT, () => {
  console.info(serverRunInfo('todosServer', PORT));
});
