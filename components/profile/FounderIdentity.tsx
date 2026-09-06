import Image from 'next/image';
export default function FounderIdentity() {
 return <div className="founder-identity"><span className="founder-label">Founder</span><div className="founder-brands"><span className="brand-tile bisc-logo"><Image unoptimized src="/brands/bisc.png" alt="BISC" width={751} height={751}/></span><span className="brand-divider" aria-hidden="true">&</span><span className="brand-tile learning-logo"><Image unoptimized src="/brands/9learning.png" alt="9learning" width={330} height={80}/></span></div></div>;
}
