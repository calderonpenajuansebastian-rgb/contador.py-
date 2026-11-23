<<<<<<< HEAD
# LikeLab · Versión Móvil

Aplicación móvil del proyecto académico SENA *«De la web al móvil: contador de likes»*,
construida con **React Native, Expo y TypeScript**. Replica y amplía la versión web con
la misma lógica de contador, historial, estadísticas y persistencia.

## Requisitos

- Node.js 20 o superior
- npm
- Expo Go en el celular (o un emulador de Android / simulador de iOS)

## Cómo ejecutar

```bash
cd aplicacionClics
npm install
npm start
```

Escanea el código QR con **Expo Go** o pulsa `a` para Android / `i` para iOS.

Para verlo en el navegador:

```bash
npm run web
```

## Comandos útiles

```bash
npx tsc --noEmit   # verificación de tipos
npm run lint       # ESLint (configuración de Expo)
```

## Funcionalidades

- Contador grande con animación elástica y corazones flotantes al dar like.
- Botones **Dar like**, **Quitar like** y **Reiniciar** con confirmación nativa.
- Retroalimentación háptica en dispositivos compatibles.
- Historial de clics con hora y fecha, filtros *Todos / Likes / Restas* y opción «Ver todo».
- Estadísticas: clics totales, máximo alcanzado, último like y nivel.
- Nivel, racha a partir de 10 likes y barra de progreso hacia el próximo hito.
- Persistencia con **AsyncStorage** (clave `likelab:mobile:v2`).
- Pantalla **Acerca** con funcionalidades, tecnologías y contexto del proyecto.
- Barra de pestañas flotante (Contador / Acerca) en web y navegación nativa en móvil.
- Interfaz oscura responsive con degradados, tarjetas y microanimaciones.

## Estructura

```
src/
├── app/
│   ├── _layout.tsx        # Tema oscuro, estado de la barra y splash animado
│   ├── index.tsx          # Pantalla del contador
│   └── explore.tsx        # Pantalla «Acerca del proyecto»
├── components/
│   ├── animated-icon.tsx  # Splash de marca LikeLab
│   ├── app-tabs.tsx       # Pestañas nativas
│   ├── app-tabs.web.tsx   # Barra flotante para web
│   └── counter/           # Corazones animados y tarjetas de estadísticas
├── constants/likes.ts     # Paleta, niveles, hitos, mensajes y formateadores
└── hooks/
    └── use-like-counter.ts # Estado del contador + persistencia
```

## Nota sobre el icono

Los archivos de `assets/images/` provienen de la plantilla de Expo. Puedes reemplazarlos
por un icono propio manteniendo los mismos nombres para conservar la configuración de
`app.json`.
=======
# Contador de clics: De la Web al Móvil

Taller SENA – Análisis y Desarrollo de Software (228118).
Misma aplicación ("Contador de Likes" con registro de hora) en dos tecnologías:

| Rama    | Contenido                                   |
|---------|---------------------------------------------|
| `web`   | HTML + CSS + JavaScript (manipulación del DOM) |
| `movil` | React Native + Expo (estado con `useState`) |
| `main`  | Une ambas ramas + documento del taller      |


>>>>>>> 45eebe13d0c0e234d0cb27e10ae8c36e4c599ce2
