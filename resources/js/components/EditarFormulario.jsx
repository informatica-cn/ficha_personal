import React, { useState, useEffect, useRef } from "react";
import { Toast } from 'primereact/toast';
import GradoSelect from "./GradoSelect";
import EstamentoSelect from "./EstamentoSelect";
import ComunaSelect from "./ComunaSelect";
import { actualizarFicha } from "../services/FichaService";
import Swal from 'sweetalert2';
const EditarFormulario = ({ ficha, onClose, onUpdate, refreshDataById }) => {


    const [formData, setFormData] = useState({ ...ficha });

    const [showAlert, setShowAlert] = useState(false);



    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (ficha) {

            setFormData({
                ...ficha,
                grado_id: ficha.grado_id || null,
                estamento_id: ficha.estamento_id || null,
            });
        }
    }, [ficha]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (name === "direccion" && value.length > 2) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };


    const handleSelectGradoChange = (selectedOption) => {

        setFormData((prevState) => ({
            ...prevState,
            grado_id: selectedOption ? selectedOption.value : null, // Asegura que no sea undefined
        }));
    };
    const handleSelectEstamentoChange = (selectedOption) => {
        console.log("Seleccionado:", selectedOption);
        setFormData((prevState) => ({
            ...prevState,
            estamento_id: selectedOption ? selectedOption.value : null,
        }));
    };

    const handleSelectComunaChange = (selectedOption) => {
        console.log("Seleccionado:", selectedOption);
        setFormData({ ...formData, comuna: selectedOption.label });
    };


    const fetchSuggestions = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&countrycodes=CL`
            );
            const data = await response.json();

            if (data.length === 0) {
               /*  alert('no se encontraron resultados'); */
               toast.current.show({
                severity: "warn",
                summary: "Error",
                detail: "Dirección no encontrada!",
                life: 2000,
            });
                //setShowAlert(true);
                setFormData({ ...formData, direccion: "" }); // Limpia el campo de dirección
                setSuggestions([]);
                return;
            }

            const uniqueAddresses = new Set();
            const formattedSuggestions = [];

            data.forEach((item) => {
                const street = item.address.road || item.address.hamlet || "";
                const comune = item.address.town || item.address.suburb || "";
                const state = item.address.state || "";
                const number = item.address.house_number || "";

                // Crear clave única
                const displayName = `${street} ${number} ${comune} ${state}`.trim();

                if (!uniqueAddresses.has(displayName)) {
                    uniqueAddresses.add(displayName);
                    formattedSuggestions.push({
                        display_name: displayName,
                        place_id: item.place_id,
                        fullData: item,
                    });
                }
            });

            setSuggestions(formattedSuggestions);
        } catch (error) {
            console.error("Error al obtener sugerencias:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showAlert) {
            Swal.fire({
                title: "Sin resultados",
                text: "No se encontraron direcciones coincidentes. Intente nuevamente.",
                icon: "warning",
                confirmButtonText: "Aceptar",
            }).then(() => {
                setShowAlert(false);
            });
        }
    }, [showAlert]);

    const handleSelect = (address) => {
        setFormData({ ...formData, direccion: address.display_name });
        setSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        await actualizarFicha(formData,refreshDataById,toast,onClose); // Llamando la función que viene por prop

        setLoading(false);
    };
    return (
        <div className="container-fluid">
            <Toast ref={toast} />
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                        <input type="text" className="form-control" id="nombre" name="nombres" value={formData.nombres} onChange={handleChange} disabled={true} />
                        {errors.nombres && <small className="text-danger">{errors.nombres[0]}</small>}
                    </div>
                    <div className="col-md-6" style={{ position: 'relative' }}>
                        <label htmlFor="direccion" className="form-label">Dirección Particular</label>
                        {loading && <div className="mt-1 text-primary">Cargando direcciones...</div>}
                        {suggestions.length > 0 && !loading && (
                            <ul className="list-group mt-1" style={{ position: 'absolute', width: '100%', top: '100%', left: 0, zIndex: 10 }}>
                                {suggestions.map((s) => (
                                    <li key={s.place_id} className="list-group-item list-group-item-action" onClick={() => handleSelect(s)} style={{ cursor: "pointer" }}>
                                        {s.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Escribe una dirección..." />
                        {errors.direccion && <small className="text-danger">{errors.direccion[0]}</small>}
                    </div>

                    <div className="col-md-6">
                        <ComunaSelect value={formData.comuna} onChange={handleSelectComunaChange} disabled={false} />
                    </div>


                    <div className="col-md-6">
                        <label htmlFor="direccion" className="form-label">Dirección municipal</label>
                        <input type="text" className="form-control" name="direccion_municipal" onChange={handleChange} value={formData.direccion_municipal} disabled={true} />
                    </div>
                    <div className="col-md-6">
                        <GradoSelect value={formData.grado_id} onChange={handleSelectGradoChange} disabled={true} />
                    </div>
                    <div className="col-md-6">

                        <EstamentoSelect value={formData.estamento_id} onChange={handleSelectEstamentoChange} disabled={true} />
                    </div>


                    <div className="col-md-6">
                        <label htmlFor="telefono" className="form-label">Teléfono Particular</label>
                        <input type="text" className="form-control" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
                        {errors.telefono && <small className="text-danger">{errors.telefono[0]}</small>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                        <input type="email" className="form-control" id="correo" name="correo" value={formData.correo} onChange={handleChange} />
                        {errors.correo && <small className="text-danger">{errors.correo[0]}</small>}
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="urgencia" className="form-label">En caso de urgencia avisar a</label>
                        <textarea className="form-control" id="urgencia" name="urgencia" value={formData.urgencia} onChange={handleChange}></textarea>
                        {errors.urgencia && <small className="text-danger">{errors.urgencia[0]}</small>}
                    </div>
                    <div className="row pt-2">
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary">Actualizar</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditarFormulario;
