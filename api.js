export async function apiFetch(path, options = {}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    credentials: "include", // REQUIRED for OAuth2 session cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (res.ok) {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  let message = `Error (${res.status})`;

  if (res.status === 401) message = "401: Not authenticated";
  if (res.status === 403) message = "403: Forbidden";
  if (res.status === 404) message = "404: Not found";
  if (res.status >= 500) message = "500: Server error";

  const error = new Error(message);
  error.status = res.status;
  throw error;
}