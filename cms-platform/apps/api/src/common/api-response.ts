export interface ApiEnvelope<T> {
  data: T;
  meta: {
    requestId: string;
  };
}

export function success<T>(data: T, requestId: string): ApiEnvelope<T> {
  return {
    data,
    meta: { requestId }
  };
}
