// 1. Obtener los elementos del DOM por su ID
const textoContador = document.getElementById("contador");
const boton = document.getElementById("btn-like");
const tablaRegistros = document.getElementById("tabla-registros");

let likes = 0; // let (no const) porque el valor cambia

// 2. Escuchar el evento 'click' y manipular el DOM
boton.addEventListener("click", () => {
  likes++;
  textoContador.textContent = likes; // Actualizamos el DOM directamente
});
