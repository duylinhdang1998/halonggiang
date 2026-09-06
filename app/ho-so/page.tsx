import type {Metadata} from 'next';
import BiographyPage from '@/components/biography/BiographyPage';
import {SITE_URL,PROFILE_TITLE,PROFILE_DESCRIPTION,PROFILE_PATH,SOCIAL_IMAGE} from '@/lib/seo';
export const metadata:Metadata={
 title:PROFILE_TITLE,
 description:PROFILE_DESCRIPTION,
 alternates:{canonical:`${SITE_URL}${PROFILE_PATH}`},
 openGraph:{type:'profile',locale:'vi_VN',title:PROFILE_TITLE,description:PROFILE_DESCRIPTION,url:`${SITE_URL}${PROFILE_PATH}`,images:[SOCIAL_IMAGE]},
 twitter:{card:'summary_large_image',title:PROFILE_TITLE,description:PROFILE_DESCRIPTION,images:[SOCIAL_IMAGE]},
};
export default BiographyPage;
