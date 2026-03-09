import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const categories = [
	{ name: "Switches and Sockets", slug: "switches" },
	{ name: "Power Generation and Transformers", slug: "power" },
	{ name: "Lighting and Fans", slug: "lighting" },
	{ name: "Water Heater and Geysers", slug: "water-heaters" },
	{ name: "Water Pumps and Motor", slug: "water-pumps" },
	{ name: "Wires and Cables", slug: "wires" },
	{ name: "Metering and Distribution", slug: "metering-distribution" },
];

const CategoryBar = () => {
	const location = useLocation();

	return (
		<div className="sticky top-16 z-40 bg-white dark:bg-slate-900 border-b">
			<div className="overflow-x-auto no-scrollbar">
				<div className="flex gap-12 py-5 min-w-max mx-auto justify-center px-10">
					{categories.map((cat) => {
						const active = location.pathname.includes(cat.slug);

						return (
							<NavLink
								key={cat.slug}
								to={`/category/${cat.slug}`}
								className={`relative text-sm font-medium whitespace-nowrap transition
								${active
										? "text-indigo-600 dark:text-indigo-400"
										: "text-slate-700 dark:text-slate-200 hover:text-indigo-600"
									}`}
							>
								{cat.name}
								{active && (
									<span className="absolute -bottom-2 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded" />
								)}
							</NavLink>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default CategoryBar;
