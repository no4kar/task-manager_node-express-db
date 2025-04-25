import { sequelize } from '../store/sqlite.db.js';

import { TokenModel } from '../models/sequelize/Token.model.js';
import { UserModel } from '../models/sequelize/User.model.js';
import { TodoModel } from '../models/sequelize/Todo.model.js';
import { TaskModel } from 'src/models/sequelize/Task.model.js';

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

// Todo belongs to User (many-to-one relationship)
const TodoBelongsToUser
  = TodoModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });

// User has many Todos (one-to-many relationship)
const UserHasManyTodo
  = UserModel.hasMany(TodoModel, {
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
    console.info('\n\n\tTokenBelongsToUser\n');
    console.dir(TokenBelongsToUser);
    console.info('\n\n\tUserHasOneToken\n');
    console.dir(UserHasOneToken);
    console.info('\n\n\tTodoBelongsToUser\n');
    console.dir(TodoBelongsToUser);
    console.info('\n\n\tUserHasManyTodo\n');
    console.dir(UserHasManyTodo);
    console.info('\n\n\tTaskHasManyTodo\n');
    console.dir(TaskHasManyTodo);
    console.info('\n\n\tTodoBelongsToTask\n');
    console.dir(TodoBelongsToTask);
    console.log('Database & tables created!');
  })
  .catch(err => console.error('Error creating database tables:', err));
