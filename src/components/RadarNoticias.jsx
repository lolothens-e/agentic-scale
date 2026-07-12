// src/components/RadarNoticias.jsx
import { useMarketNews } from "../hooks/useMarketNews";

function RadarNoticias() {
  const { noticias, loading, error, buscar } = useMarketNews();

  return (
    <div>
      <button onClick={() => buscar({ asset: "Bitcoin", daysAgo: 5 })}>
        Buscar noticias
      </button>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {noticias.map((n) => (
          <li key={n.id}>
            <strong>{n.titulo}</strong> — {n.fuente} — {n.fecha}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RadarNoticias; // ← esta línea es la que faltaba mostrarte