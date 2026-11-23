import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({ type, value, onChange, placeholder, label }) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const Icon = showPassword ? EyeOff : Eye;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">{label}</label>
      <div className="input-box">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-600"
          >
            <Icon size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
