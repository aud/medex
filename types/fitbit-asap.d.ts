declare module "fitbit-asap/app" {
  interface Asap {
    send(message: any, options?: Options): void;
    cancel(id?: number): void;
    onmessage: (message: any) => void;
  }

  const asap: Asap;
  export default asap;
}

declare module "fitbit-asap/companion" {
  interface Asap {
    send(message: any, options?: Options): void;
    cancel(id?: number): void;
    onmessage: (message: any) => void;
  }

  const asap: Asap;
  export default asap;
}
