import { randomUUID } from "node:crypto";
export function requestLog(enabled) {
  return (req, res, next) => {
    req.id = randomUUID();
    const start = Date.now();
    res.setHeader("X-Request-Id", req.id);
    res.on("finish", () => {
      if (enabled)
        console.log(
          JSON.stringify({
            requestId: req.id,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            durationMs: Date.now() - start,
          }),
        );
    });
    next();
  };
}
