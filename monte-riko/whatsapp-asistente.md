# Asistente de WhatsApp de Monte Riko

Armado el 10 de noviembre de 2026, a pedido de Tomás, con las ideas de dos reels: la pizzería 3D de @valentinpanizza y la pastelera Mariana de @liordiaz (`instagram-referentes.md`). **Estado:** diseñado, sin conectar. Para conectarlo hacen falta pasos que solo puede hacer Tomás (abajo).

## Para qué
Que los clientes que escriben al WhatsApp de pedidos reciban respuesta al instante, a cualquier hora, y que Tomás solo tenga que confirmar los pedidos y atender lo que el asistente no puede resolver.

Ojo, hay dos ideas distintas de "Claude en WhatsApp":
1. **Este asistente, que atiende a los clientes.** Es lo que se arma acá.
2. **Que Tomás le hable a Claude por WhatsApp**, como un contacto más. Es lo que quedó en pausa el 1 de noviembre (`yo/compu-y-herramientas.md`, WhatsApp y llamadas). Se puede retomar después: no es lo mismo ni usa las mismas herramientas.

## Cómo trabaja (las piezas de la pizzería, aplicadas)
1. **Entiende cómo escribe la gente:** "kiero 1 docena surtida", "cuanto sale?", "hacen envios a cordoba". Nada de menús de "oprimí 1".
2. **Contesta solo con datos reales**, los de la base de abajo. Si algo no está ahí, no lo inventa: le pasa la charla a Tomás.
3. **Espera unos segundos y junta los mensajes** antes de contestar, para no responder tres veces a "hola" / "quería una caja" / "no, mejor dos".
4. **Escucha los audios:** los pasa a texto antes de leerlos.
5. **Arma el pedido y se lo pasa a Tomás:** nombre, qué lleva, cantidad, si es envío (y a dónde) o retiro, y el comprobante. Tomás lo recibe ordenado (por ejemplo, como tarjeta en Trello o fila en una planilla) y no tiene que leer toda la charla.
6. **Respeta el cupo (idea de Mariana):** Tomás le dice cada semana cuántas cajas puede hacer. Cuando se llena, ofrece la fecha siguiente en vez de tomar un pedido que no se puede cumplir.
7. **Cobra como Tomás ya cobra:** pasa los datos para transferir y pide la foto del comprobante. Tomás confirma el pago y el pedido; el asistente nunca da un pedido por confirmado solo.
8. **Le pasa la charla a Tomás** con un resumen y deja de contestar cuando: el cliente está enojado o reclama, pide algo que no está en la base (eventos, pedidos grandes, sabores que no existen, descuentos), pregunta algo de salud o alergias, o pide hablar con una persona.

## Base de conocimiento (solo esto puede decir)
Sacado de `brief.md`. Si cambia un precio, se cambia acá y en el asistente.
- **Marplatense:** tapas de chocolate, dulce de leche y baño de chocolate negro. $2.800.
- **Patagónico:** con corazón de mermelada de frutos rojos. $3.000.
- **Media docena:** $16.500. **Docena:** $31.900. Se pueden surtir (marplatenses y patagónicos en la misma caja) al mismo precio.
- Cada alfajor pesa más de 100 gramos y va envuelto en papel dorado, dentro de una caja.
- **Envíos:** las cajas van a todo el país y dentro de Mar del Plata. Los sueltos solo se envían dentro de Mar del Plata o se retiran. El costo y el tiempo del envío los arregla Tomás: no hay tarifa fija, así que el asistente no da un precio de envío.
- **Retiro:** en Mar del Plata, coordinando antes. No hay local.
- **Pedir:** en monteriko.com.ar se arma la caja y el pedido llega escrito por WhatsApp.
- **Consejo:** 10 minutos en el freezer antes de comerlo.
- **Falta que Tomás defina:** formas de pago (y los datos, que se cargan solo en el asistente, nunca en este repo), cuánto tarda en tener lista una caja, horario en que contesta él, el cupo semanal y si toma pedidos para eventos.

