"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, ChevronDown, ChevronUp, X } from "lucide-react";
import Logo from "./Logo";
import { animate } from "animejs";
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { useMemo } from 'react';

// Helper to remove bouncing/bobbing from Lottie animations to ensure they stay grounded
// Extracted outside component to prevent re-creation on every render
const flattenLottieVerticalMotion = (lottieData: any) => {
    try {
        const newData = JSON.parse(JSON.stringify(lottieData)); // Deep clone
        if (newData.layers) {
            newData.layers.forEach((layer: any) => {
                // Check for position data
                if (layer.ks && layer.ks.p && layer.ks.p.k) {
                    let groundY = 378; // Default fallback
                    let originalX = 672; // Default fallback

                    // If keyframes exist and are an array of objects (standard Lottie keyframe format)
                    if (Array.isArray(layer.ks.p.k) && layer.ks.p.k.length > 0 && typeof layer.ks.p.k[0] === 'object' && 's' in layer.ks.p.k[0]) {
                        // Find the 'lowest' point (max Y value) in the animation
                        // Lottie Y axis: 0 is top, higher values are lower down
                        const yValues = layer.ks.p.k
                            .map((k: any) => (Array.isArray(k.s) ? k.s[1] : null))
                            .filter((y: any) => typeof y === 'number');

                        const xValues = layer.ks.p.k
                            .map((k: any) => (Array.isArray(k.s) ? k.s[0] : null))
                            .filter((x: any) => typeof x === 'number');

                        if (yValues.length > 0) {
                            groundY = Math.max(...yValues);
                        }
                        if (xValues.length > 0) {
                            originalX = xValues[0]; // Keep original X
                        }
                    }
                    // If it's a flat array [x, y, z] (static position)
                    else if (Array.isArray(layer.ks.p.k) && layer.ks.p.k.length >= 2 && typeof layer.ks.p.k[1] === 'number') {
                        groundY = layer.ks.p.k[1];
                        originalX = layer.ks.p.k[0];
                    }

                    // Override position to lock at the calculated ground level
                    layer.ks.p.a = 0;
                    layer.ks.p.k = [originalX, groundY, 0];
                }
            });
        }
        return newData;
    } catch (e) {
        return lottieData;
    }
};

