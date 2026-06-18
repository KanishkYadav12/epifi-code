export interface Check {
  _id: string;
  monitorId: string;
  statusCode: number | null;
  responseTimeMs: number;
  isUp: boolean;
  checkedAt: string;
  error: string | null;
}

export interface Monitor {
  _id: string;
  name: string;
  url: string;
  createdAt: string;
  latestCheck: Check | null;
}

export interface CheckUpdatePayload {
  monitorId: string;
  statusCode: number | null;
  responseTimeMs: number;
  isUp: boolean;
  checkedAt: string;
  error: string | null;
}