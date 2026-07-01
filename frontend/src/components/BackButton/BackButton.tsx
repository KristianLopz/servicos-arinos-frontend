import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  label?: string;
  fallbackPath?: string;
  className?: string;
}

export default function BackButton({
  label = "Voltar",
  fallbackPath = "/",
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath);
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-4 py-2 text-sm font-bold text-indigo-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md ${className}`}
    >
      <span aria-hidden="true">←</span>
      {label}
    </button>
  );
}
