const { chromium } = require('playwright');
const S = process.argv[2];
const P = [
  { n: 'lun-9-1', img: 'limpio-0.3.png', t: 'HAY ALGUIEN NUEVO EN LA COCINA', s: 'Mañana lo conocés.', pos: 'abajo' },
  { n: 'lun-9-2', img: 'mitades-gustoso.png', t: 'MAÑANA TE MUESTRO CÓMO SE HACE', s: 'Un alfajor de más de 100 g, paso a paso.\nA las 18:00, en un reel.', pos: 'abajo' },
];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const x of P) {
    const q = new URLSearchParams({ img: x.img, t: x.t, s: x.s || '', pos: x.pos || 'arriba' });
    await p.goto('http://localhost:8766/placa.html?' + q);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    await p.screenshot({ path: `${S}/${x.n}.png` });
  }
  await b.close();
})();
