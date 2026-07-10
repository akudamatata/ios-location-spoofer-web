import { DEFAULT_LOC, authOk, jsonResponse, errorResponse, corsHeaders } from './_utils.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!authOk(request, env)) {
    return errorResponse('unauthorized', 401);
  }

  try {
    const data = await request.json();
    let current = DEFAULT_LOC;

    if (env.SPOOFER_DATA) {
      current = await env.SPOOFER_DATA.get('loc', { type: 'json' }) || DEFAULT_LOC;
    }

    const updated = { ...current };
    if (typeof data.latitude           === 'number') updated.latitude           = data.latitude;
    if (typeof data.longitude          === 'number') updated.longitude          = data.longitude;
    if (typeof data.altitude           === 'number') updated.altitude           = data.altitude;
    if (typeof data.horizontalAccuracy === 'number') updated.horizontalAccuracy = data.horizontalAccuracy;
    if (typeof data.verticalAccuracy   === 'number') updated.verticalAccuracy   = data.verticalAccuracy;

    if (env.SPOOFER_DATA) {
      await env.SPOOFER_DATA.put('loc', JSON.stringify(updated));
    }

    return jsonResponse(updated);
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
