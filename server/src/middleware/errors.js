export class AppError extends Error {
  constructor(status, code, message, fields, data) {
    super(message);
    Object.assign(this, { status, code, fields, data });
  }
}
export function errors(err, req, res, _next) {
  let status = err.status || 500;
  let code = err.code || "INTERNAL_ERROR";
  let message = err.message;
  if (err.type === "entity.parse.failed") {
    status = 400;
    code = "INVALID_JSON";
    message = "El contenido no es válido.";
  } else if (err.type === "entity.too.large") {
    status = 413;
    code = "BODY_TOO_LARGE";
    message = "La solicitud es demasiado grande.";
  } else if (
    String(err.code || "").startsWith("SQLITE") ||
    /database connection is not open/i.test(message)
  ) {
    status = 503;
    code = "STORAGE_UNAVAILABLE";
    message = "No se pudo acceder a los datos. Intenta nuevamente.";
  } else if (status >= 500) {
    message = "No se pudo completar la operación. Intenta nuevamente.";
    code = "INTERNAL_ERROR";
  }
  res.status(status).json({
    error: { code, message, ...(err.fields ? { fields: err.fields } : {}) },
    ...(err.data ? { data: err.data } : {}),
    requestId: req.id,
  });
}
