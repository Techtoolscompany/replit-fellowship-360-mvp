import * as React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the props for the component
export interface HotelCardProps {
  imageUrl: string;
  imageAlt: string;
  roomType: string;
  hotelName: string;
  location: string;
  rating: number;
  reviewCount: number;
  description?: string;
  href?: string; // Optional link for the entire card
  className?: string;
}

const HotelCard = React.forwardRef<HTMLDivElement, HotelCardProps>(
  (
    {
      className,
      imageUrl,
      imageAlt,
      roomType,
      hotelName,
      location,
      rating,
      reviewCount,
      description,
      href,
    },
    ref
  ) => {
    // Determine the root component type: 'a' for link, 'div' otherwise
    const Component = href ? motion.a : motion.div;

    return (
      <Component
        ref={ref as any} // Type assertion needed for motion component polymorphism
        href={href}
        className={cn(
          "group flex flex-col md:flex-row overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg h-full focus:outline-none",
          className
        )}
        // Animation variants for framer-motion
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Image Section */}
        <div className="w-1/3 h-full overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between p-4 w-2/3 space-y-2">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">{roomType}</span>
            <h3 className="text-lg font-bold tracking-tight line-clamp-1">{hotelName}</h3>
            
            {/* Location */}
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-3 w-3 flex-shrink-0" />
              <span className="text-xs line-clamp-1">{location}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {/* Description */}
            {description && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {description}
              </p>
            )}
          </div>
        </div>
      </Component>
    );
  }
);

HotelCard.displayName = "HotelCard";

export { HotelCard };
