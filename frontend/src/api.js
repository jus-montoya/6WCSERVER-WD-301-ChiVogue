const apiOrigin = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");

export function apiUrl(path) {
  return `${apiOrigin}/api/${String(path).replace(/^\/+/, "")}`;
}

export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot reach the restaurant API. Confirm the API is deployed and VITE_API_BASE_URL is correct.",
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      "The restaurant API returned a web page instead of JSON. Deploy the Express API with the frontend, route /api/* to it, and configure MONGO_URI. For Vercel, use the repository root as the project root.",
    );
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `API request failed (${response.status}).`);
  }
  return data;
}
