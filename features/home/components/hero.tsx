"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // ease-in-out-premium
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <Section size="none" className="relative pt-[80px] pb-24 overflow-hidden bg-background">
      <Container className="max-w-[1280px] px-6 md:px-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-[80px] items-center"
        >
          {/* Content Column */}
          <div className="z-10 flex flex-col">
            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl sm:text-[48px] font-bold text-primary tracking-[-0.02em] leading-[1.1] mb-6 text-left"
            >
              Find Your Perfect Home Away from Home.
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="font-body text-[16px] sm:text-[18px] text-muted-foreground tracking-[0.01em] leading-[1.6] mb-12 max-w-lg text-left"
            >
              Premium verified hostels and PGs for students and professionals in Indore. 
              Experience stability, comfort, and community.
            </motion.p>

            {/* Search Box */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-2 p-2 bg-card border border-border rounded-[24px] shadow-xl hover:shadow-2xl transition-normal"
            >
              <div className="flex-1 flex items-center px-4 gap-2 border-b sm:border-b-0 sm:border-r border-border pb-3 sm:pb-0">
                <MapPin className="text-secondary w-5 h-5 shrink-0" />
                <input
                  type="text"
                  className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none p-0 w-full text-base placeholder:text-muted-foreground/70"
                  placeholder="Where in Indore?"
                />
              </div>
              <button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/95 px-8 sm:px-16 py-4 rounded-[16px] font-heading text-lg font-semibold flex items-center justify-center gap-2 hover:scale-100 active:scale-95 transition-all duration-200 cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Search
              </button>
            </motion.div>
          </div>

          {/* Image Column */}
          <motion.div
            variants={imageVariants}
            className="relative lg:ml-auto w-full max-w-[540px] aspect-[4/3] z-10"
          >
            {/* Visual Frame */}
            <div className="w-full h-full rounded-[24px] overflow-hidden shadow-2xl border border-border bg-card">
              <img
                className="w-full h-full object-cover transition-all duration-500 hover:scale-102"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBom54qUEQA1Ay3uqpWhluPk5Kafp4lGEoInKPGdyvgUeXqfqSPIBm5RtN4QxlqygEthuU6zAikwfGj2eTq6LRoB5vb0f_g_C7fh4jjSV3NcetMB9N_qvdNuuKIPPpYgKB2rSlhh4YpNS23FUz1RaTKBnJA8bPDZawjCL-kC2sDednG6otjg9k7IBBnVIAc5MxFVnyIumh_PaV45b_S80xyeoz7hQ5DS1VIHLshDv_n1HDaDIF3HHxWmaYSOYBVMSVEZxS1v2wC7UMp"
                alt="Premium co-living and hostel suite in Indore"
              />
            </div>

            {/* Abstract Decorative Elements */}
            <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-secondary/30 rounded-[24px] -z-10" />
            <div className="absolute -top-2 -right-2 w-32 h-32 border border-primary/20 rounded-[24px] -z-10" />
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
