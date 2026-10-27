import React, { useEffect, useRef } from "react";
export default function DeleteProductDialog({
  product,
  onConfirm,
  onCancel,
  busy,
}) {
  const ref = useRef();
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return (
    <dialog ref={ref} onCancel={onCancel} aria-labelledby="delete-title">
      <h2 id="delete-title">Eliminar producto</h2>
      <p>¿Deseas eliminar «{product.name}» del catálogo?</p>
      <p>Los clientes ya no podrán pedirlo.</p>
      <div className="actions">
        <button className="secondary" onClick={onCancel} disabled={busy}>
          Cancelar
        </button>
        <button className="danger" onClick={onConfirm} disabled={busy}>
          Eliminar definitivamente
        </button>
      </div>
    </dialog>
  );
}
