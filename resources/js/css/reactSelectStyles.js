// src/styles/reactSelectStyles.js

export const customStyles = {
    control: (provided) => ({
        ...provided,
        borderRadius: "0.375rem", // Bootstrap 5 border-radius
        borderColor: "#ced4da", // Bootstrap border color
        boxShadow: "none",
        "&:hover": { borderColor: "#86b7fe" }, // Hover Bootstrap 5
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: "0.375rem",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#e9ecef" : "white",
        color: "#212529",
    }),
};
