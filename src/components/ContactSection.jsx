import React from "react";
import {
    MapPin,
    Phone,
    Clock,
    Mail,
    Navigation,
    ExternalLink,
    Store,
    Calendar,
    Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ContactSection = () => {
    const address = "37, Tirupur Towers, 4th St Stanes Rd, KNP Puram, Odakkadu, Tiruppur, Tamil Nadu 641602";
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.8016428732646!2d77.3400516758652!3d11.128186789043236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba90772740bc483%3A0x6a0538965f377c8e!2sSREE%20SARAVANA%20ELECTRICALS!5e0!3m2!1sen!2sin!4v1717666000000!5m2!1sen!2sin";

    return (
        <section className="relative px-4 py-20 mx-auto max-w-7xl overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

            <div className="relative z-10 mb-16 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-2 mb-4 border border-blue-100 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
                    <MapPin size={16} className="text-blue-500" />
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Visit Our Store</span>
                </div>
                <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
                    Find Us in <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">Tiruppur</span>
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                    Drop by our showroom to experience our premium electrical collection in person.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column - Map & Details */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    {/* Map Preview */}
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl h-[450px] border-4 border-white dark:border-gray-800">
                        <iframe
                            src={mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                        ></iframe>

                        <a
                            href="https://www.google.com/maps/search/?api=1&query=SREE+SARAVANA+ELECTRICALS+Tiruppur+Tamil+Nadu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-xl hover:bg-blue-700 transition-all hover:scale-105"
                        >
                            <Navigation size={18} />
                            Open in Maps
                        </a>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">5.0 Star</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Excellent Ratings</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                    <Store size={18} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">Premium</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Electrical Showroom</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Store Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col justify-between p-8 md:p-12 rounded-[2.5rem] bg-linear-to-br from-gray-900 to-gray-800 text-white shadow-2xl relative overflow-hidden"
                >
                    {/* Logo/Name */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-10 bg-blue-500 rounded-full"></div>
                            <h3 className="text-3xl font-black tracking-tight leading-none uppercase">
                                Sree Saravana<br />
                                <span className="text-blue-400">Electricials</span>
                            </h3>
                        </div>

                        <div className="space-y-8">
                            {/* Address */}
                            <div className="flex items-start gap-5 group cursor-pointer">
                                <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-blue-600 transition-colors">
                                    <MapPin size={24} className="text-blue-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Our Address</h4>
                                    <p className="text-xl font-medium leading-relaxed">{address}</p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="flex items-start gap-5 group">
                                <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-amber-500 transition-colors">
                                    <Clock size={24} className="text-amber-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Business Hours</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <p className="text-xl font-medium">Open Now <span className="text-gray-400 text-base font-normal">· Closes 9:00 PM</span></p>
                                    </div>
                                    <p className="text-gray-400 mt-1">Mon - Sat: 9:00 AM - 9:00 PM</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-5 group cursor-pointer">
                                <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-emerald-600 transition-colors">
                                    <Phone size={24} className="text-emerald-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Direct Call</h4>
                                    <p className="text-2xl font-black transition-colors group-hover:text-emerald-400">9843267999</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-4">
                            <Link
                                to="/"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:scale-105 transition-all"
                            >
                                <ExternalLink size={18} />
                                Visit Website
                            </Link>
                            <button className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">
                                <Mail size={18} />
                                Email Us
                            </button>
                        </div>
                    </div>

                    {/* Decorative Sparkle */}
                    <div className="absolute top-10 right-10 opacity-10">
                        <Sparkles size={80} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactSection;
