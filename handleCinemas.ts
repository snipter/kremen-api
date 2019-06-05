import { APIGatewayProxyHandler } from 'aws-lambda';
import { getCinemas } from 'services/cinemas';
import { Log, okResp, serverErrResp, notFoundResp } from 'utils';
const log = Log('cinemas.handler');

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  log.trace('event=', event);
  try {
    const { resource } = event;
    if (resource === '/cinemas') {
      log.start('/cinemas');
      const data = await getCinemas();
      log.end('/cinemas');
      return okResp(data);
    }
    return notFoundResp(`${resource} not found`);
  } catch(err) {
    log.err(err);
    return serverErrResp(err.message);
  }
}
