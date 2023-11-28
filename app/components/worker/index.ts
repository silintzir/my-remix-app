const worker = (
  typeof window !== "undefined"
    ? new Worker("/sw.js")
    : { postmessage: () => {} }
) as Worker;

export { worker };
