import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Truck,
    ShieldCheck,
    Lightbulb,
    Wind,
    Zap,
    CircleDot
} from "lucide-react";

const AdminHomeTab = () => {
    const images = [
        "/br1.png",
        "/br2.jpg",
        "/br3.jpg",
        "/br4.jpg",
        "/br5.jpg",
        "/br6.jpg",
        "/br7.png"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    const categories = [
        { name: "Switches and Sockets", image: "/p1.avif", bg: "bg-amber-50" },
        { name: "Power Generation and Transformers", image: "/p2.jpg", bg: "bg-blue-50" },
        { name: "Lighting and Fans", image: "/p3.jpg", bg: "bg-orange-50" },
        { name: "Water Heater and Geysers", image: "/p4.jpg", bg: "bg-purple-50" },
        { name: "Water Pumps and Motor", image: "/p5.avif", bg: "bg-red-50" },
        { name: "Wires and Cables", image: "/p6.jpg", bg: "bg-emerald-50" },
        { name: "Metering and Distribution", image: "/p7.jpg", bg: "bg-teal-50" },
    ];

    const features = [
        { title: "100% Branded Products", desc: "Trusted & premium brands only", icon: ShieldCheck, color: "text-amber-500" },
        { title: "100% Original Products", desc: "Genuine quality guaranteed", icon: CheckCircle2, color: "text-blue-600" },
        { title: "Free Delivery", desc: "Fast delivery across Tamil Nadu", icon: Truck, color: "text-orange-500" },
    ];

    return (
        <div className="space-y-0 animate-in fade-in duration-700">
            {/* Hero Slider Section (Full Size Banners) */}
            <div className="w-full relative h-[500px] lg:h-[600px] overflow-hidden group shadow-sm bg-gray-100 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full relative"
                    >
                        <img
                            src={images[currentIndex]}
                            className="w-full h-full object-fill lg:object-stretch"
                            alt="Promo Banner"
                        />
                        {/* Branding Overlay */}
                        <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center px-4">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tighter"
                            >
                                Sree Saravana Electricals ⚡
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-base md:text-xl font-bold text-white/90 mt-4 drop-shadow-lg"
                            >
                                Premium electrical products — Trusted by Home & Industry
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Slider Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`transition-all duration-300 rounded-full h-2 ${currentIndex === idx ? "w-8 bg-emerald-500" : "w-2 bg-white/50"}`}
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 border border-white/20"
                >
                    <ChevronLeft size={28} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 border border-white/20"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Feature Section Bar (Matching Image green bar) */}
            <div className="bg-[#f0f9f4] py-6 px-10 border-b border-emerald-100 relative z-10">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-4">
                            <div className={`p-2.5 rounded-xl bg-white shadow-sm ${feature.color}`}>
                                <feature.icon size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-[14px] font-bold text-gray-800 tracking-tight">{feature.title}</h4>
                                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shop By Category */}
            <div className="py-24 text-center bg-white relative">
                <div className="max-w-xl mx-auto mb-16">
                    <h3 className="text-3xl font-black text-emerald-700 uppercase tracking-tighter">
                        Shop by Category
                    </h3>
                    <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full"></div>
                </div>

                <div className="flex flex-wrap justify-center gap-12 lg:gap-16 max-w-[1700px] mx-auto px-10">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -8 }}
                            className="flex flex-col items-center gap-5 cursor-pointer group w-[160px]"
                        >
                            <div className={`w-32 h-32 rounded-full ${cat.bg} border border-emerald-50 shadow-md flex items-center justify-center transition-all group-hover:border-emerald-500 group-hover:shadow-xl bg-white relative overflow-hidden p-4`}>
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <span className="text-[13px] font-bold text-gray-700 uppercase tracking-tight group-hover:text-emerald-500 text-center leading-tight">
                                {cat.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminHomeTab;
