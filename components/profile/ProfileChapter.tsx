import type { ReactNode } from 'react';

type Props = { id: string; number: string; label: string; title: string; children: ReactNode; tags?: string[]; };

export default function ProfileChapter({ id, number, label, title, children, tags }: Props) {
  return <section id={id} className="story-section" aria-labelledby={`${id}-title`}>
    <div className="chapter-content glass-panel">
      <div className="panel-connector" aria-hidden="true"><span /></div>
      <div className="panel-topline"><span>{label}</span><span>{number} / 06</span></div>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className="chapter-body">{children}</div>
      {tags && <ul className="expertise-tags" aria-label="Lĩnh vực">{tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
      <div className="panel-corner corner-top" aria-hidden="true" /><div className="panel-corner corner-bottom" aria-hidden="true" />
    </div>
  </section>;
}
