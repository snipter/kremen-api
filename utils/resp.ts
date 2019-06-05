export const okResp = <T = any>(data: T) => ({
  statusCode: 200,
  body: JSON.stringify(data),
});

export const serverErrResp = (data: string) => ({
  statusCode: 503,
  body: JSON.stringify({error: data}),
});

export const notFoundResp = (data?: string) => ({
  statusCode: 404,
  body: JSON.stringify({error: data || ''}),
});

export const paramMissedResp = (paramName: string) => ({
  statusCode: 422,
  body: JSON.stringify({error: `"${paramName}" param missed`}),
});

export const paramWrongFormatResp = (paramName: string) => ({
  statusCode: 422,
  body: JSON.stringify({error: `Wrong "${paramName}" format`}),
});
