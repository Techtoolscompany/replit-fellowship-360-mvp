'use client'

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Interface for component props for type safety and reusability
interface PlaceCardProps {
  images: string[];
  tags: string[];
  rating: number;
  title: string;
  schedule: string;
  leader: string;
  location?: string;
  statusLabel?: string;
  description: string;
  statValue: number | string;
  statLabel?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  'data-testid'?: string;
}

export const PlaceCard = ({
  images,
  tags,
  rating,
  title,
  schedule,
  leader,
  location,
  statusLabel,
  description,
  statValue,
  statLabel = 'Members',
  actionLabel = 'View details',
  actionHref,
  className,
  'data-testid': dataTestId,
}: PlaceCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Carousel image change handler
  const changeImage = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  // Animation variants for the carousel
  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  // Animation variants for staggering content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      variants={contentVariants}
      // --- NEW: Added hover animation ---
      whileHover={{ 
        scale: 1.03, 
        boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      // --- END NEW ---
      className={cn(
        'w-full h-[480px] flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg cursor-pointer',
        className
      )}
      data-testid={dataTestId}
    >
      {/* Image Carousel Section */}
      <div className="relative group h-64">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={title}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute h-full w-full object-cover"
          />
        </AnimatePresence>
        
        {/* Carousel Navigation */}
        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 text-white" onClick={() => changeImage(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 text-white" onClick={() => changeImage(1)}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Top Badges and Rating */}
        <div className="absolute top-3 left-3 flex gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-background/70 backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="flex items-center gap-1 bg-background/70 backdrop-blur-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {rating}
          </Badge>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-all',
                currentIndex === index ? 'w-4 bg-white' : 'bg-white/50'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <motion.div variants={contentVariants} className="p-5 flex flex-col flex-1">
        <motion.div variants={itemVariants} className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold line-clamp-1">{title}</h3>
          {statusLabel && <Badge variant="outline">{statusLabel}</Badge>}
        </motion.div>

        <motion.div variants={itemVariants} className="text-sm text-muted-foreground mb-3 space-y-1">
          <p className="font-medium text-foreground">Next: {schedule}</p>
          <p>Leader: {leader}</p>
          {location && <p>Location: {location}</p>}
        </motion.div>

        <motion.p variants={itemVariants} className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {description}
        </motion.p>

        <motion.div variants={itemVariants} className="flex justify-between items-center pt-2 mt-auto">
          <p className="font-semibold">
            {statValue}{' '}
            <span className="text-sm font-normal text-muted-foreground">{statLabel}</span>
          </p>
          {actionHref ? (
            <Button asChild className="group">
              <a href={actionHref}>
                {actionLabel}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          ) : (
            <Button className="group">
              {actionLabel}
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
