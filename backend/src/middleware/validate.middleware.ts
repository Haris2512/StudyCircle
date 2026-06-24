// Middleware untuk memvalidasi data permintaan (request) menggunakan skema Zod
import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((e: any) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return next(error);
    }
  };
};
