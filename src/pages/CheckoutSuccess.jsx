import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutSuccess = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
			<div className="bg-white dark:bg-slate-800 p-10 rounded-xl shadow text-center">
				<CheckCircle className="mx-auto text-green-500" size={72} />
				<h1 className="text-3xl font-bold mt-4">
					Order Placed Successfully
				</h1>
				<p className="text-slate-500 mt-2">
					Thank you for shopping with us
				</p>
				<Link
					to="/"
					className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2 rounded"
				>
					Continue Shopping
				</Link>
			</div>
		</div>
	);
};

export default CheckoutSuccess;
