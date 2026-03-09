import { ShieldCheck, Lock, CreditCard } from "lucide-react";

const SecureCheckoutBadges = () => {
	return (
		<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
			<h4 className="font-semibold mb-4 text-slate-900 dark:text-white">
				Secure Checkout
			</h4>

			<div className="grid grid-cols-3 gap-4 text-center text-sm">
				<div className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400">
					<ShieldCheck className="text-emerald-500" />
					<span>SSL Secured</span>
				</div>

				<div className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400">
					<Lock className="text-indigo-500" />
					<span>100% Safe</span>
				</div>

				<div className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400">
					<CreditCard className="text-cyan-500" />
					<span>Secure Payments</span>
				</div>
			</div>
		</div>
	);
};

export default SecureCheckoutBadges;
