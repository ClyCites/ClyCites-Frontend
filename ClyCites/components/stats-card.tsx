"use client"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function StatsCard() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const stats = [
    { label: "African Cities", value: "8+", suffix: "", color: "from-emerald-500 to-emerald-600" },
    { label: "Community Champions", value: "1500+", suffix: "", color: "from-blue-500 to-blue-600" },
    { label: "Data Records", value: "67", suffix: "K+", color: "from-amber-500 to-amber-600" },
    { label: "Research Papers", value: "10+", suffix: "", color: "from-purple-500 to-purple-600" },
    { label: "Partners", value: "300+", suffix: "", color: "from-rose-500 to-rose-600" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 py-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[30%] h-[30%] bg-emerald-200 dark:bg-emerald-800/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-emerald-200 dark:bg-emerald-800/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants} className="relative group">
              <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative z-10 overflow-hidden">
                <div
                  className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                ></div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent mb-2">
                  {stat.value}
                  {stat.suffix}
                </h3>
                <p className="text-gray-600 dark:text-emerald-100 text-center">{stat.label}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-300/20 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 transform scale-105"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
