import React, { useRef, useState } from "react";

type EditModalProps = {
  initialText: string;
  onSave: (newText: string) => void;
  formId: string;
  disabled?: boolean;
};

export const EditTextModal = (props: EditModalProps) => {
  const { initialText, onSave, formId, disabled = false } = props;
  const [text, setText] = useState(initialText);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleSubmit = () => {
    if (text.trim()) {
      onSave(text.trim());
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dialogRef.current?.close();
    }
  };

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className="btn btn--secondary btn--small"
        disabled={disabled}
      >
        ✏️ Upravit
      </button>

      <dialog ref={dialogRef} onClick={handleClickOutside}>
        <div className="modal">
          <div className="modal__content">
            <div className="modal__header">
              <h2 className="modal__title">Upravit úkol</h2>
            </div>
            <form
              className="modal__form"
              method="dialog"
              onSubmit={handleSubmit}
              id={`edit-form-${formId}`}
            >
              <input
                name="text"
                type="text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                className="modal__input"
                autoFocus
                placeholder="Text úkolu..."
              />
            </form>
          </div>
          <div className="modal__actions">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="btn btn--secondary"
            >
              Zrušit
            </button>
            <button
              type="submit"
              form={`edit-form-${formId}`}
              className="btn btn--primary"
              disabled={!text.trim()}
            >
              Uložit
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
