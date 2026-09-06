'use client';
import {useState} from 'react';
import type {CSSProperties} from 'react';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {chapters} from '@/lib/profile';
import {cardPairs} from '@/lib/profile-cards';
import {useProfileScroll} from '@/hooks/use-profile-scroll';
import CharacterStage from './CharacterStage';
import HologramCard from './HologramCard';
import LightConnectors from './LightConnectors';
import SceneControls from './SceneControls';

export default function ProfileExperience() {
 const {root,progress,active,reveal,intro,goTo}=useProfileScroll();
 const [zoom,setZoom]=useState(1);
 const last=chapters.length-1;
 const introStyle={'--intro-opacity':intro,'--intro-shift':`${(1-intro)*-28}px`} as CSSProperties;
 return <main ref={root} className="scroll-experience" id="noi-dung">
   <div className="scroll-stage" data-progress={progress.toFixed(3)}>
     <header className="site-header">
       <Button variant="ghost" className="wordmark" onClick={()=>goTo(0)} aria-label="Hà Long Giang, về giới thiệu"><span className="monogram">G.</span><span>HÀ LONG GIANG</span></Button>
       <nav className="top-nav" aria-label="Điều hướng chính"><Button variant="ghost" onClick={()=>goTo(1)}>Chuyên môn</Button><Button variant="ghost" onClick={()=>goTo(4)}>Hành trình</Button><Button variant="outline" className="contact-link" onClick={()=>goTo(5)}>Kết nối<ArrowUpRight size={16}/></Button></nav>
     </header>
     <div className="scene-grid" aria-hidden="true"/>
     <CharacterStage progress={reveal} zoom={zoom}/>
     <div className="intro-copy" style={introStyle} aria-hidden={intro<.05} inert={intro<.05}>
       <p className="intro-eyebrow">CHUYÊN GIA & GIẢNG VIÊN</p><h1>Hà Long<br/><span>Giang.</span></h1>
       <p className="intro-lead">Nền tảng quản trị vững chắc.<br/>Tầm nhìn phát triển bền vững.</p>
       <Button className="primary-link" variant="outline" onClick={()=>goTo(1)}>Bắt đầu khám phá<ArrowDown size={18}/></Button>
     </div>
     <div className="intro-aside" style={introStyle} aria-hidden="true"><span>QUẢN TRỊ</span><span>TÀI CHÍNH</span><span>PHÁT TRIỂN BỀN VỮNG</span><i/></div>
     {cardPairs.map((pair,index)=><div key={chapters[index+1].id} className="chapter-scene"><LightConnectors progress={progress} pair={index} zoom={zoom}/><HologramCard card={pair[0]} pair={index} side="left" progress={progress}/><HologramCard card={pair[1]} pair={index} side="right" progress={progress}/></div>)}
     <SceneControls zoom={zoom} onZoom={setZoom}/>
     <nav className="chapter-rail" aria-label="Các phần hồ sơ">{chapters.map((chapter,index)=><Button key={chapter.id} variant="ghost" className={`rail-button ${active===index?'active':''}`} onClick={()=>goTo(index)} aria-label={chapter.label} aria-current={active===index?'step':undefined}><span className="rail-tooltip">{chapter.label}</span><span className="rail-mark"/></Button>)}</nav>
     <footer className="journey-footer"><div className="current-chapter"><span className="chapter-index">0{active+1}<span> / 06</span></span><span>{chapters[active].label}</span></div><Button variant="ghost" className="scroll-hint" onClick={()=>goTo(active===last?0:active+1)}>{active===last?'Về đầu trang':'Cuộn để tiếp tục'}<ArrowDown size={16} className={active===last?'turn-up':''}/></Button><span className="reveal-meter" aria-hidden="true">{Math.round(reveal*100).toString().padStart(2,'0')}<span>%</span></span></footer>
     <div className="page-progress" aria-hidden="true"><div style={{transform:`scaleX(${progress})`}}/></div>
   </div>
 </main>;
}
