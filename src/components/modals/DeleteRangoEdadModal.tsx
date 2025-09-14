import { useState } from 'react';
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";

/**
 * Interfaz para el resultado de la operación
 */
interface OperationResult {
    ok: boolean;
    message: string;
    data?: any;
}

/**
 * Props para el modal de eliminación
 */
interface DeleteRangoEdadModalProps {
    isOpen: boolean;                                        // Controla la visibilidad del modal
    onClose: () => void;                                   // Función para cerrar el modal
    onConfirm: (data: any) => Promise<OperationResult>;    // Callback para eliminar en la base de datos
    rangoEdadData?: {                                        // Datos del nodo IoT a eliminar (opcional)
        RangoEdad?: string | number;
    };
}

/**
 * Modal de confirmación para eliminar
 * Permite al usuario ingresar el ID del  a eliminar y muestra información adicional si está disponible.
 */
export const DeleteRangoEdadModal = ({
    isOpen,
    onClose,
    onConfirm,
    rangoEdadData
}: DeleteRangoEdadModalProps) => {
    // Estado para manejar el ID ingresado por el usuario
    const [rangoEdadId, setRangoEdadId] = useState(rangoEdadData?.RangoEdad?.toString() || '');
    // Estado para manejar el proceso de eliminación
    const [isLoading, setIsLoading] = useState(false);
    // Estado para manejar errores
    const [error, setError] = useState<string | null>(null);

    /**
     * Valida que el ID sea proporcionado y sea válido
     */
    const validateId = (id: string): boolean => {
        return id.trim() !== '' && !isNaN(Number(id));
    };

    /**
     * Maneja la confirmación de eliminación
     */
    const handleConfirm = async () => {
        // Validar que haya un ID válido
        if (!validateId(rangoEdadId)) {
            setError('Debe proporcionar un ID válido');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Preparar datos para enviar al servidor
            const deleteData = {
                RangoEdad: Number(rangoEdadId),
            };

            const result = await onConfirm(deleteData);

            if (result.ok) {
                // Si todo sale bien, cerrar el modal después de un breve delay
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                setError(result.message);
            }
        } catch (error: any) {
            setError(error.message || 'Error al eliminar ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
            <div className="relative w-full p-4 bg-white rounded-xl dark:bg-gray-900">
                <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                    Confirmar Eliminación
                </h3>
                
                <div className="mb-6">
                    <div className="mb-4">
                        <Label>
                            Rango de Edad <span className="text-red-500">*</span>
                        </Label>
                        <TextArea
                            value={rangoEdadId}
                            onChange={(value) => {
                                setRangoEdadId(value);
                                setError(null);
                            }}
                            rows={1}
                        />
                    </div>
                    
                    
                    {/* Mostrar mensaje de error si existe */}
                    {error && (
                        <div className="mt-4 p-3 rounded bg-red-100 text-red-700">
                            {error}
                        </div>
                    )}
                    
                    <p className="mt-4 text-sm text-red-500">
                        Esta acción no se puede deshacer.
                    </p>
                </div>
                
                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};