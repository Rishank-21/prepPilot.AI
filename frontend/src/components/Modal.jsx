import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ children, isOpen, onClose, title }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (isOpen) dialog.showModal();
    return () => dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-auto rounded-2xl bg-white shadow-xl backdrop:bg-slate-950/50"
    >
      {isOpen && <>
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button type="button" aria-label="Close dialog" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        {children}
      </>}
    </dialog>
  );
}
