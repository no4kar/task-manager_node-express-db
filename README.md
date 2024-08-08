# Node Task Manager with SQLite Database

This project is a simple [task manager server](https://node-todos-with-db.onrender.com/) built with Node.js with [Express.js](https://expressjs.com/) and SQLite3 DB controlled by [Sequelize ORM](https://sequelize.org/). It includes [API documentation using Swagger](https://node-todos-with-db.onrender.com/api-docs/) and is configured to support TypeScript for development.

## Warning

**Note:** The hosting service where the server is deployed may run slowly. The first request, also known as a "cold start" may take up to 50 seconds.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Author](#author)
- [License](#license)

## Features

- Node.js server with Express
- SQLite3 database integration
- Environment variable management with dotenv
- Swagger for API documentation
- Nodemon for development
- TypeScript support
- Linting with ESLint

## Prerequisites

- Node.js v18.18.0
- npm v9.8.1

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/no4kar/node_todos-with-db.git
    cd node_todos-with-db
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up the environment variables by creating a `.env` file in the root directory and adding your variables. Example:
    ```env
    DATABASE_URL=sqlite://./data/todos.sqlite
    ```

4. Run the setup script to initialize the database:
    ```bash
    npm run setup
    ```

## Usage

### Start the Server

To start the server, run:
    ```bash
    npm start
    ```

## API Documentation

- You can find all the server's endpoints [here](https://node-todos-with-db.onrender.com/api-docs/).
- Each endpoint can be tested by pressing the "Try it out" button and filling out the required form to ensure the server functions correctly.

## Project Structure

- `src/`: Source files
- `public/`: Static files

## Author

- Bakhtiiar Asadov - [no4kar](https://github.com/no4kar)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
