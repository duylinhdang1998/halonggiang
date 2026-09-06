import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const site = 'https://halonggiang.vercel.app';
for (const path of ['/', '/ho-so/']) {
  void test(`${path} delivers an indexable, complete profile without JavaScript`, async () => {
    const html = await readFile(`dist/vercel${path}index.html`, 'utf8');
    assert.match(html, /<html lang="vi"/);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.match(html, /<title>[^<]*Hà Long Giang[^<]*<\/title>/);
    assert.ok(html.includes(`<link rel="canonical" href="${site}${path}"`));
    assert.match(html, /name="description" content="[^"]{80,200}"/);
    assert.match(html, /name="robots" content="index,follow/);
    assert.doesNotMatch(html, /name="keywords"|<div id="root"><\/div>/);
    assert.match(html, /property="og:image" content="https:\/\//);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    const body = html.split('<body>')[1];
    for (const phrase of ['Hà Long', 'BISC', '9Learning', 'ACCA', 'Singapore']) assert.ok(body.toLowerCase().includes(phrase.toLowerCase()), phrase);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
    const person = graph.find(item => item['@type'] === 'Person');
    const profile = graph.find(item => item['@type'] === 'ProfilePage');
    assert.equal(profile.mainEntity['@id'], person['@id']);
    assert.equal(profile.url, site + path);
    assert.ok(person.alternateName.includes('Giang Ha'));
    assert.ok(person.hasCredential.some(item => item.name.includes('CA (Singapore)') && item.url.startsWith('https://www.facebook.com/halonggiang/posts/')));
    assert.ok(body.includes('https://www.facebook.com/halonggiang/posts/'));
    assert.ok(body.includes('href="/ho-so/"') || body.includes('href="/"'));
  });
}

void test('discovery files list both canonical pages', async () => {
  const sitemap = await readFile('dist/vercel/sitemap.xml', 'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(item => item[1]), [site + '/', site + '/ho-so/']);
  const robots = await readFile('dist/vercel/robots.txt', 'utf8');
  assert.match(robots, /User-agent: \*\nAllow: \//);
  assert.ok(robots.includes(`Sitemap: ${site}/sitemap.xml`));
});
