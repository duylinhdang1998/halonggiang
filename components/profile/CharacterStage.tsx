'use client';
import {useEffect,useRef,useState} from 'react';
import type {mountCharacter,Anchors} from '@/lib/character/scene';
type Props={progress:number;zoom:number;rotation:number;resetKey:number;onRotate:(delta:number)=>void;onAnchors:(anchors:Anchors)=>void};
export default function CharacterStage({progress,zoom,rotation,resetKey,onRotate,onAnchors}:Props) {
 const host=useRef<HTMLButtonElement>(null);const runtime=useRef<ReturnType<typeof mountCharacter>|null>(null);
 const latest=useRef({progress,zoom,rotation});const [status,setStatus]=useState('loading');
 useEffect(()=>{latest.current={progress,zoom,rotation};runtime.current?.update(progress,zoom,rotation);},[progress,zoom,rotation]);
 useEffect(()=>{runtime.current?.reset();},[resetKey]);
 useEffect(()=>{let cancelled=false;import('@/lib/character/scene').then(({mountCharacter:mount})=>{if(cancelled||!host.current)return;try{runtime.current=mount(host.current,onAnchors);const state=latest.current;runtime.current.update(state.progress,state.zoom,state.rotation);setStatus('ready');}catch{setStatus('error');}}).catch(()=>{if(!cancelled)setStatus('error');});return()=>{cancelled=true;runtime.current?.dispose();runtime.current=null;};},[onAnchors]);
 return <figure className="character-stage">
   <figcaption className="sr-only">Nhân vật 3D hoạt hình của thầy Hà Long Giang. Kéo ngang hoặc dùng phím mũi tên để xoay. Cuộn để khám phá hồ sơ.</figcaption>
   <div className="orbital orbital-one" aria-hidden="true"/><div className="orbital orbital-two" aria-hidden="true"/>
   <button type="button" ref={host} className="model-viewport" aria-label="Nhân vật 3D, dùng phím trái phải để xoay" onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();onRotate(event.key==='ArrowLeft'?-.4:.4);}}}/>
   {status!=='ready'&&<output className="model-status">{status==='loading'?'Đang dựng nhân vật…':'Không mở được 3D trên trình duyệt này. Hãy thử tải lại trang.'}</output>}
   <div className="ground-orbit" aria-hidden="true"/><span className="model-hint">KÉO NGANG ĐỂ XOAY · CUỘN ĐỂ KHÁM PHÁ</span>
 </figure>;
}
