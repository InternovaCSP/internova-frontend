import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Generic Modal Component
 * 
 * Provides a consistent overlay and container for modal content.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {string} props.title - Title shown in the header.
 * @param {React.ReactNode} props.children - Modal content.
 * @param {React.ReactNode} props.footer - Optional footer content.
 * @param {string} props.maxWidth - Max width of the modal (e.g., '600px').
 */
const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = '650px' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="modal-overlay" 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1100,
                padding: '20px'
            }}
        >
            <div 
                className="modal-container"
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'white',
                    width: '100%',
                    maxWidth: maxWidth,
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '90vh'
                }}
            >
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '20px', color: '#1e293b', margin: 0, fontWeight: 700 }}>{title}</h2>
                    <button 
                        style={{ padding: '8px', borderRadius: '50%', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s' }} 
                        onClick={onClose}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{ padding: '24px 32px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
