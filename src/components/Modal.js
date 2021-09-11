import { useEffect } from "react";
import { createPortal } from "react-dom";

import "../styles/styles.css";

export default function Modal({ onClose, children }) {
  useEffect(() => {
    window.addEventListener("keydown", exitModal);
    return () => window.removeEventListener("keydown", exitModal);
  }, []);

  const exitModal = (e) => {
    if (e.code === "Escape") {
      onClose();
    }
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  const modalRoot = document.querySelector("#modal-root");
  return createPortal(
    <div className="Overlay" onClick={exitModal}>
      <div className="Modal">{children}</div>
    </div>,
    modalRoot
  );
}
