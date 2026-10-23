import gate from './gate-source.js';
export default async (request, context) => {
 const url=new URL(request.url);
 if(url.pathname.startsWith('/.netlify/functions/')) return new Response('Not found',{status:404});
 const response=await gate(request);
 if(response.headers.get('x-middleware-next')) return context.next();
 return response;
};
