// src/services/comunaService.js

const API_URL = "http://localhost/api/comunas";

export const fetchRegiones = async (parametro = "") => {
    try {
        const url = parametro ? `/api/regiones/${parametro}` : "/api/regiones";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al obtener regiones");
        }
        const data = await response.json();

        console.log('datos de la region',data);

        return {
            value: data.id, // Identificador único
            label: data.nombre, // Nombre de la región
        };
    } catch (error) {
        console.error("Error en fetchComunas:", error);
        return []; // Retorna un array vacío en caso de error
    }
};
