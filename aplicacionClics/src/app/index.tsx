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

  return (
    <View style={estilos.body}>
      <View style={estilos.container}>
        {/* Título y descripción */}
        <Text style={estilos.h1}>Interactividad con el DOM</Text>
        <Text style={estilos.description}>
          Haz clic en el botón para incrementar el contador y registrar la hora
          exacta del evento en la tabla.
        </Text>

        {/* Contador dinámico */}
        <Text style={estilos.counterBox}>{contador}</Text>

        {/* Botón disparador de eventos */}
        <TouchableOpacity style={estilos.btnClick} onPress={incrementarContador}>
          <Text style={estilos.btnText}>¡Haz Clic Aquí!</Text>
        </TouchableOpacity>

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
  body: { flex: 1, backgroundColor: "#f4f7f6", justifyContent: "center", alignItems: "center", padding: 16 },
  container: { width: "100%", backgroundColor: "#ffffff", borderRadius: 16, padding: 24, alignItems: "center" },
  h1: { fontSize: 24, fontWeight: "800" },
  description: { fontSize: 14, textAlign: "center" },
  counterBox: { fontSize: 64, fontWeight: "800", color: "#3498db" },
  btnClick: { backgroundColor: "#2ecc71", padding: 14, borderRadius: 8 },
  btnText: { color: "#ffffff", fontWeight: "bold" },
  tableContainer: { width: "100%", marginTop: 24 },
  tableHeader: { flexDirection: "row" },
  tableBody: { maxHeight: 220 },
  tr: { flexDirection: "row" },
  trEven: { backgroundColor: "#fafbfb" },
  th: { fontWeight: "600", textAlign: "center" },
  td: { textAlign: "center" },
  cellNumero: { flex: 1 },
  cellHora: { flex: 1 },
});
