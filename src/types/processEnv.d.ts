declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * @description port 端口号
     */
    PORT?: string;
    /**
     * @description db url mysql
     */
    DATABASE_URL?: string;
    /**
     * @description www public path
     * @default './public'
     */
    PUBLIC_PATH: string;
    /**
     * @description static file public path
     * @default './static'
     */
    STATIC_PATH: string;
    /**
     * @description public path prefix
     * @default '/public/'
     */
    PUBLIC_PREFIX_PATH: string;
  }
}
