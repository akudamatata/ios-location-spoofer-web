export async function onRequestGet(context) {
  const { request, env } = context;
  
  // Fetch the static asset from Cloudflare Pages
  const response = await env.ASSETS.fetch(request);
  
  if (!response.ok) {
    return new Response('Not found', { status: 404 });
  }

  let content = await response.text();
  
  const url = new URL(request.url);
  const host = request.headers.get('host') || url.host;
  const protocol = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  const tVal = url.searchParams.get('token') || '';

  content = content.replace(/你的域名/g, host);
  content = content.replace(/你的Token/g, tVal);
  
  if (protocol === 'https') {
    content = content.replace(/http:\/\/localhost:8080/g, 'https://' + host);
  }

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
