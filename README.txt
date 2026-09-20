MMLAB — PROYECTO EDITABLE
==========================

Esta versión mantiene la estructura y el estilo visual general del proyecto y añade la nueva sección de búsqueda del catálogo solicitada.

ARCHIVOS PRINCIPALES
--------------------
index.html    = estructura y textos visibles de la web.
estilos.css   = colores, tamaños, espacios, tarjetas, botones y diseño responsive.
script.js     = carrusel, menú móvil, WhatsApp, buscador, alfabeto, barra deslizante y filtros por área.
config.json   = datos editables del negocio y lista base de áreas del catálogo.
examenes.json = catálogo de análisis. Aquí se agregan, eliminan o modifican exámenes.
img/          = imágenes de la página.

NUEVA SECCIÓN DE BÚSQUEDA
--------------------------
La sección del catálogo ahora contiene un único cuadro blanco que agrupa:

1. Buscador en formato píldora.
   Texto inicial: "Buscar análisis: glucosa, hemograma..."
   Es un placeholder: desaparece automáticamente al escribir.

2. ALFABETO.
   Cada opción se presenta en un círculo independiente:
   TODO, 1-9 y A-Z.
   Se incluye la letra V.

3. Barra deslizante.
   Está debajo del alfabeto y permite desplazarse de izquierda a derecha para seleccionar TODO, un número o una letra.
   Si se pulsa un círculo, la barra se mueve a esa posición.
   Si se mueve la barra, se actualiza el círculo seleccionado.

4. ÁREA.
   Las áreas se pueden controlar desde config.json.
   La lista base actual es:
   Todos, Hematología, Bioquímica sanguínea, Perfil lipídico, Uroanálisis, Bioquímica hepática y Hormonal.

   Además, si agregas un examen en examenes.json con un área nueva que no esté en config.json, esa área aparecerá automáticamente en los filtros. Esto permite ampliar el catálogo sin modificar el código principal.

5. Cantidad de resultados.
   El sistema muestra automáticamente "0 resultados", "1 resultado", "2 resultados", etc., según los filtros aplicados.

AGREGAR O CAMBIAR EXÁMENES
---------------------------
Edita examenes.json. Cada examen usa esta estructura:

{
  "id": "identificador-unico",
  "nombre": "Nombre del examen",
  "area": "Hematología",
  "descripcion": "Descripción breve",
  "muestra": "Sangre venosa",
  "tiempo": "24 horas",
  "precio": 35,
  "categoria": "basico"
}

IMPORTANTE: cuando agregues un examen, sepáralo del anterior con una coma. El último registro no lleva coma.

EDITAR LAS ÁREAS
----------------
Abre config.json y busca:

"catalogo": {
  "areas": [
    "Todos",
    "Hematología",
    "Bioquímica sanguínea",
    "Perfil lipídico",
    "Uroanálisis",
    "Bioquímica hepática",
    "Hormonal"
  ]
}

Puedes agregar otra área, por ejemplo:

"Inmunología"

No es necesario tocar index.html para crear el botón del nuevo filtro.

IMÁGENES
--------
Las imágenes están separadas de index.html para facilitar su reemplazo.

Lupa del buscador: img/lupa.svg
Logo: img/logo.jpg
Carrusel: img/hero-1.jpg, hero-2.jpg, hero-3.jpg, hero-4.jpg
Misti: img/misti.jpg

Si reemplazas una imagen, conserva el mismo nombre de archivo para no tener que modificar el código.

WHATSAPP Y CORREO
-----------------
Los datos principales están en config.json:
- WhatsApp
- WhatsApp visible
- Correo
- Horario
- Mensajes de WhatsApp

Los botones "Cotizar" generan automáticamente un mensaje con el nombre del análisis.

VISUAL STUDIO CODE
------------------
No abras index.html simplemente haciendo doble clic si quieres que los archivos JSON funcionen correctamente.

Recomendado:
1. Abre la carpeta del proyecto en Visual Studio Code.
2. Instala la extensión gratuita Live Server.
3. Haz clic derecho sobre index.html.
4. Selecciona "Open with Live Server".
5. Revisa el buscador, círculos, barra deslizante, filtros, carrusel y botones antes de publicar.

SUBIR A GITHUB
--------------
Esta actualización modifica principalmente:
- index.html
- estilos.css
- script.js
- config.json
- README.txt

examenes.json e img/ se mantienen en el proyecto y no necesitan reemplazarse si no has hecho cambios en ellos.

Si quieres evitar errores, puedes reemplazar la carpeta completa por esta versión antes de hacer el commit.

IMPORTANTE
----------
Esta versión sigue siendo una base editable. Podemos continuar ajustando las siguientes secciones de la página una por una antes de considerar el sitio definitivo.
