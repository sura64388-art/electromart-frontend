import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

const AnimatedCounter = ({ value, duration = 1.5 }) => {
	const count = useMotionValue(0);
	const rounded = useTransform(count, Math.round);

	useEffect(() => {
		const controls = animate(count, value, { duration });
		return controls.stop;
	}, [value]);

	return (
		<motion.span className="text-3xl font-bold text-cyan-400">
			{rounded}
		</motion.span>
	);
};

export default AnimatedCounter;
