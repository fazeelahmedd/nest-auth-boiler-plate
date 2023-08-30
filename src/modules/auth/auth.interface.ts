export interface AuthRequest extends Request {
  user?: RefreshPayloadWithExp;
}

export interface JwtAccessPayload {
  user_id: number;
  role_ids: number[];
  roles: string[];
}

export interface JwtOtpPayload {
  user_id: number;
}

export interface RefreshPayloadWithExp extends JwtAccessPayload {
  refresh_token: string;
}

export interface JwtPayloadWithExp extends JwtAccessPayload {
  iat: number;
  exp: number;
}
