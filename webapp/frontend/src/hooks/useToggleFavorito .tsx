import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useFavorito(idPublicacion: number) {
  const [isFavorito, setIsFavorito] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get('token')
  useEffect(() => {
    const fetchEstado = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/guardar/estado/${idPublicacion}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIsFavorito(data.es_favorito);
      } catch (err) {
        console.error("Error al verificar favorito:", err);
      }
    };

    fetchEstado();
  }, [idPublicacion]);

  const toggleFavorito = async () => {
    if (!token || isFavorito === null) return;

    setLoading(true);

    try {
      if (isFavorito) {
        await fetch(`${API_URL}/api/guardar/borrarPublicacion/${idPublicacion}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorito(false);
      } else {
        await fetch(`${API_URL}/api/guardar/guardarPublicacion`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_publicacion: idPublicacion }),
        });
        setIsFavorito(true);
      }
    } catch (err) {
      console.error("Error en toggleFavorito:", err);
    } finally {
      setLoading(false);
    }
  };

  return { isFavorito, toggleFavorito, loading };
}
