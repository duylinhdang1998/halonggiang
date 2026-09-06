'use client';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { chapters } from '@/lib/profile';
import { useProfileScroll } from '@/hooks/use-profile-scroll';
import CharacterStage from './CharacterStage';

export default function ProfileExperience() {
  const { progress, active } = useProfileScroll();
  return (
    <>
      <header className="site-header">
        <a href="#gioi-thieu" className="wordmark" aria-label="Hà Long Giang, về giới thiệu"><span className="monogram">G.</span><span>HÀ LONG GIANG</span></a>
        <nav className="top-nav" aria-label="Điều hướng chính">
          <a href="#quan-tri">Chuyên môn</a><a href="#hanh-trinh">Hành trình</a><a href="#ket-noi" className="contact-link">Kết nối <ArrowUpRight size={16} /></a>
        </nav>
      </header>
      <CharacterStage progress={progress} />
      <nav className="chapter-rail" aria-label="Các phần hồ sơ">
        {chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-label={chapter.label} aria-current={active === index ? 'step' : undefined} className={active === index ? 'active' : ''}><span className="rail-tooltip">{chapter.label}</span><span className="rail-mark" /></a>)}
      </nav>
      <div className="journey-footer">
        <div className="current-chapter"><span className="chapter-index">0{active + 1}<span> / 06</span></span><span>{chapters[active].label}</span></div>
        <a href={active === 5 ? '#gioi-thieu' : `#${chapters[active + 1].id}`} className="scroll-hint">{active === 5 ? 'Về đầu trang' : 'Cuộn để khám phá'}<ArrowDown size={16} className={active === 5 ? 'turn-up' : ''} /></a>
        <span className="reveal-meter" aria-hidden="true">{Math.round(progress * 100).toString().padStart(2, '0')}<span>%</span></span>
      </div>
      <div className="page-progress" aria-hidden="true"><div style={{ transform: `scaleX(${progress})` }} /></div>
    </>
  );
}
