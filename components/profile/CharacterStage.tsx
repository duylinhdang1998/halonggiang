'use client';
import type { CSSProperties } from 'react';
import Image from 'next/image';

export default function CharacterStage({ progress }: { progress: number }) {
  const style = { '--reveal': `${progress * 100}%` } as CSSProperties;
  return (
    <figure className="character-stage" style={style}>
      <figcaption className="sr-only">Nhân vật hoạt hình của thầy Hà Long Giang, chuyển từ khung lưới xanh sang màu hoàn chỉnh theo chiều cuộn.</figcaption>
      <div className="orbital orbital-one" aria-hidden="true" />
      <div className="orbital orbital-two" aria-hidden="true" />
      <div className="character-frame" aria-hidden="true">
        <div className="character-layer character-wire"><Image unoptimized src="/giang-character.png" alt="" width={1419} height={1109} fetchPriority="high" draggable="false" /></div>
        <div className="character-layer character-color"><Image unoptimized src="/giang-character.png" alt="" width={1419} height={1109} draggable="false" /></div>
        <div className="scan-line" data-visible={progress > 0.015 && progress < 0.985} />
      </div>
      <div className="ground-orbit" aria-hidden="true" />
      <div className="character-caption"><span>HÀ LONG GIANG</span><span>Hồ sơ chuyên gia</span></div>
    </figure>
  );
}
