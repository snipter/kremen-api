export const okResp = <T = any>(data: T) => ({
  statusCode: 200,
  body: JSON.stringify({status: 'ok', data}),
});

export const serverErrResp = (data: string) => ({
  statusCode: 503,
  body: JSON.stringify({
    status: 'error',
    data,
  }),
});

export const notFoundResp = (data?: string) => ({
  statusCode: 404,
  body: JSON.stringify({
    status: 'error',
    data: data || '',
  }),
});
