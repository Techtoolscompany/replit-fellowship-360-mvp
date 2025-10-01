"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
  borderOnly = false,
  isSelected = false,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  borderOnly?: boolean;
  isSelected?: boolean;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  if (borderOnly) {
    return (
      <motion.div 
        className={cn("relative group", containerClassName)}
        whileHover={{ 
          y: -1,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
      >
        <div className={cn("relative p-[1px] rounded-md", className)}>
          <motion.div
            variants={animate ? variants : undefined}
            initial={animate ? "initial" : undefined}
            animate={animate ? "animate" : undefined}
            transition={
              animate
                ? {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
                : undefined
            }
            style={{
              backgroundSize: animate ? "400% 400%" : undefined,
            }}
            className={cn(
              "absolute inset-0 rounded-md z-[1] blur-sm transition duration-500 will-change-transform",
              isSelected ? "opacity-40" : "opacity-0 group-hover:opacity-20",
              "bg-[radial-gradient(circle_farthest-side_at_0_100%,#10b981,transparent),radial-gradient(circle_farthest-side_at_100%_0,#059669,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#047857,transparent),radial-gradient(circle_farthest-side_at_0_0,#14b8a6,#22c55e)]"
            )}
          />
          <motion.div
            variants={animate ? variants : undefined}
            initial={animate ? "initial" : undefined}
            animate={animate ? "animate" : undefined}
            transition={
              animate
                ? {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
                : undefined
            }
            style={{
              backgroundSize: animate ? "400% 400%" : undefined,
            }}
            className={cn(
              "absolute inset-0 rounded-md z-[1] will-change-transform",
              isSelected ? "opacity-40" : "opacity-0",
              "bg-[radial-gradient(circle_farthest-side_at_0_100%,#10b981,transparent),radial-gradient(circle_farthest-side_at_100%_0,#059669,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#047857,transparent),radial-gradient(circle_farthest-side_at_0_0,#14b8a6,#22c55e)]"
            )}
          />

          <div className={cn(
            "relative z-10 transition-all duration-300 ease-out",
            "hover:shadow-xl hover:shadow-primary/20 bg-background rounded-md",
            className
          )}>{children}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={cn("relative group", containerClassName)}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
    >
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] blur-sm transition duration-500 will-change-transform",
          "scale-103",
          isSelected ? "opacity-50" : "opacity-40 group-hover:opacity-20",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#10b981,transparent),radial-gradient(circle_farthest-side_at_100%_0,#059669,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#047857,transparent),radial-gradient(circle_farthest-side_at_0_0,#14b8a6,#22c55e)]"
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-80 will-change-transform",
          "scale-104",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#10b981,transparent),radial-gradient(circle_farthest-side_at_100%_0,#059669,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#047857,transparent),radial-gradient(circle_farthest-side_at_0_0,#14b8a6,#22c55e)]"
        )}
      />

      <div className={cn(
        "relative z-10 transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-primary/20",
        className
      )}>{children}</div>
    </motion.div>
  );
};