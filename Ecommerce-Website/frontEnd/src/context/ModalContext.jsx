import React, { createContext, useContext, useState } from "react";
import ConfirmModal from "../components/common/ConfirmModal";
import ErrorModal from "../components/common/ErrorModal";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    type: null,
    message: "",
    onConfirm: null,
  });

  const showError = (message) => {
    setModal({ type: "error", message });
  };

  const showConfirm = (message, onConfirm) => {
    setModal({ type: "confirm", message, onConfirm });
  };

  const closeModal = () => {
    setModal({ type: null, message: "", onConfirm: null });
  };

  return (
    <ModalContext.Provider value={{ showError, showConfirm, closeModal }}>
      {children}

      {modal.type === "confirm" && (
        <ConfirmModal
          show={true}
          message={modal.message}
          onCancel={closeModal}
          onConfirm={() => {
            if (modal.onConfirm) modal.onConfirm();
            closeModal();
          }}
        />
      )}

      {modal.type === "error" && (
        <ErrorModal show={true} errorMsg={modal.message} onClose={closeModal} />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
