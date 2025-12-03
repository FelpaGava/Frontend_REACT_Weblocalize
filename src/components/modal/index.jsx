import React, { useEffect } from 'react';
// Importamos o CSS Module que acabamos de criar
import styles from './modal.module.css';

/**
 * Componente Modal Genérico e Reutilizável
 * * @param {boolean} isOpen - Se true, mostra o modal.
 * @param {function} onClose - Função chamada ao fechar (X, ESC ou clique fora).
 * @param {string} title - O título do cabeçalho.
 * @param {ReactNode} children - O conteúdo principal (Formulários, textos, etc).
 * @param {ReactNode} footer - (Opcional) Botões de ação no rodapé.
 * @param {string} size - Tamanho do modal ('modal-sm', 'modal-lg', 'modal-xl').
 * @param {string} variant - Tema do modal ('primary', 'danger', 'success', 'warning').
 */
function Modal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer, 
    size = '', 
    variant = 'primary' 
}) {

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose(); 
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getHeaderStyle = () => {
        switch (variant) {
            case 'danger': return styles.headerDanger;
            case 'success': return styles.headerSuccess;
            case 'warning': return styles.headerWarning;
            default: return styles.headerPrimary;
        }
    };

    return (
        <div 
            className={`modal fade show d-block ${styles.backdrop}`} 
            tabIndex="-1" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className={`modal-dialog ${size} modal-dialog-centered`} 
                role="document"
                onClick={e => e.stopPropagation()}
            >
                <div className={`modal-content shadow ${styles.modalContent}`}>

                    <div className={`modal-header ${getHeaderStyle()}`}>
                        <h5 className="modal-title fw-bold">{title}</h5>
                        <button 
                            type="button" 
                            className={`btn-close ${variant !== 'warning' ? styles.closeButtonWhite : ''}`}
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body p-4">
                        {children}
                    </div>
                    
                    {footer && (
                        <div className="modal-footer bg-light border-0">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Modal;