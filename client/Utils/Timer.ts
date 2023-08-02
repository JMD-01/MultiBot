// Returns a Promise that resolves after "ms" Milliseconds
export const timer = (ms: number) => new Promise(res => setTimeout(res, ms));