MMLAB — VERSIÓN EDITABLE
==========================

Esta carpeta reconstruye el sitio en una estructura sencilla para editarlo en Visual Studio Code.

ESTRUCTURA
----------
index.html       -> estructura y textos de la página.
estilos.css      -> colores, tamaños, espacios, tarjetas y diseño visual.
script.js        -> buscador, índice A-Z, filtro por área, menú y WhatsApp.
examenes.json    -> catálogo de análisis. Aquí puedes agregar, quitar o modificar exámenes.
logo-extraido.jpg

ÍNDICE ALFANUMÉRICO
-------------------
El catálogo usa:
Todos | A | B | C | ... | Z

Se eliminaron los botones numéricos del índice.

CÓMO ABRIRLO EN VS CODE
-----------------------
1. Descarga y descomprime esta carpeta.
2. Abre Visual Studio Code.
3. Ve a Archivo > Abrir carpeta.
4. Selecciona la carpeta MM-LAB-editable.
5. Instala la extensión "Live Server" si todavía no la tienes.
6. Haz clic derecho sobre index.html.
7. Selecciona "Open with Live Server".

IMPORTANTE
----------
No conviene abrir index.html con doble clic, porque el navegador puede bloquear la lectura de examenes.json.
Live Server o GitHub Pages sí permiten cargarlo correctamente.

CÓMO EDITAR
-----------
CAMBIAR TEXTOS:
Abre index.html. Hay comentarios "EDITAR" en los lugares principales.

CAMBIAR COLORES / DISEÑO:
Abre estilos.css. Los colores principales están arriba:
--navy
--blue
--green
--light-blue
--bg

CAMBIAR EXÁMENES:
Abre examenes.json. Mantén el mismo formato de cada objeto.
Ejemplo:

{
  "id": "nuevo-examen",
  "nombre": "Nuevo Examen",
  "area": "Hematología",
  "descripcion": "Descripción breve.",
  "muestra": "Sangre venosa",
  "tiempo": "24 horas",
  "precio": 30,
  "categoria": "basico"
}

CAMBIAR WHATSAPP:
Abre script.js y modifica:
whatsapp: "51946309246"

La estructura conserva el estilo visual general del sitio original; no es un rediseño.
La reconstrucción está separada para que posteriormente puedas cambiar o agregar elementos sin depender de un archivo HTML compilado de 2.5 MB.

NOTA SOBRE EL CONTENIDO:
------------------------
Se conservaron los textos y los 12 registros del catálogo proporcionados por los archivos originales, salvo la lógica del índice, donde se quitó la numeración porque ese es el cambio solicitado.
Se extrajo una imagen incrustada como logo-extraido.jpg; puedes reemplazarla cuando quieras.
