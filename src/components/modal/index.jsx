import React from 'react';
import styles from './modal.module.css';

/**
 * @param {boolean} isOpen 
 * @param {function} onClose 
 * @param {string} title 
 * @param {ReactNode} children
 * @param {ReactNode} footer 
 * @param {string} size 
 * @param {string} variant
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