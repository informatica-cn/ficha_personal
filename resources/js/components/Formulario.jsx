import React, { useState, useRef, useEffect } from "react";
import { Toast } from 'primereact/toast';
import EstamentoSelect from "./EstamentoSelect";
import GradoSelect from "./GradoSelect";
import ComunaSelect from "./ComunaSelect";
import { customStyles } from "../css/reactSelectStyles";
import { crearFicha } from "../services/FichaService";
const Formulario = ({ refreshData, hideModal, showToast }) => {
    const [formData, setFormData] = useState({
        nombres: "",
        direccion: "",
        comuna: "",
        telefono: "",
        correo: "",
        urgencia: "",
        direccion_municipal: "",
    });
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [errors, setErrors] = useState({});
    const [comunas, setComunas] = useState([]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "direccion" && value.length > 2) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };


    const handleSelectGradoChange = (selectedOption) => {
        console.log("Seleccionado:", selectedOption);
        setFormData({ ...formData, grado_id: selectedOption.value });
    };

    const handleSelectComunaChange = (selectedOption) => {
        console.log("Seleccionado:", selectedOption);
        setFormData({ ...formData, comuna: selectedOption.label });
    };
    const handleSelectEstamentoChange = (selectedOption) => {
        console.log("Seleccionado:", selectedOption);
        setFormData({ ...formData, estamento_id: selectedOption.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await crearFicha(formData, refreshData, hideModal, toast);
            setFormData({
                nombres: "",
                direccion: "",
                comuna: "",
                telefono: "",
                correo: "",
                urgencia: "",
                direccion_municipal: "",
            });
        } catch (error) {
            console.error("Error al crear la ficha:", error);
            setErrors(error); // Capturar errores del backend
        }
    };





    const fetchSuggestions = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&countrycodes=CL`
            );
            const data = await response.json();
        /*     if (data.length === 0) {

                toast.current.show({
                 severity: "warn",
                 summary: "Error",
                 detail: "Dirección no encontrada!",
                 life: 2000,
             });

             setFormData({ ...formData, direccion: "" });
             setSuggestions([]);
             return;
            } */


            // Filtrar solo calle y número
            const formattedSuggestions = data.map((item) => {

                const street = item.address.road || item.address.hamlet || "";
                const comune = item.address.town || item.address.suburb || "";
                const state = item.address.state || "";
                const number = item.address.house_number || "";
                return {
                    display_name: `${street} ${number} ${comune} ${state} `.trim(), // Mostrar solo calle y número
                    place_id: item.place_id, // Asegúrate de tener un identificador único
                    fullData: item, // Guardamos la data completa por si la necesitas
                };
            });

            setSuggestions(formattedSuggestions);
            setLoading(false);

        } catch (error) {
            console.error("Error al obtener sugerencias:", error);
        } finally {
            // Desactivar loading después de la solicitud
        }
    };

    const handleSelect = (address) => {
        setFormData({ ...formData, direccion: address.display_name });
        setSuggestions([]); // Ocultar sugerencias después de seleccionar
    };



    return (
        <div className="container-flud">
            <Toast ref={toast} />

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                        />
                        {errors.nombres && <small className="text-danger">{errors.nombres[0]}</small>}
                    </div>

                    <div className="col-md-6" style={{ position: 'relative' }}>
                        <label htmlFor="direccion" className="form-label">Dirección Particular</label>

                        {loading && <div className="mt-1 text-primary">Cargando direcciones...</div>}

                        {/* Mostrar sugerencias solo cuando hay datos y no está cargando */}
                        {suggestions.length > 0 && !loading && (
                            <ul className="list-group mt-1" style={{ position: 'absolute', width: '100%', top: '100%', left: 0, zIndex: 10 }}>
                                {suggestions.map((s) => (
                                    <li
                                        key={s.place_id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSelect(s)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {s.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <input
                            type="text"
                            className="form-control"
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Escribe una dirección..."
                        />
                        {errors.direccion && <small className="text-danger">{errors.direccion[0]}</small>}
                    </div>

                    <div className="col-md-6">
                        <ComunaSelect onChange={handleSelectComunaChange} />
                    </div>

                    {/* <div className="col-md-6">
                        <label htmlFor="comuna" className="form-label">
                            Comuna
                        </label>
                        <select
                            className="form-control"
                            id="comuna"
                            name="comuna"
                            value={formData.comuna}
                            onChange={handleSelectComuna}
                        >
                            <option value="">Selecciona una comuna</option>
                            {comunas.map((comuna, index) => (
                                <option key={index} value={comuna}>
                                    {comuna}
                                </option>
                            ))}
                        </select>
                    </div> */}

                    <div className="col-md-6">
                        <label htmlFor="direccion" className="form-label">Dirección municipal</label>
                        <input type="text" className="form-control" name="direccion_municipal" onChange={handleChange} value={formData.direccion_municipal} />
                    </div>
                    <div className="col-md-6">
                        <GradoSelect onChange={handleSelectGradoChange} />
                    </div>
                    <div className="col-md-6">

                        <EstamentoSelect onChange={handleSelectEstamentoChange} />
                    </div>



                    <div className="col-md-6">
                        <label htmlFor="telefono" className="form-label">Teléfono Particular</label>
                        <input
                            type="text"
                            className="form-control"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        {errors.telefono && <small className="text-danger">{errors.telefono[0]}</small>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                        />
                        {errors.correo && <small className="text-danger">{errors.correo[0]}</small>}
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="urgencia" className="form-label">En caso de urgencia avisar a</label>
                        <textarea
                            className="form-control"
                            id="urgencia"
                            name="urgencia"
                            value={formData.urgencia}
                            onChange={handleChange}
                        ></textarea>
                        {errors.urgencia && <small className="text-danger">{errors.urgencia[0]}</small>}
                    </div>

                    <div className="row pt-2">
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </div>
                    </div>
                </div>
            </form>

        </div>


    );
};

export default Formulario;
