/**
 * src/tests/components/Modal.test.jsx
 *
 * Unit tests for the generic Modal component covering:
 *  - Renders nothing when isOpen is false
 *  - Renders title and children when isOpen is true
 *  - Renders optional footer when provided
 *  - Calls onClose when the X button is clicked
 *  - Calls onClose when the backdrop overlay is clicked
 *  - Does NOT call onClose when the modal container itself is clicked (stopPropagation)
 *  - Locks scroll on open; restores it on close
 *  - Custom maxWidth is forwarded to the container
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Modal from '../../components/Modal';

function renderModal(props = {}) {
    const defaults = {
        isOpen: true,
        onClose: vi.fn(),
        title: 'Test Modal Title',
        children: <p>Modal body content</p>,
    };
    return render(<Modal {...defaults} {...props} />);
}

describe('Modal', () => {
    describe('visibility', () => {
        it('renders nothing when isOpen is false', () => {
            const { container } = renderModal({ isOpen: false });
            expect(container).toBeEmptyDOMElement();
        });

        it('renders the modal when isOpen is true', () => {
            renderModal({ isOpen: true });
            expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
            expect(screen.getByText('Modal body content')).toBeInTheDocument();
        });
    });

    describe('footer', () => {
        it('renders footer when provided', () => {
            renderModal({ footer: <button>Confirm</button> });
            expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
        });

        it('does NOT render footer section when footer prop is omitted', () => {
            // No footer: the container should not have a third block coming from footer
            renderModal({ footer: undefined });
            expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument();
        });
    });

    describe('close interactions', () => {
        it('calls onClose when the X button is clicked', () => {
            const onClose = vi.fn();
            renderModal({ onClose });
            // The X icon button is the only button in the header area
            const buttons = screen.getAllByRole('button');
            // First button is the X close button
            fireEvent.click(buttons[0]);
            expect(onClose).toHaveBeenCalledOnce();
        });

        it('calls onClose when the backdrop overlay is clicked', () => {
            const onClose = vi.fn();
            renderModal({ onClose });
            const overlay = document.querySelector('.modal-overlay');
            fireEvent.click(overlay);
            expect(onClose).toHaveBeenCalledOnce();
        });

        it('does NOT call onClose when the inner container is clicked (stopPropagation)', () => {
            const onClose = vi.fn();
            renderModal({ onClose });
            const container = document.querySelector('.modal-container');
            fireEvent.click(container);
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('scroll-lock', () => {
        it('sets body overflow to "hidden" when open', () => {
            renderModal({ isOpen: true });
            expect(document.body.style.overflow).toBe('hidden');
        });

        it('restores body overflow when closed (effect cleanup)', () => {
            const { rerender } = renderModal({ isOpen: true });
            expect(document.body.style.overflow).toBe('hidden');
            rerender(
                <Modal isOpen={false} onClose={vi.fn()} title="T">
                    <p>child</p>
                </Modal>
            );
            expect(document.body.style.overflow).toBe('unset');
        });
    });

    describe('custom maxWidth', () => {
        it('applies the supplied maxWidth to the modal container', () => {
            renderModal({ maxWidth: '900px' });
            const container = document.querySelector('.modal-container');
            expect(container.style.maxWidth).toBe('900px');
        });

        it('defaults maxWidth to 650px when not provided', () => {
            renderModal({});
            const container = document.querySelector('.modal-container');
            expect(container.style.maxWidth).toBe('650px');
        });
    });
});
