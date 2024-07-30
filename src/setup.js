import 'dotenv/config';
import { sequelize } from './store/sqlite.db.js';

import './models/Token.model.js';
import './models/User.model.js';
import './models/Todo.model.js';

sequelize.sync({ force: true });
