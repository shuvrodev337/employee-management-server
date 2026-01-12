import express, { Request, Response } from 'express';
const router = express.Router();
const getAController = (req: Request, res: Response) => {
  const a = 'Hello from demo';
  res.send(a);
};
router.get('/demo', getAController);

export const UserRoutes = router;
