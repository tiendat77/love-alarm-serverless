import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRoute from './routes/user.route';
import versionRoute from './routes/version.route';

// Create the express app
const port = process.env.PORT || 8080;
const app: Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// API routes
app.use('/', versionRoute);
app.use('/user', userRoute);

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
