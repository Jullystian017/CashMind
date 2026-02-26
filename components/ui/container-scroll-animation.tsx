"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue, useSpring } from "framer-motion";

export const ContainerScroll = ({
    titleComponent,
    children,
}: {
    titleComponent: string | React.ReactNode;
    children: React.ReactNode;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const scaleDimensions = () => {
        return isMobile ? [0.7, 1] : [0.8, 1.1];
    };

    const rotate = useTransform(smoothProgress, [0, 1], [20, 0]);
    const scale = useTransform(smoothProgress, [0, 1], scaleDimensions());
    const translate = useTransform(smoothProgress, [0, 1], [0, -100]);

    return (
        <div
            className="h-[50rem] md:h-[70rem] flex items-center justify-center relative p-2 md:p-20 pb-0"
            ref={containerRef}
        >
            <div
                className="py-10 md:py-20 w-full relative bg-transparent"
                style={{
                    perspective: "1000px",
                }}
            >
                <Header translate={translate} titleComponent={titleComponent} />
                <Card rotate={rotate} translate={translate} scale={scale}>
                    {children}
                </Card>
            </div>
        </div>
    );
};

export const Header = ({ translate, titleComponent }: any) => {
    return (
        <motion.div
            style={{
                translateY: translate,
            }}
            className="max-w-5xl mx-auto text-center font-inter"
        >
            {titleComponent}
        </motion.div>
    );
};

export const Card = ({
    rotate,
    scale,
    children,
}: {
    rotate: MotionValue<number>;
    scale: MotionValue<number>;
    translate: MotionValue<number>;
    children: React.ReactNode;
}) => {
    return (
        <motion.div
            style={{
                rotateX: rotate,
                scale,
                transformStyle: "preserve-3d",
            }}
            className="max-w-5xl mt-2 mx-auto w-full p-2 bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.1)] overscroll-none overflow-hidden will-change-transform"
        >
            <div className="w-full relative aspect-[1400/720] overflow-hidden rounded-2xl bg-white [backface-visibility:hidden] [transform:translate3d(0,0,2px)] border border-black/5 shadow-inner ring-1 ring-inset ring-black/5">
                {children}
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white z-50" />
            </div>
        </motion.div>
    );
};
