// import 'dotenv/config';
import { sequelize } from './store/sqlite.db.js';

import { Token } from './models/sequelize/Token.model.js';
import { User } from './models/sequelize/User.model.js';
import { Todo } from './models/sequelize/Todo.model.js';

// User has one Token (one-to-one relationship)
const UserHasOneToken = User.hasOne(Token, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

// Token belongs to User (one-to-one relationship)
const TokenBelongsToUser = Token.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

// Todo belongs to User (many-to-one relationship)
const TodoBelongsToUser = Todo.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

// User has many Todos (one-to-many relationship)
const UserHasManyTodo = User.hasMany(Todo, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
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
    console.log('Database & tables created!');
  })
  .catch(err => console.error('Error creating database tables:', err));
