import {getStore} from '@netlify/blobs';
import {createRequire} from 'node:module';
import {randomUUID} from 'node:crypto';
const require=createRequire(import.meta.url), L=require('../../api/_lib.js');
export const PART=2*1024*1024, MAX=6*1024**3;
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
const validId=id=>/^[0-9a-f-]{36}$/.test(id||'');
const mediaType=t=>/^(image\/(png|jpeg|gif|webp|avif)|video\/(mp4|webm|quicktime|x-matroska)|audio\/(webm|mp4|ogg|mpeg|wav|x-wav))(;.*)?$/.test(t);
export async function handleMedia(request, suppliedStore){
 const req={headers:Object.fromEntries(request.headers)};
 const role=L.roleOf(req);
 if(!role)return json({error:'auth'},401);
 const url=new URL(request.url), id=url.searchParams.get('id');
 if(!['GET','HEAD'].includes(request.method)){
  if(role!=='learner')return json({error:'forbidden'},403);
  if(request.headers.get('origin') && request.headers.get('origin')!==url.origin)return json({error:'origin'},403);
 }
 const store=suppliedStore||getStore({name:'academy-media',consistency:'strong'});
 try{
  if(['GET','HEAD'].includes(request.method)){
   if(!id)return json({ok:true,configured:true,backend:'netlify-blobs',maxBytes:MAX});
   if(!validId(id))return json({error:'id'},400);
   const m=await store.get('files/'+id,{type:'json'});
   if(!m)return json({error:'not_found'},404);
   // Staff may read audio/image feedback attachments; learner-only movies stay private.
   if(role!=='learner' && m.type.startsWith('video/'))return json({error:'forbidden'},403);
   let start=0,end=m.size-1,status=200;
   const range=request.headers.get('range');
   if(range){
    const match=/^bytes=(\d*)-(\d*)$/.exec(range);
    if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+m.size}});
    start=match[1]?Number(match[1]):Math.max(0,m.size-Number(match[2]));
    end=match[1]&&match[2]?Math.min(Number(match[2]),m.size-1):m.size-1;
    if(start>end||start>=m.size)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+m.size}});
    end=Math.min(end,start+PART-1);status=206;
   }else if(m.size>8*1024*1024 && request.method!=='HEAD')return json({error:'range_required'},416);
   const headers={'Content-Type':m.type,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':'inline; filename="'+m.name+'"'};
   if(status===206)headers['Content-Range']=`bytes ${start}-${end}/${m.size}`;
   if(request.method==='HEAD')return new Response(null,{status,headers});
   const chunks=[];
   for(let i=Math.floor(start/PART);i<=Math.floor(end/PART);i++){
    const chunk=await store.get(`parts/${id}/${i}`,{type:'arrayBuffer'});
    if(!chunk)throw Error('missing_chunk');
    chunks.push(new Uint8Array(chunk).slice(Math.max(0,start-i*PART),Math.min(chunk.byteLength,end-i*PART+1)));
   }
   return new Response(new Blob(chunks),{status,headers});
  }
  if(request.method==='PUT'){
   if(!validId(id))return json({error:'id'},400);
   const m=await store.get('uploads/'+id,{type:'json'}), n=Number(url.searchParams.get('part'));
   if(!m||m.expires<Date.now())return json({error:'expired'},410);
   if(!Number.isInteger(n)||n<0||n>=m.parts)return json({error:'part'},400);
   const expected=Math.min(PART,m.size-n*PART);
   if(Number(request.headers.get('content-length'))>expected)return json({error:'size'},413);
   const buf=await request.arrayBuffer();
   if(buf.byteLength!==expected)return json({error:'size'},400);
   await store.set(`parts/${id}/${n}`,buf,{metadata:{size:buf.byteLength}});
   return json({ok:true,part:n});
  }
  if(request.method!=='POST')return json({error:'method'},405);
  const raw=await request.text();if(raw.length>8192)return json({error:'size'},413);
  let b;try{b=JSON.parse(raw);}catch{return json({error:'body'},400);}
  if(b.op==='token'){
   if(!Number.isSafeInteger(b.size)||b.size<=0||b.size>MAX)return json({error:'size',max:MAX},413);
   if(!mediaType(String(b.type||'')))return json({error:'type'},415);
   const id=randomUUID(),m={name:String(b.pathname||'file').replace(/[^\w.\-]/g,'_').slice(0,120),size:b.size,type:b.type,parts:Math.ceil(b.size/PART),expires:Date.now()+86400000};
   await store.setJSON('uploads/'+id,m);
   return json({backend:'netlify',id,partSize:PART,parts:m.parts});
  }
  if(b.op==='complete'){
   if(!validId(b.id))return json({error:'id'},400);
   const m=await store.get('uploads/'+b.id,{type:'json'});
   if(!m||m.expires<Date.now())return json({error:'expired'},410);
   for(let i=0;i<m.parts;i++){
    const part=await store.getMetadata(`parts/${b.id}/${i}`);
    if(!part||part.metadata.size!==Math.min(PART,m.size-i*PART))return json({error:'incomplete',part:i},409);
   }
   await store.setJSON('files/'+b.id,m);
   return json({url:url.origin+'/api/media?id='+b.id,pathname:m.name});
  }
  if(b.op==='delete'){
   let target;try{target=new URL(b.url,url.origin);}catch{return json({error:'url'},400);}
   const fid=target.searchParams.get('id');
   if(target.origin!==url.origin||target.pathname!=='/api/media'||!validId(fid))return json({error:'url'},400);
   const m=await store.get('files/'+fid,{type:'json'});
   if(m){await store.delete('files/'+fid);for(let i=0;i<m.parts;i++)await store.delete(`parts/${fid}/${i}`);await store.delete('uploads/'+fid);}
   return json({ok:true});
  }
  return json({error:'op'},400);
 }catch(e){console.error('Media storage failure',e.name);return json({error:'storage_failed'},503);}
}
