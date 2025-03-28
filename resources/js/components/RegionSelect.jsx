import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fetchRegiones } from "../services/regionService";
import { customStyles } from "../css/reactSelectStyles";

const RegionSelect = ({ selectedRegionId, onChange, disabled }) => {
    const [regiones, setRegiones] = useState([]);

    useEffect(() => {
        const loadRegiones = async () => {
            if (selectedRegionId) {
                const data = await fetchRegiones(selectedRegionId);
                console.log('region..', data);
                setRegiones(data ? [data] : []); // Convertimos en array si hay datos
            } else {
                setRegiones([]);
            }
        };
        loadRegiones();
    }, [selectedRegionId]);
    return (
        <div className="mb-3">
            <label className="form-label">Región</label>
            <Select
                name="region"
                options={regiones}
                onChange={onChange}
                placeholder="Seleccione una región"
                styles={customStyles}
                isDisabled={disabled}
                classNamePrefix="react-select"
            />
        </div>
    );
};

export default RegionSelect;
