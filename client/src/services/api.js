let csrfToken;
export async function api(path, { method = "GET", body, csrf = false } = {}) {
  if (csrf && !csrfToken) csrfToken = (await api("/auth/csrf")).csrfToken;
  let response;
  try {
    response = await fetch("/api" + path, {
      method,
      credentials: "same-origin",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(csrf ? { "X-CSRF-Token": csrfToken } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error(
      "No hay conexión. Tu información se conserva; intenta nuevamente.",
    );
  }
  if (response.status === 204) return null;
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("No se pudo leer la respuesta. Intenta nuevamente.");
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403)
      csrfToken = undefined;
    throw Object.assign(
      new Error(payload.error?.message || "No se pudo completar la operación."),
      {
        status: response.status,
        code: payload.error?.code,
        fields: payload.error?.fields,
        data: payload.data,
        requestId: payload.requestId,
      },
    );
  }
  if (payload.data?.csrfToken) csrfToken = payload.data.csrfToken;
  return payload.data;
}
