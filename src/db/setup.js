import { sequelize } from '../store/sequelize.db.js';

import UserModel from '../models/sequelize/User.js';
import TokenModel from '../models/sequelize/Token.js';
import TodoModel from '../models/sequelize/Todo.js';
import TaskModel from '../models/sequelize/Task.js';

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
    console.info('\n\n\tUserHasOneToken\n');
    console.dir(UserHasOneToken);
    console.info('\n\n\tTokenBelongsToUser\n');
    console.dir(TokenBelongsToUser);

    console.info('\n\n\tUserHasManyTask\n');
    console.dir(UserHasManyTask);
    console.info('\n\n\tTaskBelongsToUser\n');
    console.dir(TaskBelongsToUser);

    console.info('\n\n\tTaskHasManyTodo\n');
    console.dir(TaskHasManyTodo);
    console.info('\n\n\tTodoBelongsToTask\n');
    console.dir(TodoBelongsToTask);

    console.info('\n\n\tDatabase & tables created!');
  })
  .catch(err => console.error('Error creating database tables:', err));
