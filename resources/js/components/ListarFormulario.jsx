import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2';
import { Dialog } from 'primereact/dialog';
import EditarFormulario from './EditarFormulario';
import './App.css'; // Asegúrate de importar tu archivo de estilos


const ListarFormulario = ({ data, showModal, refreshDataById }) => {
    const [first, setFirst] = useState(0); // Control del primer elemento de la página
    const [rows, setRows] = useState(10);  // Cantidad de filas por página
    const [globalFilter, setGlobalFilter] = useState('');
    const [tableData, setTableData] = useState(data); // Estado para los datos de la tabla
    const [selectedFicha, setSelectedFicha] = useState(null); // Estado para la ficha a editar
    const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar el modal de edición


    const myToast = useRef(null);
    useEffect(() => {
        setTableData(data);
    }, [data]);

    useEffect(() => {
        /* console.log('Estado actualizado de la ficha:', selectedFicha); */
    }, [selectedFicha]);

    const showToast = (severityValue, summaryValue, detailValue) => {
        myToast.current.show({ severity: severityValue, summary: summaryValue, detail: detailValue });
    }



    const columns = [
        { name: "Nombre", selector: (row) => row.nombres, sortable: true },
        { name: "Dirección", selector: (row) => row.direccion, sortable: true },
        { name: "Teléfono", selector: (row) => row.telefono, sortable: true },
        { name: "Correo", selector: (row) => row.correo, sortable: true },
        { name: "Urgencia", selector: (row) => row.urgencia, sortable: true },
        { name: "Grado", selector: (row) => row.urgencia, sortable: true },
    ];

    // Función para manejar el cambio de página
    const onPageChange = (event) => {
        setFirst(event.first); // Cambiar el primer elemento visible
        setRows(event.rows);   // Cambiar la cantidad de filas por página
    };

    const onGlobalFilterChange = (e) => {
        setGlobalFilter(e.target.value);
    };

    // Función para eliminar la ficha
    const deleteFicha = async (id) => {
        try {
            // Mostrar confirmación antes de eliminar
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no se puede deshacer!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            // Si el usuario confirma la eliminación
            if (result.isConfirmed) {
                // Realizar la solicitud de eliminación (ajusta la URL según tu API)
                const response = await fetch(`/api/ficha/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Obtener los datos de la respuesta
                    const data = await response.json();

                    /*         console.log(data);
         */
                    if (data.id) {
                        // Filtrar los datos para eliminar el elemento con el id retornado
                        /*  console.log("Antes de eliminar:", tableData); */
                        setTableData((prevData) => {
                            /*        console.log("El id a eliminar ", data.id) */
                            const newData = prevData.filter(item => item.id !== Number(data.id));
                            /*      console.log("Después de eliminar:", newData); */
                            return newData;
                        });

                        showToast('success', 'Éxito', 'Ficha eliminada correctamente');
                    }
                } else {
                    showToast('error', 'Error', 'Hubo un problema al eliminar la ficha');
                }
            }
        } catch (error) {
            console.error("Error al eliminar la ficha", error);
            showToast('error', 'Error', 'Hubo un problema al procesar la solicitud');
        }
    };

    const handleEdit = (ficha) => {
        /*  console.log('fichaaaa.', ficha) */

        setSelectedFicha(ficha);
        /*         console.log('estado de la ficha', selectedFicha); */
        setShowEditModal(true); // Muestra el modal de edición
    };

    return (
        <div className="container ">
            <Toast ref={myToast} />

            <div className="row">
                <div className="mb-3 col-md-10">

                    <InputText
                        className="form-control"
                        value={globalFilter}
                        onChange={onGlobalFilterChange}
                        placeholder="Buscar en toda la tabla..."
                    />

                </div>
                <div className="col-md-2 text-end">
                    <button className='btn btn-success' onClick={showModal}>
                        Agregar
                    </button>
                </div>
            </div>
            <DataTable
                value={tableData}
                paginator
                rows={rows}
                first={first}
                onPage={onPageChange}
                globalFilter={globalFilter}
                tableStyle={{ minWidth: '50rem' }}
                stripedRows
            >
                <Column field="id" header="ID" sortable headerClassName="header-column" />
                <Column field="rut" header="Rut" sortable headerClassName="header-column" />
                <Column field="nombres" header="Nombre" sortable headerClassName="header-column" />
                <Column field="direccion" header="Dirección" sortable headerClassName="header-column" />
                <Column field="telefono" header="Teléfono" sortable headerClassName="header-column" />
                <Column field="correo" header="Correo" sortable headerClassName="header-column" />
                <Column field="direccion_municipal" header="Dirección municipal" sortable headerClassName="header-column" />
                <Column field="grado" header="Grado" sortable headerClassName="header-column" />
                <Column field="estamento" header="Estamento" sortable headerClassName="header-column" />
                <Column
                    headerClassName="header-column"
                    header="Acciones"
                    body={(rowData) => (
                        <div className="d-flex justify-content-between  align-items-center w-100 ">
                            {/*   <button className="btn btn-danger btn-radius mx-2" onClick={() => deleteFicha(rowData.id)}>
                <i className="pi pi-trash" style={{ color: '#fff' }}></i>
            </button> */}

                            <button className="btn btn-warning mx-2" onClick={() => handleEdit(rowData)}>
                                <i className="pi pi-pencil" style={{ color: '#fff' }}></i>
                            </button>
                        </div>
                    )}
                />
            </DataTable>
            <Dialog
                visible={showEditModal}
                style={{ width: '50vw' }}
                header="Editar Ficha"
                modal
                onHide={() => setShowEditModal(false)}
                onShow={() => console.log('Ficha en el modal:', selectedFicha)}
            >
                <EditarFormulario
                    ficha={selectedFicha}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={(updatedFicha) => {
                        // Actualiza el estado local
                        setTableData((prevData) =>
                            prevData.map((item) => (item.id === updatedFicha.id ? updatedFicha : item))
                        );
                        // Actualiza el estado global
                        refreshDataById(updatedFicha);
                        // Cierra el modal
                        setShowEditModal(false);
                    }}
                    refreshDataById={refreshDataById}
                />
            </Dialog>
        </div>
    );
};

export default ListarFormulario;
