/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

declare module '*.md' {
  const content: any;
  export default content;
}

declare module 'googlemaps';

declare const VERSION: string | undefined;
declare const ENV: 'dev' | 'prd' | 'loc' | undefined;
declare const MAPS_API_KEY: string | undefined;
declare const APP_NAME: string | undefined;
declare const APP_TITLE: string | undefined;
declare const APP_COMPANY: string | undefined;
declare const APP_DESCRIPTION: string | undefined;
declare const APP_URL: string | undefined;

interface Navigator {
  userLanguage?: string;
  browserLanguage?: string;
  systemLanguage?: string;
}