export default function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const Lottie = require("lottie-react").default;
    const ChatBubble = require("./ChatBubble").default;

    const leftPersonRef = useRef<HTMLDivElement>(null);
    const rightPersonRef = useRef<HTMLDivElement>(null);
    const leftLottieRef = useRef<any>(null);
    const rightLottieRef = useRef<any>(null);

    // Lottie animations for cycling through poses
    const [leftAnimIndex, setLeftAnimIndex] = useState(0);
    const [rightAnimIndex, setRightAnimIndex] = useState(3); // Start offset

    const ss1 = require("../public/animations/ss1.json");
    const ss3 = require("../public/animations/ss3.json");
    const ss5 = require("../public/animations/ss5.json");
    const ss7 = require("../public/animations/ss7.json");
    const ss6 = require("../public/animations/ss6.json");
    const ss4 = require("../public/animations/ss4.json");
    const ss2 = require("../public/animations/ss2.json");

    // Memoize animations to prevent expensive deep cloning on every render
    const animations = useMemo(() => {
        const rawAnimations = [ss1, ss3, ss5, ss7, ss6, ss4, ss2];
        return rawAnimations.map(flattenLottieVerticalMotion);
    }, []); // Empty dependency array means this runs only once on mount

    const [activeBubble, setActiveBubble] = useState<number | null>(null);
    const [isHovering, setIsHovering] = useState<number | null>(null);
    const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const confettiCountRef = useRef(0);

    const fireConfetti = (element: HTMLElement) => {
        // Limit total confetti bursts to prevent overflow
        if (confettiCountRef.current >= 50) return;

        confettiCountRef.current += 1;

        const rect = element.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 10,
            spread: 50,
            origin: { x, y },
            colors: ['#6418BD', '#E3B0FF', '#A855F7', '#C084FC'],
            ticks: 80,
            gravity: 1.3,
            scalar: 0.6,
        });

        // Reset counter after a delay
        setTimeout(() => {
            confettiCountRef.current = Math.max(0, confettiCountRef.current - 1);
        }, 2000);
    };

    const handleMouseEnter = (id: number, ref: React.RefObject<HTMLDivElement | null>) => {
        setIsHovering(id);

        // Excited jump and wild dancing - like someone getting hyped
        if (ref.current) {
            // Big excited jump
            animate(ref.current, {
                translateY: [
                    { value: -40, duration: 300, easing: 'easeOutCubic' },
                    { value: -30, duration: 200, easing: 'easeInOutQuad' },
                    { value: -40, duration: 200, easing: 'easeInOutQuad' },
                ],
                scale: [
                    { value: 1.15, duration: 300 },
                    { value: 1.1, duration: 200 },
                    { value: 1.15, duration: 200 },
                ],
                rotate: [
                    { value: id === 1 ? -8 : 8, duration: 300 },
                    { value: id === 1 ? 8 : -8, duration: 200 },
                    { value: id === 1 ? -8 : 8, duration: 200 },
                ],
                loop: true,
                easing: 'easeInOutSine',
            });

            // Wild arm waving effect (scale X variation)
            animate(ref.current, {
                scaleX: [
                    { value: 1.08, duration: 250 },
                    { value: 0.95, duration: 250 },
                ],
                loop: true,
                easing: 'easeInOutQuad',
            });
        }

        // Start periodic confetti (less frequent)
        if (ref.current) {
            fireConfetti(ref.current);
            confettiIntervalRef.current = setInterval(() => {
                if (ref.current) {
                    fireConfetti(ref.current);
                }
            }, 1500);
        }


    };

    const handleMouseLeave = (ref: React.RefObject<HTMLDivElement | null>) => {
        setIsHovering(null);

        // Calm down and return to normal dancing
        if (ref.current) {
            const isLeft = ref === leftPersonRef;

            // Smooth transition back
            if (ref.current) {
                animate(ref.current, {
                    translateY: 0,
                    scale: 1,
                    scaleX: 1,
                    scaleY: 1,
                    rotate: 0,
                    duration: 500,
                    easing: 'easeOutQuad',
                });
            }
        }
    };

    // Subtle breathing animation (replacing swaying)
    useEffect(() => {
        // Ensure transform origin is at the bottom for grounding
        if (leftPersonRef.current) leftPersonRef.current.style.transformOrigin = "50% 100%";
        if (rightPersonRef.current) rightPersonRef.current.style.transformOrigin = "50% 100%";

        // Left person - Subtle breathing
        if (leftPersonRef.current) {
            animate(leftPersonRef.current, {
                scaleY: [
                    { value: 1.0, duration: 2000, easing: 'easeInOutQuad' },
                    { value: 1.02, duration: 2000, easing: 'easeInOutQuad' },
                ],
                scaleX: [
                    { value: 1.0, duration: 2000, easing: 'easeInOutQuad' },
                    { value: 0.995, duration: 2000, easing: 'easeInOutQuad' },
                ],
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutSine',
            });
        }

        // Right person - Subtle breathing with offset
        if (rightPersonRef.current) {
            animate(rightPersonRef.current, {
                scaleY: [
                    { value: 1.0, duration: 2200, easing: 'easeInOutQuad' },
                    { value: 1.025, duration: 2200, easing: 'easeInOutQuad' },
                ],
                scaleX: [
                    { value: 1.0, duration: 2200, easing: 'easeInOutQuad' },
                    { value: 0.99, duration: 2200, easing: 'easeInOutQuad' },
                ],
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutQuad',
                delay: 300,
            });
        }

    }, []);

    const toggleBubble = (id: number, ref: React.RefObject<HTMLDivElement | null>) => {
        // Toggle bubble immediately on click
        const newState = activeBubble === id ? null : id;
        setActiveBubble(newState);

        if (newState !== null) {
            setTimeout(() => {
                setActiveBubble(null);
            }, 2500);
        }

        // Crazy celebration jump - like scoring a goal
        if (ref.current) {
            animate(ref.current, {
                translateY: [
                    { value: 10, duration: 100, easing: 'easeInCubic' }, // Crouch
                    { value: -60, duration: 400, easing: 'easeOutCubic' }, // Big jump
                    { value: 0, duration: 300, easing: 'easeInCubic' }, // Land
                    { value: -20, duration: 200, easing: 'easeOutQuad' }, // Small bounce
                    { value: 0, duration: 200, easing: 'easeInQuad' },
                ],
                scale: [
                    { value: 0.9, duration: 100 }, // Crouch compress
                    { value: 1.2, duration: 400 }, // Stretch in air
                    { value: 0.95, duration: 300 }, // Land compress
                    { value: 1.05, duration: 200 }, // Bounce
                    { value: 1, duration: 200 },
                ],
                rotate: [
                    { value: 0, duration: 100 },
                    { value: id === 1 ? -15 : 15, duration: 400 }, // Spin in air
                    { value: id === 1 ? 5 : -5, duration: 300 },
                    { value: 0, duration: 400 },
                ],
                easing: 'easeInOutQuad',
            });

            // Arm celebration (scale X)
            animate(ref.current, {
                scaleX: [
                    { value: 1.1, duration: 100 },
                    { value: 0.9, duration: 200 },
                    { value: 1.15, duration: 200 },
                    { value: 1, duration: 300 },
                ],
                easing: 'easeInOutSine',
            });
        }
    };

    // Cycle through animation poses for dancing effect
    useEffect(() => {
        const leftInterval = setInterval(() => {
            setLeftAnimIndex((prev) => (prev + 1) % animations.length);
        }, 500);

        const rightInterval = setInterval(() => {
            setRightAnimIndex((prev) => (prev + 1) % animations.length);
        }, 450);

        return () => {
            clearInterval(leftInterval);
            clearInterval(rightInterval);
        };
    }, [animations.length]);

    // Only Lottie frame cycling - no swaying animations for FLUID motion

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (confettiIntervalRef.current) {
                clearInterval(confettiIntervalRef.current);
            }
        };
    }, []);

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center bg-night overflow-hidden">
            {/* Navbar / Logo Area */}
            <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
                <div className="flex items-center gap-3">
                    <Logo className="w-10 h-10 text-white" />
                    <span className="font-display text-xl text-white tracking-wide">CampusPulse</span>
                </div>
            </div>

            {/* Background with Purple Night Glow */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg-clean.jpg"
                    alt="Campus Pulse Venue"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                {/* Deep Purple Night Base */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple/60 via-night/70 to-night/95" />
                {/* Purple Glow Effect */}
                {/* Purple Glow Effect - Hidden on mobile for performance */}
                <div className="hidden md:block absolute inset-0 bg-gradient-radial from-purple/40 via-lavender/15 to-transparent opacity-80" />
                {/* Additional Night Glow from Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple/30 via-transparent to-transparent" />
            </div>

            {/* Main Content */}
            <div className="relative z-40 container mx-auto px-4 text-center flex flex-col items-center mt-8 md:mt-[-50px] pointer-events-none">

                {/* Animated Text Entrance */}
                <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.9 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-lavender to-white drop-shadow-neon leading-tight">
                        Never Miss<br />the Vibe.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-lavender/80 font-inter max-w-2xl mx-auto">
                        Discover every event, see which friends are going, and experience campus life like never before.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 110, damping: 20, mass: 0.8 }}
                    className="flex flex-col items-center gap-6 pointer-events-auto"
                >
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Join Waitlist Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple to-lavender hover:opacity-90 text-night font-bold text-lg shadow-[0_0_20px_rgba(100,24,189,0.5)] hover:shadow-[0_0_30px_rgba(227,176,255,0.6)] transition-all flex items-center gap-3 group"
                        >
                            Join the Waitlist
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Organizers Button */}
                        <a
                            href="#organizers"
                            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-lg backdrop-blur-sm transition-all flex items-center gap-3 group"
                        >
                            Organizers: Get Started
                        </a>
                    </div>

                    <p className="text-white/40 text-sm font-inter mt-4 bg-night/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                        Launching March 2025 at University of Ibadan | Coming soon to your campus
                    </p>
                </motion.div>
            </div>

            {/* Silhouette Overlay - Framing the Content */}
            <div className="absolute inset-0 w-full h-full z-10 select-none overflow-hidden pointer-events-none">

                {/* Left Side - Person 1 */}
                <div className="absolute -bottom-[12%] sm:-bottom-[8%] left-[-20%] sm:left-[-2%] w-[120vw] sm:w-[480px] lg:w-[630px] xl:w-[780px] pointer-events-auto transform-gpu">
                    {/* Chat bubble on desktop */}
                    <div className="hidden md:block absolute top-[10%] left-1/2 -translate-x-1/2 z-50">
                        <ChatBubble isHovered={activeBubble === 1} />
                    </div>
                    {/* Floating emojis on mobile */}
                    <div className="md:hidden absolute top-[15%] left-1/2 -translate-x-1/2 z-50">
                        <motion.div
                            animate={{
                                y: activeBubble === 1 ? [-10, -30, -10] : 0,
                                opacity: activeBubble === 1 ? [0, 1, 0] : 0,
                                scale: activeBubble === 1 ? [0.5, 1.2, 0.5] : 0,
                            }}
                            transition={{
                                duration: 2,
                                repeat: activeBubble === 1 ? Infinity : 0,
                                ease: "easeInOut"
                            }}
                            className="text-4xl"
                        >
                            🎉
                        </motion.div>
                    </div>
                    {/* Animated person */}
                    <div
                        ref={leftPersonRef}
                        className="cursor-pointer relative grid grid-cols-1 grid-rows-1 origin-bottom will-change-transform backface-hidden"
                        onClick={() => toggleBubble(1, leftPersonRef)}
                        onMouseEnter={() => handleMouseEnter(1, leftPersonRef)}
                        onMouseLeave={() => handleMouseLeave(leftPersonRef)}
                        style={{ willChange: 'transform' }}
                    >
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={`left-${leftAnimIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "linear" }}
                                className="col-start-1 row-start-1 w-full h-auto"
                            >
                                <Lottie
                                    animationData={animations[leftAnimIndex]}
                                    lottieRef={leftLottieRef}
                                    loop={false}
                                    autoplay={true}
                                    rendererSettings={{
                                        preserveAspectRatio: 'xMidYMax meet',
                                        clearCanvas: true,
                                        progressiveLoad: true,
                                    }}
                                    className="w-full h-auto select-none"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side - Person 2 */}
                <div className="absolute -bottom-[12%] sm:-bottom-[8%] right-[-20%] sm:right-[-2%] w-[120vw] sm:w-[480px] lg:w-[630px] xl:w-[780px] pointer-events-auto transform-gpu">
                    {/* Chat bubble on desktop */}
                    <div className="hidden md:block absolute top-[10%] left-1/2 -translate-x-1/2 z-50">
                        <ChatBubble isHovered={activeBubble === 2} />
                    </div>
                    {/* Floating emojis on mobile */}
                    <div className="md:hidden absolute top-[15%] left-1/2 -translate-x-1/2 z-50">
                        <motion.div
                            animate={{
                                y: activeBubble === 2 ? [-10, -30, -10] : 0,
                                opacity: activeBubble === 2 ? [0, 1, 0] : 0,
                                scale: activeBubble === 2 ? [0.5, 1.2, 0.5] : 0,
                                rotate: activeBubble === 2 ? [0, 360, 0] : 0,
                            }}
                            transition={{
                                duration: 2,
                                repeat: activeBubble === 2 ? Infinity : 0,
                                ease: "easeInOut"
                            }}
                            className="text-4xl"
                        >
                            🔥
                        </motion.div>
                    </div>
                    {/* Animated person */}
                    <div
                        ref={rightPersonRef}
                        className="cursor-pointer relative grid grid-cols-1 grid-rows-1 origin-bottom will-change-transform backface-hidden"
                        onClick={() => toggleBubble(2, rightPersonRef)}
                        onMouseEnter={() => handleMouseEnter(2, rightPersonRef)}
                        onMouseLeave={() => handleMouseLeave(rightPersonRef)}
                        style={{ willChange: 'transform' }}
                    >
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={`right-${rightAnimIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "linear" }}
                                className="col-start-1 row-start-1 w-full h-auto"
                            >
                                <Lottie
                                    animationData={animations[rightAnimIndex]}
                                    lottieRef={rightLottieRef}
                                    loop={false}
                                    autoplay={true}
                                    rendererSettings={{
                                        preserveAspectRatio: 'xMidYMax meet',
                                        clearCanvas: true,
                                        progressiveLoad: true,
                                    }}
                                    className="w-full h-auto select-none"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Gradient fade at bottom */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-night to-transparent pointer-events-none" />
            </div>

            {/* Waitlist Modal */}
            <AnimatePresence>
                {isModalOpen && <WaitlistModal onClose={() => setIsModalOpen(false)} />}
            </AnimatePresence>

            {/* CSS styles for sprites are no longer needed, assuming we fully removed them */}
        </section>
    );
}

