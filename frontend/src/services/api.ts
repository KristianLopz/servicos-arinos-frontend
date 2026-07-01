const API_URL = "http://localhost:3000/api";

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function api(
  endpoint: string,
  options: ApiOptions = {}
) {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...headers,
    },
  });

  return response;
}

export { API_URL };