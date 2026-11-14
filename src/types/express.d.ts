export interface JwtAdminPayload {
  id: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      admin?: JwtAdminPayload;
    }
  }
}

export {};
