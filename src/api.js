export async function apiFetch(path, options = {}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    credentials: "include", // REQUIRED for Spring OAuth2 session cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // Try to parse response if there is one
  const contentType = res.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json");

  if (res.ok) {
    if (res.status === 204) return null;
    if (hasJson) return await res.json();
    const text = await res.text();
    return text ? text : null;
  }

  let message = `Error (${res.status})`;

  if (res.status === 401) message = "401: Not authenticated";
  if (res.status === 403) message = "403: Forbidden";
  if (res.status === 404) message = "404: Not found";
  if (res.status >= 500) message = "500: Server error";

  // If backend returns useful error text/json, include it
  try {
    const body = hasJson ? await res.json() : await res.text();
    if (body) message += ` - ${typeof body === "string" ? body : JSON.stringify(body)}`;
  } catch {
    // ignore parsing errors
  }

  const error = new Error(message);
  error.status = res.status;
  throw error;
}