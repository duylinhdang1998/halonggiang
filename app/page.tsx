/* oxlint-disable nextjs/no-html-link-for-pages -- Full document navigation supports both static Vercel routes and Vinext. */
import ProfileExperience from '@/components/profile/ProfileExperience';
import {cardPairs} from '@/lib/profile-cards';

export default function Home() {
 return <><ProfileExperience/><noscript><div className="no-script-profile"><h2>Hồ sơ Hà Long Giang</h2><a href="/ho-so/">Đọc hồ sơ và chứng chỉ đầy đủ</a>{cardPairs.flat().map(card=><section key={card.label}><h2>{card.title}</h2><p>{card.body}</p>{card.link&&<a href={card.link.url}>{card.link.label}</a>}</section>)}</div></noscript></>;
}
