import { JwtPayload } from 'jwt-decode';

export interface LoginRequestData {
  username: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
}

export type JWTLoginPayload = JwtPayload & {
  username: string;
  email: string;
};

export type UserInfo = Pick<JWTLoginPayload, 'email' | 'username'> & {
  id?: string;
};
