import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import ContactSection from "../components/ContactSection";
import { useNavigate } from "react-router-dom";
import {
  Fan,
  Cable,
  Tv,
  ChevronLeft,
  ChevronRight,
  Monitor,
  ShoppingBag,
  Zap,
  Wind,
  Sparkles,
  Shield,
  Truck,
  Headphones,
  CreditCard,
  RefrigeratorIcon,
  ArrowRight,
  Star,
  CheckCircle,
  TrendingUp,
  Battery,
  Settings,
  Activity,
  Award,
  Clock,
  ShieldCheck,
  BatteryCharging,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";

const sliderImages = [
  { src: "/1.png", link: "/category/switches", fullImage: true },
  { src: "/2.png", link: "/category/fan", fullImage: true },
];

const categories = [
  { name: "Switches & Sockets", slug: "switches", image: "/p1.avif" },
  { name: "Power Generation & Transformers", slug: "power", image: "/p4.jpg" },
  { name: "Light & Fans", slug: "fan", image: "/p3.jpg" },
  { name: "Water Heaters & Geyser", slug: "water-heaters", image: "/p2.jpg" },
  { name: "Wires & Cables", slug: "wires-cables", image: "/p6.jpg" },
  { name: "Water Pumps & Motor", slug: "water-pumps", image: "/p5.avif" },
  { name: "Metering & Distribution", slug: "metering-distribution", image: "/p7.jpg" },
];

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Homeowner",
    image: "/avatar1.png",
    content: "Excellent service and genuine products. The team helped me choose the right wiring for my new house.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Interior Designer",
    image: "/avatar2.png",
    content: "I always recommend Sree Saravana Electricals to my clients. Best collection of fancy lights and switches.",
    rating: 5
  },
  {
    id: 3,
    name: "Senthil Nathan",
    role: "Electrical Contractor",
    image: "/avatar3.png",
    content: "Reliable supplier for all industrial electrical needs. Their delivery is prompt and pricing is competitive.",
    rating: 4
  }
];

