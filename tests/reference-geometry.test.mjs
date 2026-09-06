import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const testDirectory=path.dirname(fileURLToPath(import.meta.url));
import {spawnSync} from 'node:child_process';
void test('approved image projection is aligned and the relief has no open mesh edges',async()=>{
 const output=fs.mkdtempSync(path.join(testDirectory,'.geometry-check-'));
 try {
  const compile=spawnSync(process.execPath,[fileURLToPath(import.meta.resolve('typescript/bin/tsc')),'lib/character/reference-geometry.ts','lib/character/reference-shape.ts','--outDir',output,'--module','commonjs','--target','ES2022','--skipLibCheck'],{cwd:path.join(testDirectory,'..'),encoding:'utf8'});
  assert.equal(compile.status,0,compile.stdout+compile.stderr);fs.writeFileSync(path.join(output,'package.json'),'{"type":"commonjs"}');
  const {createReferenceGeometry,createReferenceRim}=await import(pathToFileURL(path.join(output,'reference-geometry.js')).href);
  const {REFERENCE}=await import(pathToFileURL(path.join(output,'reference-shape.js')).href);
  const front=createReferenceGeometry(),back=createReferenceGeometry(true),rim=createReferenceRim();const edges=new Map();
  const positions=front.attributes.position,uv=front.attributes.uv;
  for(let i=0;i<positions.count;i++){assert.ok(Math.abs(positions.getX(i)/REFERENCE.scale+REFERENCE.centerX-uv.getX(i)*REFERENCE.width)<.001);assert.ok(Math.abs(REFERENCE.bottom-positions.getY(i)/REFERENCE.scale-(1-uv.getY(i))*REFERENCE.height)<.001);}
  for(const geometry of [front,back,rim]){const p=geometry.attributes.position;const key=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(n=>n.toFixed(4)).join(',');for(let i=0;i<p.count;i+=3)for(const [a,b] of [[i,i+1],[i+1,i+2],[i+2,i]]){const k=[key(a),key(b)].sort().join('|');edges.set(k,(edges.get(k)||0)+1);}}
  assert.equal([...edges.values()].filter(count=>count!==2).length,0,'Every surface edge must have exactly two incident faces');
  assert.ok(positions.count/3<40000,'Bound the geometry cost');
  for(const geometry of [front,back,rim])geometry.dispose();
 } finally {fs.rmSync(output,{recursive:true,force:true});}
});
