import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../../service/Api'; 

function DelButton({ item, onSuccess }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleInactivate = async (e) => {
        e.stopPropagation(); // Impede que o card abra/feche ao clicar no botão

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

        if (result.isConfirmed) {
            setIsDeleting(true);
            try {
                const id = item.locid || item.LOCID;
                
                // Regra de Negócio: Inativar (LOCSITUACAO = 'I')
                // Clonamos o item e forçamos a situação para 'I'
                const payload = {
                    ...item,
                    LOCSITUACAO: 'I',
                    LocSituacao: 'I', // Garantindo Case Sensitivity do C#
                    // Se sua API for estrita, certifique-se de que os campos numéricos estão como números
                    LOCID: id, 
                    LocId: id 
                };

                // Enviando PUT para atualizar. 
                // Nota: Ajuste a rota ('Local' ou 'Local/${id}') conforme sua API .NET espera.
                // Geralmente para update se usa PUT na rota com ID ou na raiz com o corpo completo.
                await api.put(`Local/${id}`, payload);

                Swal.fire(
                    'Inativado!',
                    'O registro foi inativado com sucesso.',
                    'success'
                );

                // Atualiza a lista na tela Home
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