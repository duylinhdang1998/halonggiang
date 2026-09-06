import {StrictMode} from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import Home from '@/app/page';
import BiographyPage from '@/components/biography/BiographyPage';
import '@/app/globals.css';
import './vercel.css';

const root=document.getElementById('root');
const page=<StrictMode>{window.location.pathname.replace(/\/$/,'')==='/ho-so'?<BiographyPage/>:<Home/>}</StrictMode>;
if(root){if(root.hasChildNodes())hydrateRoot(root,page);else createRoot(root).render(page);}
