import { useEffect, useState } from "react";
import axios from "../lib/axios";

const OrdersTab = () => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		axios.get("/orders").then((res) => setOrders(res.data));
	}, []);

	return (
		<div className="space-y-4">
			{orders.map((o) => (
				<div
					key={o._id}
					className="flex justify-between items-center
					bg-white dark:bg-slate-900
					border border-slate-200 dark:border-slate-800
					rounded-lg p-4"
				>
					<div>
						<p className="font-semibold">Order #{o._id.slice(-6)}</p>
						<p className="text-sm text-slate-500">₹{o.totalAmount}</p>
					</div>

					<span
						className={`px-3 py-1 rounded-full text-sm
						${
							o.status === "delivered"
								? "bg-green-100 text-green-700"
								: o.status === "cancelled"
								? "bg-red-100 text-red-700"
								: "bg-yellow-100 text-yellow-700"
						}`}
					>
						{o.status}
					</span>
				</div>
			))}
		</div>
	);
};

export default OrdersTab;
