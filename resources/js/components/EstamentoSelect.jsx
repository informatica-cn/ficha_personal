import React, { useState } from "react";
import Select from "react-select";
import { customStyles } from "../css/reactSelectStyles";
const EstamentoSelect = ({ value, onChange, disabled }) => {
    const options = [
        { value: "", label: "Seleccione un estamento", isDisabled: true },
        { value: "1", label: "Auxiliar" },
        { value: "2", label: "Administrativo" },
        { value: "3", label: "Técnico" },
        { value: "4", label: "Jefatura" },
        { value: "5", label: "Profesional" },
        { value: "6", label: "Directivo" },
    ];

    /*   const [selectedOption, setSelectedOption] = useState(null); */

    const selectedOptionValue = options.find((option) => option.value == value);


    return (
        <div className="mb-3">
            <label className="form-label">Estamento</label>
            <Select
                options={options}
                value={selectedOptionValue}
                name="estamento_id"
                onChange={onChange}
                placeholder="Seleccione un estamento"
                styles={customStyles}
                isDisabled={disabled}
                classNamePrefix="react-select"
            />
        </div>
    );
};

export default EstamentoSelect;
