export interface iResponseJson {
  message: string;
  data: any;
  code: number;
}

export interface IRedisUserModel {
  user_id: number;
  role: string[];
  role_id: number[];
}
