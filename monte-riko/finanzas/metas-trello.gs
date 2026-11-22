/**
 * Monte Riko · Metas en Trello (Apps Script de la planilla "Monte Riko · Finanzas").
 * Lee la pestaña Resumen ("Metas del mes", O6:T9) y actualiza la primera tarjeta de cada
 * lista de metas del tablero "Ventas Monte Riko" en Trello: cuántas docenas vendiste en el mes,
 * cuántas faltan y el avance. Corre solo cada hora.
 *
 * Instalación (una sola vez, ver monte-riko/finanzas/README.md):
 * 1. Pegar este archivo en Extensiones → Apps Script, como archivo nuevo "metas-trello".
 * 2. Configuración del proyecto → Propiedades del script: agregar TRELLO_KEY y TRELLO_TOKEN
 *    (se sacan en trello.com/power-ups/admin). Nunca se escriben en el código ni en el Cerebro.
 * 3. Elegir la función "instalar" y apretar Ejecutar (pide permiso la primera vez).
 */
const TARJETAS = [ // tarjeta 📊 de cada lista, en el orden de las filas 6 a 9 de Resumen
  { id: '6b0365c2d86f374855b423b8', meta: '5' },
  { id: '6b0365c9efa57dc1c2726466', meta: '10' },
  { id: '6b0365ceb2a0dd79fcb36ff8', meta: '16' },
  { id: '6b0365d4690212577478800e', meta: '24', nota: ' (la meta es 24 a 30)' },
];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const GASTOS_FIJOS_CELDA = 'Costos!B29';

const uno_ = n => (Math.round(n * 10) / 10).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pesos_ = n => '$' + Math.round(n).toLocaleString('es-AR');

function actualizarTrello() {
  const props = PropertiesService.getScriptProperties();
  const key = props.getProperty('TRELLO_KEY'), token = props.getProperty('TRELLO_TOKEN');
  if (!key || !token) throw new Error('Faltan TRELLO_KEY y TRELLO_TOKEN en las propiedades del script');
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.flush();
  const filas = libro.getRange('Resumen!O6:T9').getValues();
  const fijos = Number(libro.getRange(GASTOS_FIJOS_CELDA).getValue()) || 0;
  const mes = MESES[new Date().getMonth()];
  const alfajores = Math.round(Number(filas[0][2]) * 12);
  filas.forEach((f, i) => {
    const t = TARJETAS[i];
    const vendidas = Number(f[2]) || 0, faltan = Number(f[3]) || 0, avance = Number(f[4]) || 0;
    const montoMR = Number(f[5]) || 0;
    const pct = Math.round(avance * 100);
    const nombre = faltan <= 0
      ? `✅ ${mes}: meta cumplida, vendiste ${uno_(vendidas)} de ${t.meta} docenas`
      : `📊 ${mes}: vendiste ${uno_(vendidas)} de ${t.meta} docenas · faltan ${uno_(faltan)} (${pct}%)`;
    const desc = [
      '**Se actualiza solo desde la planilla de finanzas (pestaña Resumen, "Metas del mes").**',
      '',
      `- Vendidas este mes: ${uno_(vendidas)} docenas (${alfajores} alfajores)`,
      `- Faltan: ${uno_(Math.max(0, faltan))} docenas${t.nota || ''}`,
      `- Avance: ${pct}%`,
      `- Monte Riko juntado este mes: ${pesos_(montoMR)} de ${pesos_(fijos)} que hacen falta para los gastos fijos`,
      '',
      'Las ventas cuentan cuando están en la pestaña Ventas (pedido confirmado y cobrado). Los pedidos que se arman en la página entran primero a "Pedidos web" y pasan a Ventas cuando los confirmás.',
      `Última actualización: ${Utilities.formatDate(new Date(), 'America/Argentina/Buenos_Aires', 'dd/MM/yyyy HH:mm')}`,
    ].join('\n');
    UrlFetchApp.fetch(`https://api.trello.com/1/cards/${t.id}?key=${encodeURIComponent(key)}&token=${encodeURIComponent(token)}`, {
      method: 'put',
      contentType: 'application/json',
      payload: JSON.stringify({ name: nombre, desc: desc }),
    });
  });
}

/** Ejecutar una vez: deja la actualización corriendo cada hora y la prueba en el momento. */
function instalar() {
  ScriptApp.getProjectTriggers()
    .filter(tr => tr.getHandlerFunction() === 'actualizarTrello')
    .forEach(tr => ScriptApp.deleteTrigger(tr));
  ScriptApp.newTrigger('actualizarTrello').timeBased().everyHours(1).create();
  actualizarTrello();
}
