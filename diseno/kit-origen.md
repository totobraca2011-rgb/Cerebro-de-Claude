# Kit de diseño para Claude Code

Tres skills de diseño y cuatro roles de subagentes para construir y auditar interfaces.

## Qué trae

**Skills**

| Skill | Para qué | Origen |
|---|---|---|
| `taste-skill` | Dirección artística: diseño con idea, no genérico | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) · MIT |
| `ui-ux-pro-max` | Base técnica: estilos, paletas, tipografías, reglas de UX y accesibilidad | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) · MIT |
| `impeccable` | Auditar y pulir: `audit`, `critique`, `polish`, `bolder`, `quieter`… y un detector automático | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) · Apache 2.0 |

**Subagentes**

| Agente | Rol |
|---|---|
| `constructor-ui` | Construye la interfaz. Se pueden lanzar varios en paralelo sobre partes independientes. |
| `auditor-tecnico` | Revisa accesibilidad, interacción, responsive, rendimiento y código. No edita. |
| `auditor-visual` | Revisa dirección, jerarquía, tipografía, color y señales de "diseño de IA". No edita. |

Flujo: los constructores arman → los dos auditores revisan en paralelo → se corrige → se repite hasta que ambos aprueben.

## Instalar

En tu computadora (macOS o Linux):

```sh
git clone https://github.com/<tu-usuario>/kit-diseno.git
sh kit-diseno/install.sh --con-motor
```

En una sesión de Claude Code en la nube: pedile a Claude *"instalá el kit de diseño de <tu-usuario>/kit-diseno"*.

`--con-motor` descarga el programa de impeccable (≈21 MB, verificado con sha256) desde las releases de su autor. Sin él, impeccable funciona igual leyendo sus guías, pero sin el detector automático ni la revisión en vivo.

Después de instalar, reiniciá Claude Code para que reconozca los subagentes.

## Versiones incluidas

Copias revisadas el 2026-10-25:

- taste-skill `12af471f627f866411b4bd785b19646d3672784c`
- ui-ux-pro-max-skill `d14efff8ed1faa4187f004f79926f428c8074ec7` (rutas internas ajustadas para instalarla como skill suelta)
- impeccable `4fc2f83e1c8710dba772bfd4523d0efab57737b6`

Cada skill conserva su licencia original en su carpeta.
