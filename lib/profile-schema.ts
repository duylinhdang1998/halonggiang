import {SITE_URL,SOCIAL_IMAGE} from './seo';
import {links} from './profile';

export function profileSchema(path:string,title:string,description:string){
 const personId=`${SITE_URL}/#ha-long-giang`;
 return {'@context':'https://schema.org','@graph':[
  {'@type':'WebSite','@id':`${SITE_URL}/#website`,url:`${SITE_URL}/`,name:'Hà Long Giang',inLanguage:'vi-VN'},
  {'@type':'ProfilePage','@id':`${SITE_URL}${path}#webpage`,url:`${SITE_URL}${path}`,name:title,description,inLanguage:'vi-VN',isPartOf:{'@id':`${SITE_URL}/#website`},mainEntity:{'@id':personId}},
  {'@type':'Person','@id':personId,name:'Hà Long Giang',alternateName:['Giang Ha','Ha Long Giang','Giang Long Ha'],url:`${SITE_URL}/ho-so/`,image:SOCIAL_IMAGE,jobTitle:'Founder BISC và 9Learning',description:'Chuyên gia quản trị doanh nghiệp, tài chính, kiểm soát nội bộ, M&A và ESG; hội viên kỳ cựu ACCA (FCCA), ICAEW Chartered Accountant và CA (Singapore).',sameAs:[links.facebook,links.tiktok],subjectOf:[{'@type':'Article',url:links.article},{'@type':'SocialMediaPosting',url:links.singapore}],knowsAbout:['ACCA','ICAEW','Quản trị doanh nghiệp','Kiểm soát nội bộ','Quản lý rủi ro','Tài chính doanh nghiệp','M&A','ESG'],affiliation:[{'@id':`${SITE_URL}/#bisc`},{'@id':`${SITE_URL}/#9learning`}],hasCredential:[{'@type':'EducationalOccupationalCredential',name:'FCCA',credentialCategory:'Professional designation',recognizedBy:{'@type':'Organization',name:'Association of Chartered Certified Accountants'}},{'@type':'EducationalOccupationalCredential',name:'ICAEW Chartered Accountant (ACA)',credentialCategory:'Professional designation',recognizedBy:{'@type':'Organization',name:'ICAEW'}},{'@type':'EducationalOccupationalCredential',name:'Singapore Chartered Accountant – CA (Singapore)',credentialCategory:'Professional designation',recognizedBy:{'@type':'Organization',name:'Institute of Singapore Chartered Accountants (ISCA)'},url:links.singapore}]},
  {'@type':'Organization','@id':`${SITE_URL}/#bisc`,name:'BISC',url:'https://bisc.edu.vn/',founder:{'@id':personId}},
  {'@type':'Organization','@id':`${SITE_URL}/#9learning`,name:'9Learning',url:'https://9learning.edu.vn/',founder:{'@id':personId}},
 ]};
}
