import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fetchComunas } from "../services/comunaService";
import { customStyles } from "../css/reactSelectStyles";

const ComunaSelect = ({ value, onChange, disabled }) => {
    const [comunas, setComunas] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const loadComunas = async () => {
            const data = await fetchComunas();
            setComunas(data);
        };

        loadComunas();
    }, []);

     const selectedOptionValue = comunas.find((option) => option.label == value);


    const handleChange = (selected) => {
        setSelectedOption(selected);
        if (onChange) {
            onChange(selected);
        }
    };



    return (
        <div className="mb-3">
            <label className="form-label">Comuna</label>
            <Select
                name="comuna"
                options={comunas}
                value={selectedOptionValue}
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
