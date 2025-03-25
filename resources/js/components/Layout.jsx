import React, { useState, useEffect } from 'react';
import Formulario from './Formulario';
import ListarFormulario from './ListarFormulario';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const Layout = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Función para cargar los datos en el estado
    const fetchFichas = async () => {
        try {
            const response = await axios({
                method: "GET", // 🔥 Asegura que la solicitud sea GET
                url: "/api/ficha",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    // Actualizar los datos tras el envío del formulario
    const refreshData = (newFicha) => {
        setData(() => {
            // Reemplazamos los datos antiguos con los nuevos
            return Array.isArray(newFicha) ? [...newFicha] : [newFicha];
        });
    };

    const refreshDataById = (updatedFicha) => {

        setData((prevData) =>
            prevData.map((item) =>
                item.id === updatedFicha.id ? updatedFicha : item
            )
        );
        console.log('update ficha', data)
    };


    useEffect(() => {
        fetchFichas(); // Llama a la función para obtener los datos iniciales
    }, []);

    const showModal = () => {
        setIsModalVisible(true); // Muestra la modal
    };

    const hideModal = () => {
        setIsModalVisible(false); // Oculta la modal
    };
    const showToast = (severityValue, summaryValue, detailValue) => {
        toast.current.show({ severity: severityValue, summary: summaryValue, detail: detailValue });
    }

    return (
        <div className='pt-5'>
            {/* Aquí mostramos el botón para abrir la modal */}
            <h1 className='text-center'>Formulario fichas</h1>
            {/*   <button onClick={showModal} className="btn btn-primary mb-3">
                Agregar Ficha
            </button> */}

            {/* Modal */}
            <Dialog
                header="Formulario de Ingreso"
                visible={isModalVisible}
                onHide={hideModal}
                breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                style={{ width: '50vw' }}
            >
                {/* Pasa la función para refrescar los datos a Formulario */}
                <Formulario refreshData={refreshData} hideModal={hideModal} />
            </Dialog>
            <ListarFormulario data={data} fetchFichas={fetchFichas} showModal={showModal} refreshDataById={refreshDataById} /> {/* Pasa los datos al componente de listado */}
        </div>
    );
};


export default Layout;
