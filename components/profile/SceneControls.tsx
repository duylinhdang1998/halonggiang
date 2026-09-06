'use client';
import {Minus,Plus,RotateCcw,ChevronLeft,ChevronRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {clampZoom} from '@/lib/scroll-state.mjs';
const ZOOM_STEP=.1;
type Props={zoom:number;onZoom:(zoom:number)=>void;onRotate:(delta:number)=>void;onReset:()=>void};
export default function SceneControls({zoom,onZoom,onRotate,onReset}:Props) {
 return <div className="scene-controls" aria-label="Điều khiển nhân vật 3D">
   <Button variant="ghost" size="icon" className="scene-control" aria-label="Xoay nhân vật sang trái" onClick={()=>onRotate(-.5)}><ChevronLeft/></Button>
   <Button variant="ghost" size="icon" className="scene-control" aria-label="Xoay nhân vật sang phải" onClick={()=>onRotate(.5)}><ChevronRight/></Button>
   <span className="control-separator"/>
   <Button variant="ghost" size="icon" className="scene-control" aria-label="Thu nhỏ nhân vật" disabled={zoom<=.8} onClick={()=>onZoom(clampZoom(zoom-ZOOM_STEP))}><Minus/></Button>
   <span className="zoom-value" aria-live="polite">{Math.round(zoom*100)}%</span>
   <Button variant="ghost" size="icon" className="scene-control" aria-label="Phóng to nhân vật" disabled={zoom>=1.35} onClick={()=>onZoom(clampZoom(zoom+ZOOM_STEP))}><Plus/></Button>
   <span className="control-separator"/>
   <Button variant="ghost" size="icon" className="scene-control" aria-label="Đặt lại góc nhìn nhân vật" onClick={onReset}><RotateCcw/></Button>
 </div>;
}
