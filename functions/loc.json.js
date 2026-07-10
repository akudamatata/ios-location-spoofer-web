import { DEFAULT_LOC, authOk, jsonResponse, errorResponse, corsHeaders } from './_utils.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!authOk(request, env)) {
    return errorResponse('unauthorized', 401);
  }

  let loc = DEFAULT_LOC;
  if (env.SPOOFER_DATA) {
    loc = await env.SPOOFER_DATA.get('loc', { type: 'json' }) || DEFAULT_LOC;
  }

  return jsonResponse(loc);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}
