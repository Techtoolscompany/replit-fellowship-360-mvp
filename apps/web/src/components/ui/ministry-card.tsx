import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, MapPin, Calendar, Users, Edit, Eye } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MinistryCardProps {
  id: number;
  name: string;
  description: string;
  leader: string;
  members: number;
  nextMeeting: string;
  location: string;
  status: string;
  images?: string[];
  tags?: string[];
  rating?: number;
  'data-testid'?: string;
}

export const MinistryCard: React.FC<MinistryCardProps> = ({
  id,
  name,
  description,
  leader,
  members,
  nextMeeting,
  location,
  status,
  images = [
    'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596622247990-84877175438a?q=80&w=2864&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=2940&auto=format&fit=crop',
  ],
  tags = ['Ministry', 'Community'],
  rating = 4.8,
  'data-testid': dataTestId,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'planning':
        return 'bg-yellow-500 text-white';
      case 'inactive':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <Card 
      className="group relative w-full max-w-sm overflow-hidden bg-background shadow-lg transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2"
      data-testid={dataTestId}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={prevImage}
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={nextImage}
            >
              →
            </Button>
          </>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-1 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 bg-white/80 hover:bg-white"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>

        {/* Status Badge */}
        <Badge className={`absolute left-2 top-2 ${getStatusColor(status)}`}>
          {status}
        </Badge>
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

        {/* Leader */}
        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>{leader.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Led by {leader}</p>
          </div>
        </div>

        {/* Meeting Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{members} members</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{nextMeeting}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
