// src/services/comunaService.js

const API_URL = "http://localhost/api/comunas";

export const fetchComunas = async () => {
    try {
        const response = await fetch('/api/comunas');
        if (!response.ok) {
            throw new Error("Error al obtener comunas");
        }
        const data = await response.json();



        return data.map((comuna) => {
            /*    console.log("Comuna Data:", comuna); */ // Verifica los datos de la comuna
            return {
                value: comuna.id,
                label: comuna.nombre,
                region_id: comuna.region_id, // Asegurar que venga el region_id
                region_name: comuna.region.nombre,
            };
        });
    } catch (error) {
        /*   console.error("Error en fetchComunas:", error); */
        return []; // Retorna un array vacío en caso de error
    }
};
