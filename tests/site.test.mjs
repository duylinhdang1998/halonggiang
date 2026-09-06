import { test } from 'node:test';
import assert from 'node:assert/strict';

void test('profile response contains all six readable chapters and provided destinations', async () => {
  const response=await fetch('http://localhost:3000/');
  assert.equal(response.status,200);
  const html=await response.text();
  assert.match(html,/<html[^>]+lang="vi"/);
  for(const label of ['QUẢN TRỊ DOANH NGHIỆP','KIỂM SOÁT &amp; RỦI RO','ESG trong chiến lược.','ICAEW Chartered Accountant','@halonggiangg']) assert.ok(html.includes(label));
  assert.ok(html.includes('scroll-stage'));
  assert.ok(html.includes('light-connectors'));
  assert.ok(html.includes('Phóng to nhân vật'));
  for(const url of ['https://www.facebook.com/halonggiang','https://www.tiktok.com/@halonggiangg','https://dantri.com.vn/giao-duc/chinh-phuc-thanh-cong-danh-vi-icaew-chartered-accountant-theo-cach-it-nguoi-viet-tung-thu-20220724145456476.htm']) assert.ok(html.includes(url));
  assert.ok(!html.includes('Your site is taking shape'));
});
void test('approved character asset is served successfully',async()=>{
  const response=await fetch('http://localhost:3000/giang-character.png');
  assert.equal(response.status,200);
  assert.match(response.headers.get('content-type'),/image\/png/);
  assert.ok((await response.arrayBuffer()).byteLength>100000);
});
