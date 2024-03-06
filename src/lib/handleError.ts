import { NextResponse } from 'next/server';
export function handleError<T, K extends any[]>(asyncFunc: (...args: K) => Promise<T>, onError?: () => string): (...args: K) => Promise<T> {
  return async (...args: K) => {
    try {
      const result = await asyncFunc(...args);
      return result;
    } catch (err: unknown) {
      console.log('handleError', err)
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


export function handleApiError<T, K extends any[]>(asyncFunc: (...args: K) => Promise<T>, onError?: () => { message: string, status: number}): (...args: K) => Promise<T | NextResponse<{   message: string; }> | undefined> {
  return async (...args: K) => {
    try {
      return await asyncFunc(...args);
    } catch (err: unknown) {
      console.log('apiError', err)
      const params = onError && onError()
      if (params) {
        return NextResponse.json(params)
      }

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      )
    }
  }
}



