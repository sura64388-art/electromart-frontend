import { Check } from "lucide-react";
import { useState } from "react";

/**
 * Component to select shipping method.
 * @param {string} selectedMethod - The currently selected method ID (e.g. 'STANDARD')
 * @param {function} onSelectMethod - Function to call when a method is selected
 * @param {object} shippingCosts - Object mapping method IDs to costs. Default provided.
 */
const ShippingMethodSelector = ({ selectedMethod, onSelectMethod, shippingCosts }) => {
    // Default costs if not provided, though ideally should come from parent
    const defaultCosts = {
        STANDARD: 49,
        EXPRESS: 99,
        SAME_DAY: 199,
    };

    const costs = shippingCosts || defaultCosts;

    const shippingOptions = [
        { id: "STANDARD", label: "Standard", desc: "4-7 days" },
        { id: "EXPRESS", label: "Express", desc: "2-3 days" },
        { id: "SAME_DAY", label: "Same Day", desc: "Today" },
    ];

    const handleSelect = (id) => {
        // Toggle behavior: if clicked same ID, deselect (set to null), else select new ID
        if (selectedMethod === id) {
            onSelectMethod(null);
        } else {
            onSelectMethod(id);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Shipping Method
            </h4>

            <div className="grid grid-cols-3 gap-3">
                {shippingOptions.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                        <div
                            key={method.id}
                            onClick={() => handleSelect(method.id)}
                            className={`
                                relative cursor-pointer
                                border rounded-lg py-4 px-2
                                flex flex-col items-center justify-start text-center
                                transition-all duration-200 h-32
                                ${isSelected
                                    ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10"
                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 hover:border-gray-300"
                                }
                            `}
                        >
                            {/* Checkbox */}
                            <div className={`
                                w-4 h-4 mb-3 rounded-[3px] border flex items-center justify-center transition-colors
                                ${isSelected
                                    ? "bg-white border-emerald-500"
                                    : "border-gray-400 dark:border-gray-500 bg-white dark:bg-slate-800"
                                }
                            `}>
                                {/* Using a text checkmark or custom SVG to mimic a simpler check if needed, 
                                    but usually a filled box with check is standard. 
                                    The user specifically asked "remove green check".
                                    Maybe they mean the background color? 
                                    Let's try a green checkmark icon inside a white box (checkbox style).
                                */}
                                {isSelected && <Check size={12} className="text-emerald-600" strokeWidth={3} />}
                            </div>

                            {/* Price */}
                            <div className="mb-1">
                                <span className={`text-lg font-bold ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white"}`}>
                                    ₹{costs[method.id]}
                                </span>
                            </div>

                            {/* Label */}
                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-0.5">
                                {method.label}
                            </span>

                            {/* Description/Days */}
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                {method.desc}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShippingMethodSelector;
