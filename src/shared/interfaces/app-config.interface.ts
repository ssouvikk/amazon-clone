export interface IAppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  db: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}
