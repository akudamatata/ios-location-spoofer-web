export const DEFAULT_LOC = {
  latitude:           39.90872,
  longitude:          116.39748,
  altitude:           44,
  horizontalAccuracy: 39,
  verticalAccuracy:   1000
};

export function authOk(request, env) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  return !env.TOKEN || token === env.TOKEN;
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    }
  });
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
