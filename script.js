
// Obtener elementos del DOM
const textoContador = document.getElementById("contador");
const botonLike = document.getElementById("btn-like");
const botonRestar = document.getElementById("btn-restar");
const botonReiniciar = document.getElementById("btn-reiniciar");
const tablaRegistros = document.getElementById("tabla-registros");
const tarjeta = document.querySelector(".card");

// Estado inicial
let likes = 0;

// Obtener la hora actual
function obtenerHora() {
    return new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
}

// Actualizar el contador y los estilos
function actualizarInterfaz() {
    textoContador.textContent = likes;

    const superaLimite = likes > 10;

    textoContador.classList.toggle("alto", superaLimite);
    tarjeta.classList.toggle("alto", superaLimite);
}

// Registrar un nuevo clic en la tabla
function registrarClic() {
    const fila = document.createElement("tr");

    const celdaNumero = document.createElement("td");
    const celdaHora = document.createElement("td");

    celdaNumero.textContent = likes;
    celdaHora.textContent = obtenerHora();

    fila.append(celdaNumero, celdaHora);

    // Mostrar el registro más reciente primero
    tablaRegistros.prepend(fila);
}

// Incrementar likes
function agregarLike() {
    likes++;

    registrarClic();
    actualizarInterfaz();
}

// Restar likes
function restarLike() {
    if (likes === 0) return;

    likes--;

    // Eliminar el registro más reciente
    if (tablaRegistros.firstElementChild) {
        tablaRegistros.firstElementChild.remove();
    }

    actualizarInterfaz();
}

// Reiniciar contador e historial
function reiniciarContador() {
    likes = 0;
    tablaRegistros.innerHTML = "";

    actualizarInterfaz();
}

// Eventos de los botones
botonLike.addEventListener("click", agregarLike);
botonRestar.addEventListener("click", restarLike);
botonReiniciar.addEventListener("click", reiniciarContador);

// Inicializar interfaz
actualizarInterfaz();

