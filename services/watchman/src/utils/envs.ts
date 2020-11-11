import { isString } from 'lodash';

export const getEnvPort = () => {
  if (isString(process.env.PORT)) {
    const val = parseInt(process.env.PORT, 10);
    if (!isNaN(val)) {
      return val;
    }
  }
  return 8080;
};

export type NodeEnv = 'dev' | 'prd' | 'loc';

export const getNodeEnv = (): NodeEnv => {
  const val = process.env.NODE_ENV;
  if (!isString(val)) {
    return 'prd';
  }
  switch (val.toLowerCase()) {
    case 'dev':
      return 'dev';
    case 'loc':
      return 'loc';
    case 'prd':
      return 'prd';
    default:
      return 'prd';
  }
};
