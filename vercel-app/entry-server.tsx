import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import Home from '@/app/page';
import BiographyPage from '@/components/biography/BiographyPage';
import {HOME_TITLE,HOME_DESCRIPTION,PROFILE_TITLE,PROFILE_DESCRIPTION} from '@/lib/seo';
import {profileSchema} from '@/lib/profile-schema';
export function renderPage(path:string){
 const profile=path==='/ho-so/';
 const title=profile?PROFILE_TITLE:HOME_TITLE;
 const description=profile?PROFILE_DESCRIPTION:HOME_DESCRIPTION;
 return {html:renderToString(<StrictMode>{profile?<BiographyPage/>:<Home/>}</StrictMode>),title,description,schema:profileSchema(path,title,description)};
}
