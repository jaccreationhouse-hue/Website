import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { env } from './config/env.js';

// Connect database and start server
const startServer = async () => {
  try {
    const conn = await connectToDatabase();
    console.log(`Database Connected: ${conn.connection.host}`);
    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });
  } catch (error) {
    console.error(`Connection Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
