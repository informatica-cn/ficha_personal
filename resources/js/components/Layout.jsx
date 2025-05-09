import React, { useState, useEffect,useRef } from 'react';
import FormularioUpdate from './FormularioUpdate';
import ListarFormulario from './ListarFormulario';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const Layout = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const toast = useRef(null);

    const fetchFichas = async () => {
        try {
            const response = await axios.get("/api/ficha", {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudieron cargar las fichas.",
            });
        }
    };

    const refreshData = (newFicha) => {
        setData(Array.isArray(newFicha) ? [...newFicha] : [newFicha]);
    };

    const refreshDataById = (updatedFicha) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === updatedFicha.id ? updatedFicha : item
            )
        );
    };

    useEffect(() => {
        fetchFichas();
    }, []);

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);

    return (
        <div className="pt-5">
            <h1 className="text-center">Declaración jurada antecedentes</h1>
           <div className="container mb-5">
           <FormularioUpdate refreshData={refreshData} hideModal={hideModal} toast={toast} />
           </div>

        </div>
    );
};

export default Layout;
