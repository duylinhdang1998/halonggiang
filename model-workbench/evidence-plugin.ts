import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import type {Plugin} from 'vite';

/** Local development only: the visible lab buttons save the real canvas/geometry for review. */
export function modelEvidencePlugin():Plugin{
 return {name:'local-model-evidence',apply:'serve',configureServer(server){
  server.middlewares.use('/__model-evidence',async(req,res)=>{
   if(req.method!=='POST'||!req.headers.origin||req.headers.origin!==`http://${req.headers.host}`){res.statusCode=403;res.end();return;}
   const name=String(req.headers['x-evidence-name']??'');
   if(!/^giang-blockout-(?:-?\d+-(?:clay|color)\.png|meshes\.json)$/.test(name)){res.statusCode=400;res.end();return;}
   try{
    const chunks:Buffer[]=[];let size=0;
    for await(const chunk of req){size+=chunk.length;if(size>20_000_000)throw new Error('Evidence too large');chunks.push(Buffer.from(chunk));}
    const dir=resolve(import.meta.dirname,'../../work/giang-img2threejs/renders');await mkdir(dir,{recursive:true});
    await writeFile(resolve(dir,name),Buffer.concat(chunks));res.end('saved');
   }catch{res.statusCode=500;res.end('save failed');}
  });
 }};
}
