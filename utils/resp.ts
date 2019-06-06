const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const okResp = <T = any>(data: T, cache?: boolean) => ({
  statusCode: 200,
  headers: {
    ...corsHeaders,
    'X-Api-Cache': cache ? 'true' : undefined,
  },
  body: JSON.stringify(data),
});

export const serverErrResp = (data: string) => ({
  statusCode: 503,
  headers: {...corsHeaders},
  body: JSON.stringify({error: data}),
});

export const notFoundResp = (data?: string) => ({
  statusCode: 404,
  headers: {...corsHeaders},
  body: JSON.stringify({error: data || ''}),
});

export const paramMissedResp = (paramName: string) => ({
  statusCode: 422,
  headers: {...corsHeaders},
  body: JSON.stringify({error: `"${paramName}" param missed`}),
});

export const paramWrongFormatResp = (paramName: string) => ({
  statusCode: 422,
  headers: {...corsHeaders},
  body: JSON.stringify({error: `Wrong "${paramName}" format`}),
});
