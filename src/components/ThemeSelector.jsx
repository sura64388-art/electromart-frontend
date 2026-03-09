import { PaletteIcon } from "lucide-react";
import { THEMES } from "../constants";
import { useThemeStore } from "../stores/useThemeStore";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="relative group">
      {/* Trigger */}
      <button
        type="button"
        className="p-2 rounded-full hover:bg-slate-700 transition"
        title="Change theme"
      >
        <PaletteIcon size={18} />
      </button>

      {/* Dropdown */}
      <div
        className="
          absolute right-0 mt-3 w-56
          bg-slate-800 text-white
          border border-slate-700
          rounded-xl shadow-xl
          opacity-0 scale-95 pointer-events-none
          group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
          transition-all duration-150 z-50
        "
      >
        {THEMES.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`
              w-full px-4 py-3 flex items-center gap-3
              text-left rounded-lg transition
              ${
                theme === t.name
                  ? "bg-indigo-600"
                  : "hover:bg-slate-700"
              }
            `}
          >
            <PaletteIcon size={14} />
            <span className="text-sm font-medium">{t.label}</span>

            <div className="ml-auto flex gap-1">
              {t.colors.map((c, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;

