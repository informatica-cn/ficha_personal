import React, { useState, useEffect,useRef } from 'react';
import Formulario from './Formulario';
import ListarFormulario from './ListarFormulario';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const LayoutAdmin = () => {
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
           <div className="mb-5">
           <Dialog
                header="Declaración jurada antecedentes"
                visible={isModalVisible}
                onHide={hideModal}
                breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                style={{ width: '50vw' }}
            >
                <Formulario refreshData={refreshData} hideModal={hideModal} toast={toast} />
            </Dialog>
           </div>
            <ListarFormulario
                data={data}
                fetchFichas={fetchFichas}
                showModal={showModal}
                refreshDataById={refreshDataById}
            />
        </div>
    );
};

export default LayoutAdmin;


