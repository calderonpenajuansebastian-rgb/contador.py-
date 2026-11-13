import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Registro = { id: string; numero: number; hora: string };

export default function App() {
  const [contador, setContador] = useState(0);
  const [registros, setRegistros] = useState<Registro[]>([]);

  const incrementarContador = () => {
    const nuevoContador = contador + 1;
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString();

    // Actualizamos el contador
    setContador(nuevoContador);

    // Creamos el nuevo registro y lo anteponemos (equivalente a prepend)
    const nuevoRegistro: Registro = {
      id: Date.now().toString() + "-" + nuevoContador,
      numero: nuevoContador,
      hora: horaFormateada,
    };

    setRegistros([nuevoRegistro, ...registros]);
  };

  // Reto 1: restar y reiniciar (solo cambian el estado)
  const restarContador = () => {
    if (contador > 0) {
      setContador(contador - 1);
      setRegistros(registros.slice(1)); // quita el más reciente
    }
  };

  const reiniciar = () => {
    setContador(0);
    setRegistros([]);
  };

  // Reto 2: si supera 10, cambian los colores (reactividad)
  const supera = contador > 10;

  return (
    <View style={estilos.body}>
      <View style={[estilos.container, supera && { backgroundColor: "#fff5f5" }]}>
        {/* Título y descripción */}
        <Text style={estilos.h1}>Interactividad con el DOM</Text>
        <Text style={estilos.description}>
          Haz clic en el botón para incrementar el contador y registrar la hora
          exacta del evento en la tabla.
        </Text>

        {/* Contador dinámico */}
        <Text style={[estilos.counterBox, supera && { color: "#e74c3c" }]}>
          {contador}
        </Text>

        {/* Botón disparador de eventos */}
        <TouchableOpacity style={estilos.btnClick} onPress={incrementarContador}>
          <Text style={estilos.btnText}>¡Haz Clic Aquí!</Text>
        </TouchableOpacity>

        {/* Reto 1: botones adicionales */}
        <View style={estilos.fila}>
          <TouchableOpacity style={[estilos.btnClick, estilos.btnRojo]} onPress={restarContador}>
            <Text style={estilos.btnText}>Restar Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[estilos.btnClick, estilos.btnGris]} onPress={reiniciar}>
            <Text style={estilos.btnText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>

        {/* Tabla de registros */}
        <View style={estilos.tableContainer}>
          {/* Cabecera de la tabla */}
          <View style={estilos.tableHeader}>
            <Text style={[estilos.th, estilos.cellNumero]}>Nº Clic</Text>
            <Text style={[estilos.th, estilos.cellHora]}>Hora</Text>
          </View>

          {/* Cuerpo de la tabla con scroll */}
          <ScrollView style={estilos.tableBody}>
            {registros.map((item, index) => (
              <View
                key={item.id}
                style={[estilos.tr, index % 2 === 0 ? estilos.trEven : null]}
              >
                <Text style={[estilos.td, estilos.cellNumero]}>
                  {item.numero}
                </Text>
                <Text style={[estilos.td, estilos.cellHora]}>{item.hora}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#f4f7f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "95%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 6, // sombra en Android
    shadowColor: "#000", // sombra en iOS
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  h1: { fontSize: 24, fontWeight: "800", color: "#2c3e50", textAlign: "center" },
  description: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  counterBox: { fontSize: 64, fontWeight: "800", color: "#3498db", marginVertical: 8 },
  btnClick: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    elevation: 4,
  },
  btnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  tableContainer: {
    width: "100%",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#e5e8e8",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: { flexDirection: "row", backgroundColor: "#f8f9f9" },
  tableBody: { maxHeight: 220 },
  tr: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#e5e8e8" },
  trEven: { backgroundColor: "#fafbfb" },
  th: { paddingVertical: 12, fontWeight: "600", color: "#7f8c8d", textAlign: "center" },
  td: { paddingVertical: 12, color: "#2c3e50", textAlign: "center" },
  cellNumero: { flex: 1 },
  cellHora: { flex: 1 },
  fila: { flexDirection: "row", gap: 12, marginTop: 12 },
  btnRojo: { backgroundColor: "#e74c3c" },
  btnGris: { backgroundColor: "#95a5a6" },
});