function WaitlistModal({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showOptional, setShowOptional] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            university: formData.get("university"),
            year: formData.get("year"),
            reason: formData.get("reason"),
            phone: formData.get("phone"),
            source: formData.get("source"),
            role: formData.get("role"),
        };

        try {
            const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxbx763RS7VILJVp-4Zz1CoY_u_rFv3eF6n948wO6tcfNKNOp6ZkttZjaK9uRrggZ1U9w/exec";

            await fetch(WEB_APP_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content - Book Opening Animation */}
            <motion.div
                initial={{
                    opacity: 0,
                    rotateY: -90,
                    transformPerspective: 1200,
                    scale: 0.8
                }}
                animate={{
                    opacity: 1,
                    rotateY: 0,
                    scale: 1
                }}
                exit={{
                    opacity: 0,
                    rotateY: 90,
                    scale: 0.8
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    duration: 0.6
                }}
                className="relative z-10 w-full max-w-lg bg-[#1a0b2e] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                style={{ transformStyle: "preserve-3d" }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {!submitted ? (
                    <>
                        <h2 className="text-3xl font-display text-white mb-2">Join the Waitlist</h2>
                        <p className="text-white/60 font-inter mb-6">Get early access when CampusPulse launches.</p>

                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            {/* Mandatory Fields */}
                            <div className="space-y-4">
                                <input name="name" type="text" placeholder="Full Name *" required className="input-field" />
                                <input name="email" type="email" placeholder="University Email *" required className="input-field" />
                                <input name="university" type="text" placeholder="University *" required className="input-field" />
                            </div>

                            {/* Optional Fields Toggle */}
                            <button
                                type="button"
                                onClick={() => setShowOptional(!showOptional)}
                                className="text-xs text-lavender/70 flex items-center gap-1 hover:text-white transition-colors mx-auto mt-2"
                            >
                                {showOptional ? "Show Less" : "Add More Info (Optional)"}
                                {showOptional ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            <AnimatePresence>
                                {showOptional && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-3 overflow-hidden"
                                    >
                                        <div className="grid grid-cols-2 gap-3">
                                            <input name="year" type="text" placeholder="Year" className="input-field" />
                                            <input name="role" type="text" placeholder="Role (e.g. Student)" className="input-field" />
                                        </div>
                                        <input name="phone" type="tel" placeholder="Phone Number" className="input-field" />
                                        <input name="source" type="text" placeholder="How did you hear about us?" className="input-field" />
                                        <textarea name="reason" placeholder="Why are you joining?" rows={2} className="input-field resize-none" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-purple to-lavender hover:opacity-90 rounded-lg font-bold text-night text-lg transition-all flex items-center justify-center gap-2 group mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        Join the Waitlist
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <SuccessView onClose={onClose} />
                )}

                <style jsx global>{`
            .input-field {
              width: 100%;
              padding: 0.75rem 1rem;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 0.5rem;
              color: white;
              font-family: var(--font-inter);
              outline: none;
              transition: all 0.2s;
            }
            .input-field:focus {
              border-color: rgba(227, 176, 255, 0.5);
              background: rgba(255, 255, 255, 0.1);
            }
            .input-field::placeholder {
              color: rgba(255, 255, 255, 0.4);
            }
          `}</style>
            </motion.div>
        </div>
    )
}

