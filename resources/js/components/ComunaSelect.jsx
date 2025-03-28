import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fetchComunas } from "../services/comunaService";
import { customStyles } from "../css/reactSelectStyles";

const ComunaSelect = ({ value,onChange, disabled }) => {
    const [comunas, setComunas] = useState([]);

    useEffect(() => {
        const loadComunas = async () => {
            const data = await fetchComunas();
            setComunas(data);
        };
        loadComunas();
    }, []);

    const handleChange = (selected) => {
        if (onChange) {
            onChange(selected); // Enviamos la comuna con su region_id
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label">Comuna</label>
            <Select
                name="comuna"
                value={value}
                options={comunas}
                onChange={handleChange}
                placeholder="Seleccione una comuna"
                styles={customStyles}
                isDisabled={disabled}
                classNamePrefix="react-select"
            />
        </div>
    );
};

export default ComunaSelect;
