export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      SOCKET_URL: string;
    };
  }
}
