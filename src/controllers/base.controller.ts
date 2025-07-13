import { Request, Response, NextFunction } from "express";

export interface BaseController {
  index(req: Request, res: Response, next: NextFunction): Promise<void>;
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export abstract class BaseHttpController implements BaseController {
  public abstract index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  public abstract create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  public abstract show(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  public abstract update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  public abstract delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  protected sendSuccess(
    res: Response,
    data: any,
    message: string = "Success"
  ): Response {
    return res.json({
      success: true,
      message,
      data,
    });
  }

  protected sendError(
    res: Response,
    message: string,
    statusCode: number = 400
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
    });
  }
}
