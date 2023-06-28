declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LISTEN_PORT: string;

      DEBUG?: string;
    }
  }
}

export {};
