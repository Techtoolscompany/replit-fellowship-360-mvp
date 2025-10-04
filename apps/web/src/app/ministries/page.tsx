'use client'

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Button } from "@/components/ui/button"
import { PlaceCard } from "@/components/ui/card-22"
import { Plus } from "lucide-react"
import { motion } from 'framer-motion'

const sampleMinistries = [
  {
    id: 1,
    name: "Worship Team",
    description: "Leading the congregation in worship through music and song",
    leader: "Sarah Johnson",
    members: 12,
    nextMeeting: "Sunday 9:00 AM",
    location: "Main Sanctuary",
    status: "Active",
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2940&auto=format&fit=crop'
    ],
    tags: ['Music', 'Worship', 'Community'],
    rating: 4.9
  },
  {
    id: 2,
    name: "Youth Ministry",
    description: "Serving teenagers and young adults in their faith journey",
    leader: "Michael Chen",
    members: 25,
    nextMeeting: "Friday 7:00 PM",
    location: "Youth Center",
    status: "Active",
    images: [
      'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2940&auto=format&fit=crop'
    ],
    tags: ['Youth', 'Faith', 'Growth'],
    rating: 4.7
  },
  {
    id: 3,
    name: "Children's Ministry",
    description: "Nurturing children in faith through age-appropriate activities",
    leader: "Emily Davis",
    members: 18,
    nextMeeting: "Sunday 10:30 AM",
    location: "Children's Wing",
    status: "Active",
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2940&auto=format&fit=crop'
    ],
    tags: ['Children', 'Education', 'Fun'],
    rating: 4.8
  },
  {
    id: 4,
    name: "Outreach Ministry",
    description: "Serving the community and spreading God's love beyond our walls",
    leader: "Robert Martinez",
    members: 8,
    nextMeeting: "Saturday 9:00 AM",
    location: "Community Center",
    status: "Planning",
    images: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2940&auto=format&fit=crop'
    ],
    tags: ['Community', 'Service', 'Outreach'],
    rating: 4.6
  }
]

export default function MinistriesPage() {
  // Animation variants matching card-22 exactly
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 16,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6" data-testid="ministries-page">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="page-title">Ministries</h1>
            <p className="text-muted-foreground">Manage church ministries and teams</p>
          </div>
          <Button data-testid="button-add-ministry">
            <Plus className="h-4 w-4 mr-2" />
            Add Ministry
          </Button>
        </div>

        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sampleMinistries.map((ministry) => (
            <motion.div key={ministry.id} variants={cardVariants}>
              <PlaceCard
                title={ministry.name}
                description={ministry.description}
                images={ministry.images}
                tags={ministry.tags}
                rating={ministry.rating}
                schedule={ministry.nextMeeting}
                leader={ministry.leader}
                location={ministry.location}
                statusLabel={ministry.status}
                statValue={ministry.members}
                statLabel="members"
                actionLabel="Manage ministry"
                data-testid={`ministry-card-${ministry.id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AuthenticatedLayout>
  )
}
