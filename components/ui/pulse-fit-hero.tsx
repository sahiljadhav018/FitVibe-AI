import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavigationItem {
  label: string;
  hasDropdown?: boolean;
  onClick?: () => void;
}

export interface ProgramCard {
  image: string;
  category: string;
  title: string;
  onClick?: () => void;
}

export interface PulseFitHeroProps {
  logo?: string;
  navigation?: NavigationItem[];
  ctaButton?: {
    label: string;
    onClick: () => void;
  };
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  disclaimer?: string;
  socialProof?: {
    avatars: string[];
    text: string;
  };
  programs?: ProgramCard[];
  className?: string;
  children?: React.ReactNode;
}

export function PulseFitHero({
  logo = "PulseFit",
  navigation = [
    { label: "Features" },
    { label: "Programs", hasDropdown: true },
    { label: "Testimonials" },
    { label: "Pricing" },
    { label: "Contact" },
  ],
  ctaButton,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  disclaimer,
  socialProof,
  programs = [],
  className,
  children,
}: PulseFitHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex flex-col overflow-hidden",
        className
      )}
      style={{
        background: "linear-gradient(180deg, #E8F0FF 0%, #F5F9FF 50%, #FFFFFF 100%)",
      }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex flex-row justify-between items-center px-8 lg:px-16 pt-8 pb-8"
      >
        {/* Logo */}
        <div
          className="font-bold text-2xl text-neutral-900 tracking-tight"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {logo}
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex flex-row items-center gap-8" aria-label="Main navigation">
          {navigation.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-row items-center gap-1 text-slate-600 hover:text-slate-900 hover:opacity-75 transition-all text-base"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <span>{item.label}</span>
              {item.hasDropdown && (
                <ChevronDown className="w-4 h-4 text-slate-500 transition-transform duration-200" />
              )}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        {ctaButton && (
          <button
            onClick={ctaButton.onClick}
            className="px-6 py-3 rounded-full bg-white border border-slate-200 text-neutral-900 font-medium shadow-sm transition-all hover:scale-105 hover:shadow-md"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {ctaButton.label}
          </button>
        )}
      </motion.header>

      {/* Main Content */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center max-w-4xl gap-8"
          >
            {/* Title */}
            <h1
              className="font-bold text-neutral-900 tracking-tight leading-[1.1] text-4xl sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              className="font-normal text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-[620px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {subtitle}
            </p>

            {/* Action Buttons */}
            {(primaryAction || secondaryAction) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="flex flex-row items-center gap-2 px-8 py-4 rounded-full bg-neutral-900 text-white font-medium text-lg shadow-lg hover:bg-neutral-800 transition-all hover:scale-105"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <span>{primaryAction.label}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="px-8 py-4 rounded-full bg-transparent border border-slate-300 text-neutral-900 font-medium text-lg transition-all hover:scale-105 hover:bg-slate-50"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </motion.div>
            )}

            {/* Disclaimer */}
            {disclaimer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xs sm:text-sm text-slate-500 italic"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {disclaimer}
              </motion.p>
            )}

            {/* Social Proof */}
            {socialProof && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-row items-center gap-3"
              >
                <div className="flex flex-row -space-x-2">
                  {socialProof.avatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`User ${index + 1}`}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                <span
                  className="text-sm font-medium text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {socialProof.text}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* Program Cards Carousel */}
      {programs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 w-full overflow-hidden py-14"
        >
          {/* Gradient Overlays */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 w-24 sm:w-40 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 z-10 w-24 sm:w-40 pointer-events-none"
            style={{
              background: "linear-gradient(270deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
            }}
          />

          {/* Scrolling Container */}
          <motion.div
            className="flex items-center gap-6 pl-6"
            animate={{
              x: [0, -((programs.length * 380) / 2)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: Math.max(programs.length * 3.5, 16),
                ease: "linear",
              },
            }}
          >
            {/* Duplicate programs for seamless infinite marquee loop */}
            {[...programs, ...programs].map((program, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04, y: -8 }}
                transition={{ duration: 0.3 }}
                onClick={program.onClick}
                className="flex-shrink-0 cursor-pointer relative overflow-hidden rounded-3xl shadow-xl w-[320px] sm:w-[356px] h-[440px] sm:h-[480px]"
              >
                {/* Image */}
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.75) 100%)",
                  }}
                />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest text-white/80"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {program.category}
                  </span>
                  <h3
                    className="text-2xl font-bold text-white leading-snug drop-shadow-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {program.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
