import express, { Application, Request, Response } from 'express';
import cors from 'cors';
const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// app.use('/api/v1/students', StudentRoutes);

const getAController = (req: Request, res: Response) => {
  const a = 'Hello World!';
  res.send(a);
};
app.get('/', getAController);

export default app;
