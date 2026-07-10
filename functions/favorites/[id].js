import { authOk, jsonResponse, errorResponse, corsHeaders } from '../_utils.js';

export async function onRequestDelete(context) {
  const { request, env, params } = context;

  if (!authOk(request, env)) {
    return errorResponse('unauthorized', 401);
  }

  const id = params.id;
  
  if (env.SPOOFER_DATA) {
    let favs = await env.SPOOFER_DATA.get('favorites', { type: 'json' }) || [];
    favs = favs.filter(f => f.id !== id);
    await env.SPOOFER_DATA.put('favorites', JSON.stringify(favs));
  }

  return jsonResponse({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}
