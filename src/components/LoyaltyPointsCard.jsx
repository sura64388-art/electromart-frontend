import { Gift } from "lucide-react";

const LoyaltyPointsCard = ({ points = 120 }) => {
	return (
		<div className="bg-linear-to-r from-pink-500 to-orange-400 text-white rounded-xl p-6 shadow-lg">
			<div className="flex items-center gap-3">
				<Gift size={28} />
				<div>
					<h4 className="font-semibold">Loyalty Points</h4>
					<p className="text-sm opacity-90">Earn points on every order</p>
				</div>
			</div>

			<div className="mt-6 text-3xl font-bold">
				{points} pts
			</div>

			<p className="text-sm opacity-90 mt-1">
				Use points for discounts
			</p>
		</div>
	);
};

export default LoyaltyPointsCard;
