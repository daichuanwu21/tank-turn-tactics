import { NextFunction, Request, Response } from "express";

const asyncWrapper =
  (callback: any) => (req: Request, res: Response, next: NextFunction) =>
    callback(req, res).catch(next);

export default asyncWrapper;
