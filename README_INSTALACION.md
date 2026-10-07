# Goma · Bitácora Mondioring

PWA móvil para registrar el entrenamiento de Goma con objetivo Mondioring Categoría 3.

## Qué incluye
- Carga rápida de sesiones desde el celular.
- Los 17 ejercicios del programa C3.
- Campos específicos según el ejercicio.
- Historial.
- Evolución básica por ejercicio.
- Backup e importación en JSON.
- Funcionamiento offline luego de la primera carga.
- Instalación en pantalla de inicio como una app.

## IMPORTANTE: para instalarla en el celular
Una PWA debe abrirse desde una dirección HTTPS. No alcanza con abrir `index.html` directamente desde el teléfono.

### Opción simple: publicar la carpeta en un hosting estático
Subí TODOS los archivos manteniendo esta estructura:

    index.html
    styles.css
    app.js
    manifest.webmanifest
    sw.js
    icons/
      icon-192.png
      icon-512.png

Podés usar GitHub Pages, Netlify, Cloudflare Pages, Vercel o cualquier hosting HTTPS estático.

## Instalar en Android
1. Abrí la URL publicada con Chrome.
2. Si aparece el botón `Instalar`, tocálo.
3. Si no aparece: menú de Chrome (⋮) > `Instalar app` o `Agregar a pantalla principal`.
4. Confirmá.
5. Quedará un icono `Goma MR` en la pantalla de inicio.

## Instalar en iPhone/iPad
1. Abrí la URL publicada en Safari.
2. Tocá `Compartir`.
3. Elegí `Agregar a inicio`.
4. Confirmá el nombre `Goma MR`.
5. Abrila desde el nuevo icono.

## Datos y backups
Los entrenamientos se guardan localmente en el dispositivo/navegador. Usá `Backup y datos > Exportar backup` periódicamente.
Si cambiás de teléfono o borrás los datos del navegador, importá el JSON previamente exportado.

## Uso recomendado
1. Tocá `+ Nueva sesión`.
2. Elegí el ejercicio.
3. Cargá objetivo, repeticiones y sólo las métricas útiles.
4. Guardá.
5. Revisá `Historial` y `Evolución`.
