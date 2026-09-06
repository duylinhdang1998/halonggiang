import ProfileExperience from '@/components/profile/ProfileExperience';
import {cardPairs} from '@/lib/profile-cards';

export default function Home() {
 return <><ProfileExperience/><noscript><div className="no-script-profile"><h1>Hà Long Giang</h1>{cardPairs.flat().map(card=><section key={card.label}><h2>{card.title}</h2><p>{card.body}</p>{card.link&&<a href={card.link.url}>{card.link.label}</a>}</section>)}</div></noscript></>;
}
