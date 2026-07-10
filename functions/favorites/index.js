import { authOk, jsonResponse, errorResponse, corsHeaders } from '../_utils.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!authOk(request, env)) {
    return errorResponse('unauthorized', 401);
  }

  let favs = [];
  if (env.SPOOFER_DATA) {
    favs = await env.SPOOFER_DATA.get('favorites', { type: 'json' }) || [];
  }

  return jsonResponse(favs);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!authOk(request, env)) {
    return errorResponse('unauthorized', 401);
  }

  try {
    const data = await request.json();
    let favs = [];
    if (env.SPOOFER_DATA) {
      favs = await env.SPOOFER_DATA.get('favorites', { type: 'json' }) || [];
    }

    const fav = {
      id:                 Date.now().toString(36),
      name:               (data.name || '未命名').slice(0, 30),
      latitude:           data.latitude,
      longitude:          data.longitude,
      altitude:           data.altitude           ?? null,
      horizontalAccuracy: data.horizontalAccuracy ?? null,
      verticalAccuracy:   data.verticalAccuracy   ?? null,
      createdAt:          new Date().toISOString()
    };
    
    favs.unshift(fav);
    if (favs.length > 100) favs.pop();

    if (env.SPOOFER_DATA) {
      await env.SPOOFER_DATA.put('favorites', JSON.stringify(favs));
    }

    return jsonResponse(fav);
  } catch (err) {
    return errorResponse('bad json');
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}
