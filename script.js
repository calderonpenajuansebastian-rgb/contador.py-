// 1. Obtener los elementos del DOM por su ID
const textoContador = document.getElementById("contador");
const boton = document.getElementById("btn-like");
const tablaRegistros = document.getElementById("tabla-registros");

let likes = 0; // let (no const) porque el valor cambia

// Formatea la hora como HH:MM:SS
function obtenerHora() {
  const ahora = new Date();
  const hh = String(ahora.getHours()).padStart(2, "0");
  const mm = String(ahora.getMinutes()).padStart(2, "0");
  const ss = String(ahora.getSeconds()).padStart(2, "0");
  return hh + ":" + mm + ":" + ss;
}

// 2. Escuchar el evento 'click' y manipular el DOM
boton.addEventListener("click", () => {
  likes++;
  textoContador.textContent = likes; // Actualizamos el DOM directamente

  // Crear la fila y las celdas dinámicamente
  const fila = document.createElement("tr");
  const celdaNumero = document.createElement("td");
  const celdaHora = document.createElement("td");

  celdaNumero.textContent = likes;
  celdaHora.textContent = obtenerHora();

  fila.appendChild(celdaNumero);
  fila.appendChild(celdaHora);

  // Agregar al INICIO para que lo más reciente quede arriba
  tablaRegistros.prepend(fila);
});
