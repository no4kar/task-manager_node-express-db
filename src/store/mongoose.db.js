import mongoose from 'mongoose';
import { env } from '../configs/env.config.js';

export function connectDB() {
    return mongoose.connect(
      `mongodb+srv://${env.mangodb.user}:${env.mangodb.password}@cluster-node.2f56p.mongodb.net/task-manager?retryWrites=true&w=majority&appName=cluster-node`,
    );
}

export function createConnectionDB() {
    return mongoose.createConnection(
      `mongodb+srv://${env.mangodb.user}:${env.mangodb.password}@cluster-node.2f56p.mongodb.net/task-manager?retryWrites=true&w=majority&appName=cluster-node`,
    );
}
