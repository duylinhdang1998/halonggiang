export const CHAPTER_STARTS: number[];
export function timelineState(value: number): {progress:number;active:number;reveal:number;intro:number};
export function cardMotion(value: number,pair:number,side:'left'|'right'): {opacity:number;line:number;offset:number;mobile:boolean;mobileOpacity:number;content:number;fold:number;phase:string};
export function clampZoom(value:number):number;
export function chapterProgress(index:number):number;
