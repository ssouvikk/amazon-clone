/**
 * Interface for DB Connection simulation
 */
export interface IDbConnection {
  uri?: string;
  connected: boolean;
  type: string;
}
