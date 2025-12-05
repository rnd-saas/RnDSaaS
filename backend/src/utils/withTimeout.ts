export function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
    let timer: NodeJS.Timeout;
    return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        new Promise<T>((_, reject) => {
            timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
        })
    ]);
}

export default withTimeout;