function SuccessView({ onClose }: { onClose: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const checkmarkRef = useRef<SVGPathElement>(null);
    const circleRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        // Trigger confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // GSAP Animations
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Reset initial states
            gsap.set(".success-item", { y: 20, opacity: 0 });

            // 1. Scale in circle background
            tl.fromTo(circleRef.current,
                { drawSVG: 0, scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
            );

            // 2. Draw checkmark
            tl.fromTo(checkmarkRef.current,
                { strokeDasharray: 60, strokeDashoffset: 60 },
                { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" },
                "-=0.3"
            );

            // 3. Stagger in text and button
            tl.to(".success-item", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            }, "-=0.5");

        }, containerRef);

        return () => {
            clearInterval(interval);
            ctx.revert();
        };
    }, []);

    return (
        <div ref={containerRef} className="text-center py-16 px-4">
            <div className="w-24 h-24 mx-auto mb-8 relative flex items-center justify-center">
                {/* Glowing effect behind icon */}
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />

                <svg className="w-full h-full relative z-10" viewBox="0 0 52 52">
                    <circle
                        ref={circleRef}
                        cx="26" cy="26" r="25"
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth="2"
                    />
                    <path
                        ref={checkmarkRef}
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth="3"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <h3 className="success-item text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500 mb-4">
                You're In! 🚀
            </h3>

            <p className="success-item text-white/80 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                Welcome to the future of campus life. We've reserved your spot on the exclusive list.
            </p>

            <button
                onClick={onClose}
                className="success-item group relative px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all overflow-hidden"
            >
                <span className="relative z-10 font-medium">Close</span>
                {/* Hover shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </button>
        </div>
    );
}
