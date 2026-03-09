import { Search } from "lucide-react";

const AdminProductFilters = ({ search, setSearch, min, setMin, max, setMax, selectedBrand, setSelectedBrand }) => {
	return (
		<div className="flex flex-wrap gap-4 mb-6">
			<div className="relative flex-1 min-w-55">
				<Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
				<input
					type="text"
					placeholder="Search products..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full pl-10 px-3 py-2 rounded-md
					bg-slate-100 dark:bg-slate-800
					border border-slate-300 dark:border-slate-700"
				/>
			</div>

			<input
				type="number"
				placeholder="Min ₹"
				value={min}
				onChange={(e) => setMin(e.target.value)}
				className="w-28 px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 border"
			/>

			<input
				type="number"
				placeholder="Max ₹"
				value={max}
				onChange={(e) => setMax(e.target.value)}
				className="w-28 px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 border"
			/>

			<select
				value={selectedBrand}
				onChange={(e) => setSelectedBrand(e.target.value)}
				className="w-40 px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 border"
			>
				<option value="all">All Brands</option>
				<option value="Anchor">Anchor</option>
				<option value="Legrand">Legrand</option>
				<option value="GM">GM</option>
				<option value="Cona">Cona</option>
			</select>
		</div>
	);
};

export default AdminProductFilters;
