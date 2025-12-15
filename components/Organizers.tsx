"use client";

import { motion } from "framer-motion";
import { Check, CalendarRange, ArrowRight } from "lucide-react";

export default function Organizers() {
    return (
        <section id="organizers" className="py-24 bg-gradient-to-br from-[#1a0b2e] to-night relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lavender/15 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.9 }}
                        className="lg:w-1/2"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <CalendarRange className="text-lavender w-6 h-6" />
                            <span className="text-lavender font-bold uppercase tracking-wider text-sm">For Organizers</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display text-white mb-6 leading-tight">
                            For Event Organizers & Clubs
                        </h2>
                        <p className="text-xl text-white/70 font-inter mb-8">
                            Reach more students. Boost attendance. Track engagement.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Create events in minutes (4-step form)",
                                "Automatic promotion to interested students",
                                "Real-time RSVP tracking & analytics",
                                "Verified ticketing with fraud protection",
                                "Spark Groups auto-created for your attendees",
                                "Free for most events (low commission on paid tickets)"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-white/80 font-inter">
                                    <div className="min-w-[24px] h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                                        <Check className="w-4 h-4 text-green-400" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="mailto:organizers@campuspulse.ng?subject=Schedule%20a%20Demo%20-%20CampusPulse"
                                className="px-8 py-4 rounded-full bg-white text-night font-bold text-lg hover:bg-lavender transition-colors flex items-center justify-center gap-2"
                            >
                                Schedule a Demo
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a
                                href="#organizers"
                                className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-colors text-center"
                            >
                                Learn More
                            </a>
                        </div>
                    </motion.div>

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 80, damping: 18, mass: 0.9 }}
                        className="lg:w-1/2 relative"
                    >
                        {/* Card Stack Effect */}
                        <div className="relative z-10 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md md:backdrop-blur-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">Neon Night 2025</h3>
                                    <p className="text-white/50 text-sm">Hosted by Student Union</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase">
                                    Live
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-night/50 p-4 rounded-xl">
                                    <div className="text-3xl font-bold text-lavender mb-1">1,240</div>
                                    <div className="text-xs text-white/50 uppercase">Views</div>
                                </div>
                                <div className="bg-night/50 p-4 rounded-xl">
                                    <div className="text-3xl font-bold text-green-400 mb-1">856</div>
                                    <div className="text-xs text-white/50 uppercase">RSVPs</div>
                                </div>
                            </div>

                            <div className="h-40 bg-white/5 rounded-xl flex items-center justify-center border border-dashed border-white/20">
                                <p className="text-white/30 text-sm">Real-time Analytics Graph</p>
                            </div>
                        </div>

                        {/* Decoration behind card */}
                        <div className="absolute top-10 -right-4 w-full h-full bg-lavender/5 rounded-3xl -z-10 rotate-3" />
                        <div className="absolute top-20 -right-8 w-full h-full bg-purple/10 rounded-3xl -z-20 rotate-6" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
