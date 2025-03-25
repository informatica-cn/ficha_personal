import React, { useState } from "react";
import Select from "react-select";
import { customStyles } from "../css/reactSelectStyles";

const GradoSelect = ({ value, onChange, disabled }) => {
    const options = [
        { value: "", label: "Seleccione un grado", isDisabled: true },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "13", label: "13" },
        { value: "14", label: "14" },
        { value: "15", label: "15" },
        { value: "16", label: "16" },
        { value: "17", label: "17" },
        { value: "18", label: "18" },
    ];

    const selectedOption = options.find((option) => option.value == value);


    /*   const handleChange = (selected) => {
        setSelectedOption(selected);
        if (onChange) {
          onChange(selected);
        }
      };
     */
    // Estilos personalizados para que coincidan con Bootstrap 5

    return (
        <div className="mb-3">
            <label className="form-label">Grado</label>
            <Select
                name="grado_id"
                options={options}
                value={selectedOption}
                onChange={onChange}
                placeholder="Seleccione un grado"
                styles={customStyles}
                isDisabled={disabled}
                classNamePrefix="react-select"
            />
        </div>
    );
};

export default GradoSelect;
