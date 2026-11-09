const { chromium } = require('playwright');
const S = process.argv[2]; const times = process.argv.slice(3).map(Number);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.addInitScript(() => { window.__timelines = {}; });
  await p.goto('http://localhost:8765/index.html');
  await p.waitForFunction(() => window.__escenaLista === undefined || true);
  await p.waitForTimeout(4000);
  await p.addStyleTag({ content: '.clip{display:none!important}' });
  for (const t of times) {
    await p.evaluate(t => window.dispatchEvent(new CustomEvent('hf-seek', { detail: { time: t } })), t);
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${S}/limpio-${t}.png` });
  }
  await b.close();
})();
