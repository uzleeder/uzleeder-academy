import {handleMedia} from './media-store.mjs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const routes={login:require('../../api/login.js'),logout:require('../../api/logout.js'),password:require('../../api/password.js'),username:require('../../api/username.js'),state:require('../../api/state.js'),health:require('../../api/health.js'),media:require('../../api/media.js'),bbc:require('../../api/bbc.js'),ctrl:require('../../api/ctrl/[fn].js')};
export default async(request,context)=>{
 const url=new URL(request.url), parts=url.pathname.replace(/^\/api\//,'').split('/');
 if(parts[0]==='media' && process.env.ACADEMY_MEDIA==='netlify') return handleMedia(request);
 const handler=routes[parts[0]];
 if(!handler)return Response.json({error:'not_found'},{status:404});
 const query=Object.fromEntries(url.searchParams);if(parts[0]==='ctrl')query.fn=parts[1];
 const headers=Object.fromEntries(request.headers);headers['x-forwarded-for']=context.ip||'unknown';
 const req={method:request.method,url:request.url,headers,query,socket:{remoteAddress:context.ip||''},body:['GET','HEAD'].includes(request.method)?undefined:await request.text()};
 const out=new Headers();let body='',statusCode=200;
 const res={get statusCode(){return statusCode},set statusCode(v){statusCode=v},setHeader(k,v){out.delete(k);for(const item of Array.isArray(v)?v:[v])out.append(k,String(item));},end(v=''){body=v;}};
 try{await handler(req,res);}catch(e){console.error('Academy request failed:',e.message);return Response.json({error:'server_error'},{status:500});}
 return new Response([204,304].includes(statusCode)?null:body,{status:statusCode,headers:out});
};
export const config={path:'/api/*'};
