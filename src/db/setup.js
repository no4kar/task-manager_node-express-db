import { sequelize } from '../store/sequelize.db.js';

import UserModel from '../models/sequelize/User.js';
import TokenModel from '../models/sequelize/Token.js';
import TodoModel from '../models/sequelize/Todo.js';
import TaskModel from '../models/sequelize/Task.js';
import { logger } from '#utils/logger.js';

// User has one Token (one-to-one relationship)
const UserHasOneToken
  = UserModel.hasOne(TokenModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });

// Token belongs to User (one-to-one relationship)
const TokenBelongsToUser
  = TokenModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });

// User has many Todos (one-to-many relationship)
const UserHasManyTask
  = UserModel.hasMany(TaskModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });

const TaskBelongsToUser
  = TaskModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });

const TaskHasManyTodo
  = TaskModel.hasMany(TodoModel, {
    foreignKey: 'taskId',
    onDelete: 'CASCADE',
  });

const TodoBelongsToTask
  = TodoModel.belongsTo(TaskModel, {
    foreignKey: 'taskId'
  });

await sequelize.sync({ force: true })
  .then(() => {
    /* eslint-disable no-console */
    logger.info('\n\n\tUserHasOneToken\n');
    logger.dir(UserHasOneToken);
    logger.info('\n\n\tTokenBelongsToUser\n');
    logger.dir(TokenBelongsToUser);

    logger.info('\n\n\tUserHasManyTask\n');
    logger.dir(UserHasManyTask);
    logger.info('\n\n\tTaskBelongsToUser\n');
    logger.dir(TaskBelongsToUser);

    logger.info('\n\n\tTaskHasManyTodo\n');
    logger.dir(TaskHasManyTodo);
    logger.info('\n\n\tTodoBelongsToTask\n');
    logger.dir(TodoBelongsToTask);

    logger.info('\n\n\tDatabase & tables created!');
  })
  .catch(err => logger.error('Error creating database tables:', err));
