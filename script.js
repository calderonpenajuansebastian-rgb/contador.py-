
const textoContador = document.getElementById("contador");
const botonLike = document.getElementById("btn-like");
const botonRestar = document.getElementById("btn-restar");
const botonReiniciar = document.getElementById("btn-reiniciar");
const tablaRegistros = document.getElementById("tabla-registros");
const tarjeta = document.querySelector(".card");

// Clave para almacenar los datos
const CLAVE_ALMACENAMIENTO = "contadorLikesDatos";

// Estado inicial
let likes = 0;
let registros = [];

// Obtener la hora actual
function obtenerHora() {
    return new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
}

// Guardar información en localStorage
function guardarDatos() {
    const datos = {
        likes: likes,
        registros: registros
    };

    try {
        localStorage.setItem(
            CLAVE_ALMACENAMIENTO,
            JSON.stringify(datos)
        );
    } catch (error) {
        console.error("No se pudieron guardar los datos:", error);
    }
}

// Recuperar información almacenada
function cargarDatos() {
    try {
        const datosGuardados = localStorage.getItem(
            CLAVE_ALMACENAMIENTO
        );

        if (!datosGuardados) return;

        const datos = JSON.parse(datosGuardados);

        if (
            Number.isInteger(datos.likes) &&
            datos.likes >= 0 &&
            Array.isArray(datos.registros)
        ) {
            likes = datos.likes;

            registros = datos.registros.filter(registro =>
                Number.isInteger(registro.numero) &&
                typeof registro.hora === "string"
            );
        }
    } catch (error) {
        console.error("Error al recuperar los datos:", error);
    }
}

// Actualizar contador y colores
function actualizarInterfaz() {
    textoContador.textContent = likes;

    const superaLimite = likes > 10;

    textoContador.classList.toggle("alto", superaLimite);
    tarjeta.classList.toggle("alto", superaLimite);
}

// Mostrar historial
function renderizarHistorial() {
    tablaRegistros.innerHTML = "";

    registros.forEach(registro => {
        const fila = document.createElement("tr");

        const celdaNumero = document.createElement("td");
        const celdaHora = document.createElement("td");

        celdaNumero.textContent = registro.numero;
        celdaHora.textContent = registro.hora;

        fila.append(celdaNumero, celdaHora);
        tablaRegistros.appendChild(fila);
    });
}

// Agregar like
function agregarLike() {
    likes++;

    registros.unshift({
        numero: likes,
        hora: obtenerHora()
    });

    actualizarInterfaz();
    renderizarHistorial();
    guardarDatos();
}

// Restar like
function restarLike() {
    if (likes === 0) return;

    likes--;
    registros.shift();

    actualizarInterfaz();
    renderizarHistorial();
    guardarDatos();
}

// Reiniciar contador
function reiniciarContador() {
    likes = 0;
    registros = [];

    actualizarInterfaz();
    renderizarHistorial();
    guardarDatos();
}

// Eventos
botonLike.addEventListener("click", agregarLike);
botonRestar.addEventListener("click", restarLike);
botonReiniciar.addEventListener("click", reiniciarContador);

// Recuperar datos al iniciar
cargarDatos();
actualizarInterfaz();
renderizarHistorial();
