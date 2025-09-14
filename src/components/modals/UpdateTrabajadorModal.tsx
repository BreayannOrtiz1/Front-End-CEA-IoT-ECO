import { ModalCreateInTable } from "../common/ModalCreateInTable";

/**
 * Campos para actualizar 
 * El ID es requerido, los demás campos son opcionales
 */
const updateTrabajadorFields = [
    { name: "ID_Trabajador", label: "ID del Trabajador", required: true },
    { name: "Sexo", label: "Sexo", required: false },
    { name: "Rango_Edad", label: "Rango de edad", required: false },
    { name: "Cargo", label: "Cargo", required: false },

];

/**
 * Interfaz para el resultado de la operación
 */
interface OperationResult {
    ok: boolean;
    message: string;
    data?: any;
}

/**
 * Props del componente 
 */
interface UpdateTrabajadorModalProps {
    isOpen: boolean;                                      // Controla la visibilidad del modal
    onClose: () => void;                                 // Función para cerrar el modal
    onSave: (formData: any) => Promise<OperationResult>; // Callback para actualizar en la base de datos
    initialData?: any;                                   // Datos iniciales del nodo IoT a actualizar
}

/**
 * Componente modal específico para la actualización de Nodos IoT.
 * Requiere el ID del nodo y al menos un campo adicional para actualizar.
 */
export const UpdateTrabajadorModal = ({
    isOpen,
    onClose,
    onSave,
}: UpdateTrabajadorModalProps) => {
    /**
     * Función para validar y enviar los datos de actualización
     */
    const handleSave = async (formData: any): Promise<OperationResult> => {
        try {
            // Validar que existe el ID
            if (!formData.ID_Trabajador) {
                return {
                    ok: false,
                    message: "El ID del Nodo IoT es requerido",
                    data: null
                };
            }

            // Verificar que al menos un campo adicional tenga valor
            const hasUpdates = updateTrabajadorFields
                .filter(field => field.name !== 'ID_Trabajador')
                .some(field => formData[field.name]?.trim() !== '');

            if (!hasUpdates) {
                return {
                    ok: false,
                    message: "Debe proporcionar al menos un campo para actualizar",
                    data: null
                };
            }

            // Intentar actualizar los datos
            const result = await onSave(formData);
            return result;
        } catch (error: any) {
            return {
                ok: false,
                message: error.message || "Error al actualizar el nodo IoT",
                data: null
            };
        }
    };

    return (
        <ModalCreateInTable
            isOpen={isOpen}
            closeModal={onClose}
            onSave={handleSave}
            title="Actualizar Trabajador"
            description="Ingrese el ID del Trabajador y los campos que desea actualizar"
            fields={updateTrabajadorFields}
            entityName="Trabajador"
        />
    );
};