const ProductSkeleton = () => {
	return (
		<div className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse">
			<div className="h-40 bg-slate-700 rounded-md mb-4" />
			<div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
			<div className="h-4 bg-slate-700 rounded w-1/2" />
		</div>
	);
};

export default ProductSkeleton;
