export interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: Date;
  requestBody?: string;
  requestHeaders?: Record<string, string>;
  response?: {
    status: number;
    body: string;
    headers: Record<string, string>;
  };
}