## Cómo habla
Como Monte Riko: voseo, cercano, corto, con un poco de humor (`instagram-voz.md`). Se presenta como el asistente de Monte Riko, no como Tomás.

Ejemplo:
> **Cliente:** hola cuanto sale la docena? hacen envio a rosario
> **Asistente:** ¡Hola! La docena sale $31.900 y la podés surtir con marplatenses y patagónicos. Sí, las cajas van a todo el país: el envío a Rosario lo coordina Tomás y te pasa el costo. ¿Querés que te arme el pedido?
> **Cliente:** si, 6 marplatenses y 6 patagonicos
> **Asistente:** Listo: docena surtida, 6 marplatenses y 6 patagónicos, $31.900 más el envío a Rosario. ¿A nombre de quién va? Te paso los datos para transferir y, cuando me mandes el comprobante, Tomás confirma y te pasa el costo del envío.

## Después de la venta (la cuarta fase de Mariana)
Cuando Tomás marca un pedido como entregado, un mensaje corto: que lo disfrute, el consejo del freezer y que si sube una historia etiquete a @monteriko.oficial (va a la destacada de opiniones). Meta cobra los mensajes que manda la marca fuera de las 24 horas desde el último mensaje del cliente: este va dentro de esa ventana o no va.

## Cómo se conecta (lo que hace cada uno)
Hay dos partes y conviene no mezclarlas:

**1. Registrar el número en WhatsApp oficial (la API de Meta).** Desde septiembre 2026 Meta tiene una conexión oficial para Claude, en prueba ("WhatsApp Business Tools MCP"). Con ella Claude hace la parte técnica: crear la cuenta de WhatsApp Business en Meta, registrar el número, verificarlo con el código, crear el webhook y las plantillas de mensaje.
- **Tomás:** agrega el conector en la app de Claude (Configuración → Conectores) y entra con su cuenta de Meta; recibe el código de verificación en el celu y se lo pasa a Claude en el chat. Claude no crea cuentas ni escribe contraseñas.
- **Claude:** todo lo demás de este paso, con Tomás mirando.
- Meta avisa que esta conexión es para desarrollar y probar, no para mandar muchos mensajes.

**2. El asistente que contesta (el "cerebro").** El conector de Meta no contesta mensajes solo: hace falta algo prendido todo el día que reciba cada mensaje y responda. Una sesión de Claude en la compu no sirve para eso, porque se apaga. Opciones:
- **Una plataforma ya hecha** (ManyChat, Wati u otra aprobada por Meta), con la base y las reglas de arriba cargadas. Es lo más rápido. Cuesta un abono mensual en dólares.
- **Un programa propio en la nube** que use la API de Claude con la base de arriba. Más trabajo de armar, más barato por mes y más a medida (cupo, Trello, comprobantes).

**El número:** conviene probar primero con un chip aparte (como ya se había dicho el 1 de noviembre) y, cuando ande bien, pasar el número de pedidos. Meta permite usar el mismo número en la app de WhatsApp Business y en la API a la vez ("coexistencia"), así Tomás puede seguir contestando desde el celu; hay que comprobar que esté disponible para su cuenta cuando se conecte.

**Gratis y ya, mientras tanto:** en la app de WhatsApp Business del celu, Tomás puede cargar respuestas rápidas (precios, envíos, cómo pedir), un mensaje de bienvenida y uno de ausencia fuera de horario con el link a monteriko.com.ar. No piensa, pero corta las preguntas repetidas desde hoy.

## Decisiones que faltan (Tomás)
1. ¿Chip aparte para probar o directo el número de pedidos?
2. ¿Plataforma ya hecha o programa propio?
3. Formas de pago, tiempo de preparación, horario y cupo semanal.
4. ¿Se regala algo para atraer (la "probadita" de Mariana)? No puede ser la receta: es el producto.
