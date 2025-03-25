// src/services/comunaService.js

const API_URL = "http://localhost/api/comunas";

export const fetchComunas = async () => {
    try {
        const response = await fetch('/api/comunas');
        if (!response.ok) {
            throw new Error("Error al obtener comunas");
        }
        const data = await response.json();

        return data.map((comuna) => ({
            value: comuna.codigo, // Identificador único
            label: comuna.nombre, // Nombre a mostrar en el select
        }));
    } catch (error) {
        console.error("Error en fetchComunas:", error);
        return []; // Retorna un array vacío en caso de error
    }
};
