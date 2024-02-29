export function handleError<T>(asyncFunc: (...args: any[]) => Promise<T>, onError?: () => string): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    try {
      const result = await asyncFunc(...args);
      return result;
    } catch (err: unknown) {

      if (err instanceof Error) {
        const errMsg = onError ? `${onError()}: ${err.message}` : err.message
        throw new Error(errMsg)
      }

      if (typeof err === 'string') {
        const errMsg = onError ? `${onError()}: ${err}` : err
        throw new Error(errMsg);
      }

      if(onError) {
        throw new Error(onError());
      }

      throw err;
    }
  }
}
