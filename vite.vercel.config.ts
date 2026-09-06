import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

const localPath=(relative:string)=>fileURLToPath(new URL(relative,import.meta.url));
export default defineConfig({
 root:localPath('./vercel-app'),
 publicDir:localPath('./public'),
 plugins:[react()],
 resolve:{alias:{'@':localPath('./'),'next/image':'vinext/shims/image'}},
 define:{'process.env.__VINEXT_IMAGE_UNOPTIMIZED':'"true"','process.env.NEXT_DEPLOYMENT_ID':'""','process.env.__VINEXT_DEPLOYMENT_ID':'""'},
 css:{postcss:{plugins:[tailwindcss()]}},
 build:{outDir:localPath('./dist/vercel'),emptyOutDir:true},
});
