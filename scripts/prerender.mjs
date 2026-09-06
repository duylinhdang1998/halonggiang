import {build} from 'vite';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

await build({configFile:'vite.vercel.config.ts',publicDir:false,build:{ssr:resolve('vercel-app/entry-server.tsx'),outDir:resolve('dist/seo-server'),emptyOutDir:true},ssr:{noExternal:['gsap','@base-ui/react','@unpic/react','vinext']}});
const {renderPage}=await import(pathToFileURL(resolve('dist/seo-server/entry-server.js')).href);
const template=(await readFile('dist/vercel/index.html','utf8')).replace(/\s*<noscript>.*?<\/noscript>/s,'');
const site='https://halonggiang.vercel.app';
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const routes=['/','/ho-so/'];
for(const path of routes){
 const {html,title,description,schema}=renderPage(path);
 const canonical=site+path;
 const metadata=`<meta name="description" content="${escape(description)}"/>
<link rel="canonical" href="${canonical}"/>
<meta name="robots" content="index,follow,max-image-preview:large"/>
<meta property="og:type" content="profile"/>
<meta property="og:locale" content="vi_VN"/>
<meta property="og:site_name" content="Hà Long Giang"/>
<meta property="og:title" content="${escape(title)}"/>
<meta property="og:description" content="${escape(description)}"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:image" content="${site}/giang-character.png"/>
<meta property="og:image:width" content="1419"/><meta property="og:image:height" content="1109"/>
<meta property="og:image:alt" content="Minh họa Hà Long Giang, Founder BISC và 9Learning"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escape(title)}"/>
<meta name="twitter:description" content="${escape(description)}"/>
<meta name="twitter:image" content="${site}/giang-character.png"/>
<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
 const output=template.replace(/<title>.*?<\/title>/s,`<title>${escape(title)}</title>`).replace(/<meta name="description"[^>]*\/>/,metadata).replace('<div id="root"></div>',`<div id="root">${html}</div>`);
 const dir=resolve('dist/vercel',path.slice(1));await mkdir(dir,{recursive:true});await writeFile(resolve(dir,'index.html'),output);
 console.log(`Prerendered ${path}: ${html.length} characters of HTML`);
}
await writeFile('dist/vercel/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(path=>`<url><loc>${site}${path}</loc></url>`).join('')}</urlset>\n`);
await writeFile('dist/vercel/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
