import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../../service/Api'; 

function DelButton({ item, onSuccess }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleInactivate = async (e) => {
        e.stopPropagation();

        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "O registro será inativado e não aparecerá mais nesta lista.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, inativar!',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        setIsDeleting(true);
        try {
            const id = item.locid;

            await api.put(`local/${id}/desativar`);

            Swal.fire(
                'Inativado!',
                'O registro foi INATIVADO com sucesso.',
                'success'
            );

            if (onSuccess) onSuccess();

        } catch (error) {
            console.error('Erro ao inativar:', error);
            Swal.fire(
                'Erro!',
                'Ocorreu um erro ao tentar inativar o registro.',
                'error'
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button 
            className="btn btn-outline-danger btn-sm px-3" 
            onClick={handleInactivate}
            disabled={isDeleting}
            title="Inativar Registro"
        >
            <FontAwesomeIcon icon={faTrash} className={isDeleting ? "fa-spin me-2" : "me-2"} />
            {isDeleting ? '...' : 'Excluir'}
        </button>
    );
}

export default DelButton;