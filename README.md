# Pablo VI Math App — Plataforma adaptativa gratuita

Proyecto web estático para GitHub Pages + Google Apps Script + Google Sheets. No requiere APIs pagas ni tarjeta de crédito.

## Qué incluye

- Login básico con modo demo/local y opción de conexión a Google Apps Script.
- Cada microhabilidad funciona como un nivel.
- Banco de preguntas por familias: pregunta base + dos gemelas.
- Motor de repetición doblemente espaciada: PFA simplificado para dominio + HLR simplificado para recuperabilidad.
- Detección parcial de salida de sesión: cambio de pestaña, pérdida de foco, salida de pantalla completa y recarga.
- Si se pierde una pregunta por salida, el ítem se quema y se reemplaza por una gemela.
- Módulo de errores frecuentes por microhabilidad.
- Reportes HTML/CSV por estudiante.
- Emisión de mini diploma por eje temático con código verificable y QR textual.
- Apps Script para guardar progreso, intentos, eventos y certificados en Google Sheets.
- Plantilla `superusuario_template.xlsx` para el registro maestro.

## Estructura

```text
pablo_vi_math_app/
├── index.html
├── verificar.html
├── admin.html
├── assets/styles.css
├── src/config.js
├── src/api.js
├── src/auth.js
├── src/spacing.js
├── src/sessionGuard.js
├── src/certificate.js
├── src/app.js
├── data/descriptors.json
├── data/skills.json
├── data/common_errors.json
├── data/questions_limits.json
├── apps_script/Code.gs
├── apps_script/appsscript.json
├── docs/DEPLOY_GITHUB_PAGES.md
├── docs/DEPLOY_APPS_SCRIPT.md
└── docs/DATA_MODEL.md
```

## Uso rápido local

Abre `index.html` desde un servidor local o súbelo a GitHub Pages.

Credenciales demo:

```text
Usuario: demo
Contraseña: 1234
```

Superusuario demo:

```text
Usuario: admin
Contraseña: admin123
```

> Para uso real, configura Google Apps Script y reemplaza `APPS_SCRIPT_URL` en `src/config.js`.

## Tecnologías gratuitas

- GitHub Pages para hosting estático.
- Google Sheets como registro maestro del superusuario.
- Google Apps Script como backend gratuito con cuotas.
- HTML, CSS y JavaScript puro.

## Advertencias técnicas

- Una app web no puede bloquear completamente capturas de pantalla ni impedir que el estudiante cierre el navegador. Este proyecto implementa detección parcial, registro de eventos y pérdida automática del ítem activo.
- Los códigos de diploma son verificables solo si se emiten mediante Apps Script, porque allí vive la clave secreta institucional. Los diplomas generados en modo local son de prueba.


## Actualización del banco variado

Esta versión incluye preguntas de selección múltiple, tablas, gráficas en canvas, relación de pares y simuladores interactivos. Cada microhabilidad conserva 20 familias de preguntas y dos variantes gemelas por familia para reposición o refuerzo.


## Control de emisión de diploma

El mini diploma no se emite por simple finalización de actividades. La app exige evidencia de dominio del descriptor usando:

- PFA simplificado para estimar dominio por microhabilidad.
- HLR simplificado para estimar recuperabilidad y curva de olvido.
- Repetición adaptativa con preguntas gemelas ante error o pregunta perdida.
- Criterio mínimo por microhabilidad: 20 intentos, dominio >= 85%, recuperabilidad >= 75% y racha >= 3.

Los reportes descargables incluyen:

- `informe_adaptativo_microhabilidades.html`: informe con gráficas de dominio, recuperabilidad, fallas, tiempos, dificultad, tipo de pregunta, progreso acumulado y curvas de olvido.
- `metadata_microhabilidades_limites.csv`: archivo para análisis posterior de metadatos por intento.


## Paletas por microhabilidad

Esta versión incluye una paleta visual distinta para cada nivel/microhabilidad:

1. Concepto de límite: blanco y negro.
2. Valor puntual vs. límite: escala de grises.
3. Tablas: azul y blanco.
4. Gráficas: naranja, negro y blanco.
5. Límite lateral izquierdo: verde oscuro y blanco.
6. Límite lateral derecho: morado y blanco.
7. Límite bilateral: rojo vino y blanco.
8. Huecos y saltos: turquesa y blanco.
9. Expresiones algebraicas: mostaza, negro y blanco.
10. Aplicación contextual: azul petróleo y blanco.
11. Síntesis: multicolor institucional suave.

La paleta cambia automáticamente al entrar en cada microhabilidad y afecta botones, badges, barras de progreso, bordes, paneles, gráficas y simuladores.
