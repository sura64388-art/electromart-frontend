import { CreditCard, Wallet } from "lucide-react";

/**
 * Component to select payment method.
 * @param {string} selectedMethod - The currently selected method ID ('ONLINE' or 'COD')
 * @param {function} onSelectMethod - Function to call when a method is selected
 */
const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
    const paymentOptions = [
        {
            id: "ONLINE",
            label: "Online Payment",
            description: "Pay via UPI, Cards, NetBanking",
            icon: CreditCard
        },
        {
            id: "COD",
            label: "Cash on Delivery",
            description: "Pay with cash upon delivery",
            icon: Wallet
        },
    ];

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Payment Method
            </h4>

            <div className="grid grid-cols-2 gap-3">
                {paymentOptions.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                        <div
                            key={method.id}
                            onClick={() => onSelectMethod(method.id)}
                            className={`
                                relative cursor-pointer
                                border rounded-lg p-4
                                flex flex-col items-center justify-center text-center
                                transition-all duration-200
                                ${isSelected
                                    ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10"
                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 hover:border-gray-300"
                                }
                            `}
                        >
                            {/* Radio Circle */}
                            <div className={`
                                w-4 h-4 mb-3 rounded-full border flex items-center justify-center transition-colors
                                ${isSelected
                                    ? "border-emerald-500"
                                    : "border-gray-400 dark:border-gray-500"
                                }
                            `}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                            </div>

                            <method.icon
                                className={`w-6 h-6 mb-2 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}
                            />

                            <span className={`text-sm font-bold ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"}`}>
                                {method.label}
                            </span>

                            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                                {method.description}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
