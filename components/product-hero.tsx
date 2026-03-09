
"use client"

import { motion } from "framer-motion"

interface ProductHeroProps {
    titleMain: string
    titleHighlight: string
    description: string
}

export function ProductHero({ titleMain, titleHighlight, description }: ProductHeroProps) {
    return (
        <div className="container mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-5xl md:text-7xl font-serif font-black text-foreground mb-6 uppercase tracking-tighter">
                    {titleMain}{" "}
                    <span className="text-[#f97316] italic relative">
                        {titleHighlight}
                        {/* Decorative line under highlight */}
                        <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-[#f97316]/30 -skew-x-12" />
                    </span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium text-pretty leading-relaxed opacity-80">
                    {description}
                </p>
            </motion.div>
        </div>
    )
}