const featuredBanners = [
  {
    title: "Summer Sale",
    subtitle: "Upto 40% OFF on Coolers",
    image: "/cooler.jpg.webp",
    link: "/category/coolers",
    badge: "HOT DEAL"
  },
  {
    title: "Premium Quality",
    subtitle: "Industrial Grade Wires",
    image: "/cable.jpg.jpg",
    link: "/category/wires",
    badge: "PREMIUM"
  },
  {
    title: "Energy Efficient",
    subtitle: "Premium LED Solutions",
    image: "/fan.jpg.webp",
    link: "/category/lighting",
    badge: "ENERGY SAVER"
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  const [slide, setSlide] = useState(0);
  const [bannerSlide, setBannerSlide] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Updated Brand Carousel State with Categories for Linking
  const [brandIndex, setBrandIndex] = useState(0);
  const homeBrands = [
    { src: "/s1.png", link: "/products?brand=Anchor", brand: "Anchor" },
    { src: "/s2.jpg", link: "/products?brand=Legrand", brand: "Legrand" },
    { src: "/s3.jpg", link: "/products?brand=GM", brand: "GM" },
    { src: "/s4.jpg", link: "/products?brand=Cona", brand: "Cona" },
    { src: "/po1.jpg", link: "/products?brand=Luminous", brand: "Luminous" },
    { src: "/po2.jpg", link: "/products?brand=Exide", brand: "Exide" },
    { src: "/po3.jpg", link: "/products?brand=V-Guard", brand: "V-Guard" },
    { src: "/po4.jpg", link: "/products?brand=Microtek", brand: "Microtek" },
    { src: "/lf1.png", link: "/products?brand=Havells", brand: "Havells" },
    { src: "/lf2.jpg", link: "/products?brand=Atomberg", brand: "Atomberg" },
    { src: "/lf3.png", link: "/products?brand=Orient", brand: "Orient" },
    { src: "/lf4.jpg", link: "/products?brand=Crompton", brand: "Crompton" },
    { src: "/lf5.png", link: "/products?brand=Panasonic", brand: "Panasonic" },
    { src: "/lf6.png", link: "/products?brand=Philips", brand: "Philips" },
    { src: "/lf7.png", link: "/products?brand=Luker", brand: "Luker" },
    { src: "/wh1.jpg", link: "/products?brand=AO Smith", brand: "AO Smith" },
    { src: "/wh2.png", link: "/products?brand=Racold", brand: "Racold" },
    { src: "/wh3.jpg", link: "/products?brand=Bajaj", brand: "Bajaj" },
    { src: "/wc1.jpg", link: "/products?brand=Finolex", brand: "Finolex" },
    { src: "/wc2.png", link: "/products?brand=Polycab", brand: "Polycab" },
    { src: "/wc3.png", link: "/products?brand=RR Kabel", brand: "RR Kabel" },
    { src: "/wc4.jpg", link: "/products?brand=Orbit", brand: "Orbit" },
    { src: "/wp1.jpg", link: "/products?brand=Kirloskar", brand: "Kirloskar" },
    { src: "/wp2.jpg", link: "/products?brand=Texmo", brand: "Texmo" },
    { src: "/wp3.png", link: "/products?brand=CRI", brand: "CRI" },
    { src: "/wp4.jpg", link: "/products?brand=KSB", brand: "KSB" },
    { src: "/wp5.png", link: "/products?brand=Bindu", brand: "Bindu" },
    { src: "/M1.avif", link: "/products?brand=Secure Meters", brand: "Secure Meters" },
    { src: "/M2.jpg", link: "/products?brand=L&T", brand: "L&T (Larsen & Toubro)" },
    { src: "/M3.jpg", link: "/products?brand=Genus Power", brand: "Genus Power" },
    { src: "/M4.png", link: "/products?brand=Schneider Electric", brand: "Schneider Electric" },
    { src: "/M5.png", link: "/products?brand=ABB", brand: "ABB" },
    { src: "/M6.jpg", link: "/products?brand=Siemens", brand: "Siemens" }
  ];

  // Brand Scroll Logic
  const scrollContainerRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(20);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const percentage = (scrollLeft / maxScroll) * 100;
      const thumbWidth = (clientWidth / scrollWidth) * 100;
      setScrollWidth(thumbWidth);
      setScrollLeft((scrollLeft / scrollWidth) * 100);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
    setMounted(true);
  }, [fetchFeaturedProducts]);

  useEffect(() => {
    if (!autoSlide) return;

    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerSlide((prev) => (prev + 1) % featuredBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    handleScroll(); // Init
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll brands every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBrandIndex((prev) => (prev + 1) % (homeBrands.length - 4));
    }, 5000);
    return () => clearInterval(timer);
  }, [homeBrands.length]);

  const nextSlide = () => {
    setSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const nextBannerSlide = () => {
    setBannerSlide((prev) => (prev + 1) % featuredBanners.length);
  };

  const prevBannerSlide = () => {
    setBannerSlide((prev) => (prev - 1 + featuredBanners.length) % featuredBanners.length);
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bg-purple-300 rounded-full top-1/4 left-10 w-72 h-72 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
        <div className="absolute delay-1000 bg-blue-300 rounded-full bottom-1/4 right-10 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
        <div className="absolute w-64 h-64 delay-500 bg-teal-300 rounded-full top-3/4 left-1/3 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
      </div>

      {/* Hero Slider Section - True Full-Width Cover Layout */}
      <section className="relative w-full mb-16 overflow-hidden">
        <div className="relative">
          <div
            className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] bg-white dark:bg-gray-800"
            onMouseEnter={() => setAutoSlide(false)}
            onMouseLeave={() => setAutoSlide(true)}
          >
            {/* Main slider */}
            <div className="absolute inset-0 dark:bg-gray-900">
              <img
                src={sliderImages[slide].src}
                className={`object-cover w-full h-full transition-all duration-1000 cursor-pointer ${mounted ? 'scale-100' : 'scale-105'}`}
                alt="banner"
                onClick={() => navigate(sliderImages[slide].link)}
              />

              {/* Gradient Overlay - Hide if fullImage */}
              {!sliderImages[slide].fullImage && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
              )}

              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>

            {/* Content Container - Hide if fullImage */}
            {!sliderImages[slide].fullImage && (
              <div className="relative z-10 flex items-center h-full">
                <div className="max-w-2xl pl-12 space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
                    <Sparkles size={14} />
                    <span>TRENDING NOW</span>
                  </div>

                  {/* Title with gradient */}
                  <h1 className="text-5xl font-bold leading-tight text-white">
                    Premium Electrical
                    <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                      Products
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="max-w-lg text-lg text-gray-200">
                    Discover quality wiring, efficient cooling solutions, and modern home appliances with exclusive deals
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Link
                      to="/category/switches"
                      className="relative inline-flex items-center gap-3 px-8 py-4 font-semibold text-white transition-all duration-300 group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl hover:scale-105 hover:shadow-2xl"
                    >
                      <ShoppingBag size={20} />
                      <span>Shop Now</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100"></div>
                    </Link>

                    <Link
                      to="/products"
                      className="px-8 py-4 font-semibold text-white transition-all duration-300 border-2 group border-white/30 rounded-xl hover:bg-white/10 backdrop-blur-sm hover:border-white/50"
                    >
                      <span className="relative">
                        View All
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Navigation Dots */}
            <div className="absolute flex gap-3 -translate-x-1/2 bottom-8 left-1/2">
              {sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlide(idx)}
                  className={`relative w-12 h-2 rounded-full overflow-hidden transition-all duration-300 ${idx === slide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ${idx === slide ? 'w-full' : 'w-0'
                    }`}></div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute p-4 text-white transition-all duration-300 -translate-y-1/2 border rounded-full left-6 top-1/2 group bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 border-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} className="transition-transform group-hover:-translate-x-1" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute p-4 text-white transition-all duration-300 -translate-y-1/2 border rounded-full right-6 top-1/2 group bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 border-white/20"
              aria-label="Next slide"
            >
              <ChevronRight size={24} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="relative px-4 py-12 mx-auto mb-16 max-w-7xl">
        <div className="relative z-10 mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-4 border border-blue-100 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">CATEGORIES</span>
          </div>
          <h2 className="mb-4 text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">
            Shop by <span className="text-red-600">Category</span>
          </h2>
          <div className="w-20 h-1.5 bg-red-600 rounded-full mx-auto lg:mx-0"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((cat) => {
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="h-full group relative flex flex-col bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border-2 border-red-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                {/* Image Section */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Bottom Label Section */}
                <div className="bg-[#991b1b] py-4 px-3 text-center border-t-2 border-red-800 flex-grow flex items-center justify-center">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Brands In Focus Section */}
      <section className="relative px-4 py-20 mx-auto mb-16 max-w-7xl overflow-hidden">
        {/* Subtle Section Background */}
        <div className="absolute inset-0 bg-blue-50/30 dark:bg-gray-800/20 rounded-[3rem] -z-10"></div>

        <div className="flex items-center justify-between mb-12 px-2">
          <div className="relative">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">
              Brands In <span className="text-red-600">Focus</span>
            </h2>
            <div className="w-16 h-1.5 bg-red-600 rounded-full mt-2 ml-1 shadow-[0_2px_10px_rgba(220,38,38,0.3)]"></div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setBrandIndex(prev => Math.max(0, prev - 1))}
              className="p-3.5 rounded-full border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 transition-all shadow-xl shadow-gray-200/40 dark:shadow-none hover:scale-110 active:scale-95 group"
            >
              <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setBrandIndex(prev => (prev + 1) % (homeBrands.length - 4))}
              className="p-3.5 rounded-full border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 transition-all shadow-xl shadow-gray-200/40 dark:shadow-none hover:scale-110 active:scale-95 group"
            >
              <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative">
          <motion.div
            animate={{ x: `-${brandIndex * 20}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            className="flex gap-5 px-2"
          >
            {homeBrands.map((brand, index) => (
              <div key={index} className="flex-shrink-0 w-[calc(20%-1.25rem)] flex flex-col items-center">
                <Link
                  to={brand.link}
                  className="w-full aspect-square bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-gray-700/50 p-6 flex items-center justify-center hover:shadow-2xl hover:shadow-red-500/10 hover:border-red-500 transition-all duration-500 group shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                >
                  <img
                    src={brand.src}
                    alt={`Brand logo`}
                    className="max-w-full max-h-full object-contain transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-110"
                  />
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Features Section - Glass Morphism */}
      <section className="relative px-4 py-16 mx-auto mb-16 max-w-7xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl"></div>

        <div className="relative p-8 border shadow-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 rounded-3xl border-white/20 dark:border-gray-700/50">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="p-6 transition-all duration-300 border border-gray-100 group rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl">
              <div className="inline-flex p-3 mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                <Truck size={24} className="text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white font-outfit">Fast Delivery</h4>
              <p className="text-gray-600 dark:text-gray-300">Same-day delivery in metro cities</p>
              <div className="mt-4 text-sm text-blue-600 transition-opacity duration-300 opacity-0 dark:text-blue-400 group-hover:opacity-100">
                <CheckCircle size={14} className="inline mr-1" />
                Service available
              </div>
            </div>

            <div className="p-6 transition-all duration-300 border border-gray-100 group rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50 hover:border-green-300 dark:hover:border-green-500 hover:shadow-xl">
              <div className="inline-flex p-3 mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Quality Guarantee</h4>
              <p className="text-gray-600 dark:text-gray-300">1-5 years warranty on all products</p>
              <div className="mt-4 text-sm text-green-600 transition-opacity duration-300 opacity-0 dark:text-green-400 group-hover:opacity-100">
                <Award size={14} className="inline mr-1" />
                Certified quality
              </div>
            </div>

            <div className="p-6 transition-all duration-300 border border-gray-100 group rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-xl">
              <div className="inline-flex p-3 mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <CreditCard size={24} className="text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Easy Installation</h4>
              <p className="text-gray-600 dark:text-gray-300">Professional setup services included</p>
              <div className="mt-4 text-sm text-purple-600 transition-opacity duration-300 opacity-0 dark:text-purple-400 group-hover:opacity-100">
                <Clock size={14} className="inline mr-1" />
                24/7 support
              </div>
            </div>

            <div className="p-6 transition-all duration-300 border border-gray-100 group rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-xl">
              <div className="inline-flex p-3 mb-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <Headphones size={24} className="text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">24/7 Support</h4>
              <p className="text-gray-600 dark:text-gray-300">Expert customer support team</p>
              <div className="mt-4 text-sm text-orange-600 transition-opacity duration-300 opacity-0 dark:text-orange-400 group-hover:opacity-100">
                <BatteryCharging size={14} className="inline mr-1" />
                Always available
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 border border-red-100 rounded-full bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <Star size={14} className="text-red-600" fill="currentColor" />
              <span className="text-xs font-bold text-red-600 tracking-wide uppercase">Testimonials</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 font-outfit">
              What Our Customers <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Say</span>
            </h2>
            <div className="w-24 h-1.5 bg-red-600 rounded-full mx-auto"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -top-10 -left-10 text-gray-50 dark:text-gray-800 pointer-events-none opacity-50">
              <Quote size={120} fill="currentColor" />
            </div>

            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                  <Quote size={20} fill="currentColor" />
                </div>
              </div>

              <div className="relative min-h-[280px] md:min-h-[200px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center w-full"
                  >
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 dark:border-gray-700 shadow-md mb-6"
                    />
                    <div className="flex gap-1 mb-6 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill={i < testimonials[currentTestimonial].rating ? "currentColor" : "none"} className={i < testimonials[currentTestimonial].rating ? "" : "text-gray-300 dark:text-gray-600"} />
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic mb-6">
                      "{testimonials[currentTestimonial].content}"
                    </p>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-red-50 dark:hover:bg-gray-600 hover:text-red-600 transition-all group shadow-sm hover:shadow-md hidden md:block"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-red-50 dark:hover:bg-gray-600 hover:text-red-600 transition-all group shadow-sm hover:shadow-md hidden md:block"
              >
                <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentTestimonial ? "bg-red-600 w-8" : "bg-gray-300 dark:bg-gray-600 hover:bg-red-400"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map & Contact Section */}
      <ContactSection />

      {/* Final CTA Section */}
      <section className="relative max-w-6xl px-4 py-16 mx-auto">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x"></div>

          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 text-center md:px-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 mb-6 border rounded-full bg-white/20 backdrop-blur-sm border-white/30">
              <Star size={16} className="text-white" />
              <span className="text-sm font-semibold text-white">LIMITED TIME OFFER</span>
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Upgrade Your Space with
              <span className="block mt-2">Premium Electrical Solutions</span>
            </h2>

            <p className="max-w-2xl mx-auto mb-10 text-lg text-gray-200">
              From smart appliances to energy-efficient solutions, find everything you need for modern living
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/products"
                className="relative px-10 py-4 overflow-hidden text-lg font-bold text-gray-900 transition-all duration-300 bg-white group hover:text-gray-800 rounded-xl hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Browse All Products</span>
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white to-gray-100 group-hover:opacity-100"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 transition-transform duration-500 origin-left transform scale-x-0 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:scale-x-100"></div>
              </Link>

              <Link
                to="/contact"
                className="px-10 py-4 text-lg font-bold text-white transition-all duration-300 border-2 group border-white/40 rounded-xl hover:bg-white/10 backdrop-blur-sm hover:border-white/70"
              >
                <span className="relative">
                  Get Expert Advice
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;