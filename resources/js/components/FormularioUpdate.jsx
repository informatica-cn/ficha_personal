import React, { useState, useRef, useEffect } from "react";
import { Toast } from 'primereact/toast';
import EstamentoSelect from "./EstamentoSelect";
import GradoSelect from "./GradoSelect";
import ComunaSelect from "./ComunaSelect";
import RegionSelect from "./RegionSelect";
import { customStyles } from "../css/reactSelectStyles";
import { actualizarFicha, crearFicha, getFichaByRut } from "../services/FichaService";
import * as rut from 'rut.js';
import Swal from 'sweetalert2';


const FormularioUpdate = ({ refreshData, hideModal, showToast }) => {
    const [formData, setFormData] = useState({
        rut: "",
        nombres: "",
        direccion: "",
        comuna_id: "",
        telefono: "",
        correo: "",
        urgencia: "",
        direccion_municipal: "",
        block: "",
        declaracion: ""
    });
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [errors, setErrors] = useState({});
    const [comunas, setComunas] = useState([]);



    const handleChange = (e) => {
        const { name } = e.target;
        let value = e.target.value;

        if (name === "rut") {
            value = rut.format(value);
        }

        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "rut") {
            const isValid = rut.validate(value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                rut: isValid ? null : ["RUT inválido"],
            }));
        }

        if (name === "direccion" && value.length > 2) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };


    // Validación cuando el campo "rut" pierde el foco
    const handleRutBlur = async () => {
        const isValid = rut.validate(formData.rut);
        if (!isValid) {
            // Si no es válido, limpiamos el campo
            setFormData({ ...formData, rut: "" });
        } else {
            // Si es válido, hacer la consulta para obtener los datos del RUT
            try {
                console.log('entroo...');
                const response = await getFichaByRut(formData.rut, toast); // Esta función consulta al backend
                if (response) {
                    console.log(response[0].comuna);
                    setFormData({
                        ...formData,
                        nombres: response[0].nombres ? response[0].nombres : "",
                        direccion: response[0].direccion ? response[0].direccion : "",
                        direccion_municipal: response[0].direccion_municipal ? response[0].direccion_municipal : "",
                        urgencia: response[0].urgencia ? response[0].urgencia : "",
                        correo: response[0].correo ? response[0].correo : "",
                        comuna_id: response[0].comuna ? response[0].comuna : "",
                        region_id: response[0].region ? response[0].region : "",
                        telefono: response[0].telefono ? response[0].telefono : "",
                        grado_id: response[0].grado_id ? response[0].grado_id : "",
                        estamento_id: response[0].estamento_id ? response[0].estamento_id : "",
                        block: response[0].block ? response[0].block : "",
                        declaracion: response[0].declaracion ? response[0].declaracion : "",
                        // Handle other fields similarly...
                    });
                }
            } catch (error) {
                setFormData({ ...formData, rut: "" });
                console.log('entro el error ')

            }
        }
    };

    const handleSelectGradoChange = (selectedOption) => {
        console.log("Seleccionado:", selectedOption);
        setFormData({ ...formData, grado_id: selectedOption.value });
    };

    const handleSelectComunaChange = (selectedOption) => {
        console.log("Comuna seleccionada:", selectedOption);

        // Extraemos el region_id de la comuna seleccionada
        const regionId = { value: selectedOption.region_id, label: selectedOption.region_name };

        const comunaId = { value: selectedOption.value, label: selectedOption.label };


        setFormData((prevFormData) => ({
            ...prevFormData,
            comuna_id: comunaId ? comunaId : "",
            region_id: regionId, // Guardamos el ID de la región
        }));


        console.log('form', formData)
    };

    const handleSelectRegionChange = (selectedOption) => {
        console.log("Región seleccionada:", selectedOption);
        setFormData({
            ...formData,
            region: selectedOption ? selectedOption.label : "",
        });
    };

    const handleSelectEstamentoChange = (selectedOption) => {
        console.log("Seleccionado:", selectedOption);
        setFormData({ ...formData, estamento_id: selectedOption.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await actualizarFicha(formData, refreshData, hideModal, toast, setErrors);
            setFormData({
                rut: "",
                nombres: "",
                direccion: "",
                comuna_id: "",
                telefono: "",
                correo: "",
                urgencia: "",
                direccion_municipal: "",
                block: "",
                declaro: "",
                declaracion: ""
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
                    display_name: `${street} ${number} ${comune} `.trim(), // Mostrar solo calle y número
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
        const { road, house_number } = address.fullData.address;
        const formattedAddress = `${road || ""} ${house_number || ""}`.trim();

        setFormData({ ...formData, direccion: formattedAddress });
        setSuggestions([]); // Ocultar sugerencias después de seleccionar
    };



    return (
        <div className="container-flud">
            <Toast ref={toast} />

            <form onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="rut" className="form-label">Rut</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.rut ? "is-invalid" : ""}`}
                                    id="rut"
                                    name="rut"
                                    value={formData.rut}
                                    onChange={handleChange}
                                    onBlur={handleRutBlur}
                                    placeholder="Ej: 12.345.678-9"
                                />
                                {errors.rut && <small className="text-danger">{errors.rut[0]}</small>}

                            </div>
                        </div>
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
                                    disabled={true}
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
                                <ComunaSelect value={formData.comuna_id} onChange={handleSelectComunaChange} />
                            </div>

                            <div className="col-md-6">

                                <RegionSelect
                                    value={formData.region_id}
                                    selectedRegionId={formData.region}
                                    onChange={handleSelectRegionChange}
                                />
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="block" className="form-label">Torre / block / Depto</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="block"
                                    name="block"
                                    value={formData.block}
                                    onChange={handleChange}
                                />
                                {errors.block && <small className="text-danger">{errors.block[0]}</small>}
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
                                <label htmlFor="correo" className="form-label">Correo particular</label>
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

                            <div className="col-md-12 pt-3 mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="declaracion"
                                        name="declaracion"
                                        checked={formData.declaracion}
                                        onChange={(e) => setFormData({ ...formData, declaracion: e.target.checked })}
                                    />
                                    <label className="form-check-label" htmlFor="miCheckbox">
                                        Declaro que la información proporcionada es completa y fidedigna, siendo de mi responsabilidad cualquier omisión o falsedad en lo informado en el presente acto
                                    </label>
                                </div>
                            </div>

                            <div className="row pt-2">
                                <div className="col-md-2">
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </form>

        </div>


    );
};

export default FormularioUpdate;
