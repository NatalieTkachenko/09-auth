'use client';

import css from './Modal.module.css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal}>{children}</div>
      <button className={css.backBtn} onClick={onClose}>
        Back
      </button>
    </div>
  );
}
