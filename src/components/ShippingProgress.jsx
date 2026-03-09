import { Truck, Package, CreditCard, CheckCircle } from "lucide-react";

const steps = [
	{ label: "Cart", icon: Package },
	{ label: "Shipping", icon: Truck },
	{ label: "Payment", icon: CreditCard },
	{ label: "Done", icon: CheckCircle },
];

const ShippingProgress = ({ currentStep = 1 }) => {
	return (
		<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
			<div className="flex items-center justify-between">
				{steps.map((step, index) => {
					const active = index <= currentStep;
					const Icon = step.icon;

					return (
						<div key={step.label} className="flex-1 flex flex-col items-center">
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center
								${active ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}
							>
								<Icon size={18} />
							</div>
							<p className={`text-xs mt-2 ${active ? "text-emerald-600" : "text-slate-400"}`}>
								{step.label}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ShippingProgress;
