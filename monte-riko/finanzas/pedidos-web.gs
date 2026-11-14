/**
 * Monte Riko · Pedidos web (Apps Script de la planilla "Monte Riko · Finanzas").
 * Recibe cada pedido que alguien arma en monteriko.com.ar al apretar "Enviar por WhatsApp"
 * y lo anota en la pestaña "Pedidos web". No guarda nombres ni teléfonos.
 * Se pega en la planilla: Extensiones → Apps Script, y se implementa como "Aplicación web"
 * (ejecutar como: yo; acceso: cualquier persona). Ver monte-riko/finanzas/README.md.
 */
const HOJA = 'Pedidos web';
const ENCABEZADO = ['Fecha y hora', 'Tipo', 'Detalle', 'Entrega', 'Total ($)', 'Marplatenses', 'Patagónicos', 'Estado'];

function hoja_() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let h = libro.getSheetByName(HOJA);
  if (!h) {
    h = libro.insertSheet(HOJA);
    h.appendRow(ENCABEZADO);
    h.setFrozenRows(1);
    h.getRange(1, 1, 1, ENCABEZADO.length).setFontWeight('bold').setBackground('#FF6900').setFontColor('#FFFFFF');
    h.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
    h.getRange('E:E').setNumberFormat('"$"#,##0');
  }
  return h;
}

const texto_ = (v, max) => String(v == null ? '' : v).slice(0, max);
const numero_ = (v, max) => {
  const n = Math.round(Number(v));
  return isFinite(n) && n >= 0 && n <= max ? n : 0;
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const tipo = d.tipo === 'cajas' ? 'Cajas' : d.tipo === 'sueltos' ? 'Sueltos' : '';
    if (!tipo) return ContentService.createTextOutput('ignorado');
    lock.waitLock(10000);
    hoja_().appendRow([
      new Date(), tipo, texto_(d.detalle, 600), texto_(d.entrega, 60),
      numero_(d.total, 5000000), numero_(d.marplatenses, 500), numero_(d.patagonicos, 500), 'Sin confirmar'
    ]);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error');
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/* Para probar desde el editor: crea la pestaña si falta. */
function prepararHoja() { hoja_(); }
