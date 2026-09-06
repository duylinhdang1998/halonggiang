export const CHAPTER_STARTS = [0, .13, .31, .49, .67, .85];
const TRANSITION = .028;
const STAGGER = .032;
const MIN_ZOOM = .8;
const MAX_ZOOM = 1.35;
const clamp = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const smooth = (value) => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function timelineState(value) {
  const progress = clamp(value);
  const active = CHAPTER_STARTS.reduce((current, start, index) => progress >= start ? index : current, 0);
  return {progress,active,reveal:clamp((progress - .035) / .915),intro:1-smooth((progress-.045)/.065)};
}

export function cardMotion(value, pair, side) {
  const progress = clamp(value);
  const start = CHAPTER_STARTS[pair + 1];
  if (start === undefined) return {opacity:0,line:0,offset:48,mobile:false,content:0,fold:1,phase:'hidden',mobileOpacity:0};
  const end = CHAPTER_STARTS[pair + 2] ?? 2;
  const entry = start + (side === 'right' ? STAGGER : 0);
  const exit = 1-smooth((progress-(end-.05))/.026);
  const opacity = smooth((progress-entry-.012)/TRANSITION)*exit;
  const line = smooth((progress-entry)/TRANSITION)*(1-smooth((progress-(end-.026))/.024));
  const content = smooth((progress-entry-.023)/.029)*exit;
  const mobileSwitch = start + .098;
  const mobile = side === 'left' ? progress < mobileSwitch : progress >= mobileSwitch;
  const mobileOpacity=side==='left'?1-smooth((progress-(mobileSwitch-.015))/.015):smooth((progress-mobileSwitch)/.018);
  return {opacity,line,mobileOpacity,offset:(1-opacity)*48,mobile,content,fold:1-opacity,phase:exit<1?'exit':opacity<1?'enter':'hold'};
}

export function clampZoom(value) {
  return Number.isFinite(value) ? Math.min(MAX_ZOOM,Math.max(MIN_ZOOM,value)) : 1;
}

export function chapterProgress(index) {
  const selected = Math.min(CHAPTER_STARTS.length-1,Math.max(0,Math.round(index)));
  return selected === 0 ? 0 : CHAPTER_STARTS[selected]+.075;
}
