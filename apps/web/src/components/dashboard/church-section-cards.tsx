'use client'

import { TrendingUp, TrendingDown, Users, UserPlus, MessageCircle, Phone, Calendar } from "lucide-react"
import { motion } from 'framer-motion'

import { Badge } from "@/components/ui/badge"

export function ChurchSectionCards() {
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
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div 
      className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Church Attendance Card */}
      <motion.div variants={cardVariants}>
        <motion.div
          variants={contentVariants}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
            transition: { type: 'spring', stiffness: 300, damping: 20 }
          }}
          className="@container/card bg-card text-card-foreground shadow-lg cursor-pointer rounded-2xl border overflow-hidden h-[140px] flex flex-col"
        >
          <motion.div variants={contentVariants} className="p-6 flex flex-col justify-between h-full">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Church Attendance</div>
              <Badge variant="outline">
                <TrendingUp />
                +8.2%
              </Badge>
            </motion.div>
            <motion.div variants={itemVariants} className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              342
            </motion.div>
            <motion.div variants={itemVariants} className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                This week's attendance <Calendar className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Up from last week
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Total Members Card */}
      <motion.div variants={cardVariants}>
        <motion.div
          variants={contentVariants}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
            transition: { type: 'spring', stiffness: 300, damping: 20 }
          }}
          className="@container/card bg-card text-card-foreground shadow-lg cursor-pointer rounded-2xl border overflow-hidden h-[140px] flex flex-col"
        >
          <motion.div variants={contentVariants} className="p-6 flex flex-col justify-between h-full">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Total Members</div>
              <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge>
            </motion.div>
            <motion.div variants={itemVariants} className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              234
            </motion.div>
            <motion.div variants={itemVariants} className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Growing congregation <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                New members this month
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Visitors Card */}
      <motion.div variants={cardVariants}>
        <motion.div
          variants={contentVariants}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
            transition: { type: 'spring', stiffness: 300, damping: 20 }
          }}
          className="@container/card bg-card text-card-foreground shadow-lg cursor-pointer rounded-2xl border overflow-hidden h-[140px] flex flex-col"
        >
          <motion.div variants={contentVariants} className="p-6 flex flex-col justify-between h-full">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">This Week's Visitors</div>
              <Badge variant="outline">
                <TrendingUp />
                +2
              </Badge>
            </motion.div>
            <motion.div variants={itemVariants} className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              8
            </motion.div>
            <motion.div variants={itemVariants} className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                More visitors this week <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Follow-up needed
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Grace Interactions Card */}
      <motion.div variants={cardVariants}>
        <motion.div
          variants={contentVariants}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
            transition: { type: 'spring', stiffness: 300, damping: 20 }
          }}
          className="@container/card bg-card text-card-foreground shadow-lg cursor-pointer rounded-2xl border overflow-hidden h-[140px] flex flex-col"
        >
          <motion.div variants={contentVariants} className="p-6 flex flex-col justify-between h-full">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Grace Interactions</div>
              <Badge variant="outline">
                <TrendingUp />
                +15
              </Badge>
            </motion.div>
            <motion.div variants={itemVariants} className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              47
            </motion.div>
            <motion.div variants={itemVariants} className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Active AI assistance <MessageCircle className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Yesterday's interactions
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Follow-ups Pending Card */}
      <motion.div variants={cardVariants}>
        <motion.div
          variants={contentVariants}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
            transition: { type: 'spring', stiffness: 300, damping: 20 }
          }}
          className="@container/card bg-card text-card-foreground shadow-lg cursor-pointer rounded-2xl border overflow-hidden h-[140px] flex flex-col"
        >
          <motion.div variants={contentVariants} className="p-6 flex flex-col justify-between h-full">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Follow-ups Pending</div>
              <Badge variant="outline">
                <Phone />
                3 due today
              </Badge>
            </motion.div>
            <motion.div variants={itemVariants} className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              12
            </motion.div>
            <motion.div variants={itemVariants} className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Outreach opportunities <Phone className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Requires attention
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}