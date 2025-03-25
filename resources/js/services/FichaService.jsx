export const crearFicha = async (formData, refreshData, hideModal, toast) => {
    try {
        const response = await fetch("/api/ficha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const result = await response.json();
            if (result.errors) {
                throw result.errors;
            }
            throw new Error("Error al crear la ficha");
        }

        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
            refreshData([]);
            refreshData(result.data);
        }

        toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Ficha creada con éxito!",
            life: 2000,
        });

        setTimeout(() => {
            hideModal();
        }, 2000);
    } catch (error) {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Hubo un problema al crear la ficha.",
            life: 3000,
        });
    }
};


export const actualizarFicha = async (datosFicha,refreshDataById,toast,onClose) => {
    try {
        const response = await fetch(`/api/ficha/${datosFicha.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosFicha),
        });

        if (!response.ok) {
            const result = await response.json();
            if (result.errors) {
                setErrors(result.errors);
            }
            throw new Error('Error al actualizar la ficha');
        }

        const result = await response.json();
        if (result.ficha) {
            refreshDataById(result.ficha);
        }

        toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Ficha actualizada con éxito!",
            life: 1000,
        });

        setTimeout(() => {
            onClose();
        }, 1000);
    } catch (error) {
        console.error("Error al actualizar la ficha:", error);
    }
};

