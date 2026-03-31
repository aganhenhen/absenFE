interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

export const InputField = ({ label, type, placeholder, value, onChange }: InputFieldProps) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{label}</label>
    <input 
      type={type}
      required
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);