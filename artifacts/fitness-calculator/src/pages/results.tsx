import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Dumbbell, Heart, Activity, Ruler } from "lucide-react";

import { useCalculatorStore } from "@/store/use-calculator";
import { getInterpretationLabel, generateOverallInterpretation } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/circular-progress";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

export default function Results() {
  const [, setLocation] = useLocation();
  const { scores, reset } = useCalculatorStore();

  useEffect(() => {
    // If user refreshes or visits results without data, push back to home
    if (!scores) {
      setLocation("/");
    }
  }, [scores, setLocation]);

  if (!scores) return null;

  const handleRecalculate = () => {
    reset();
    setLocation("/");
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary"; // Elite
    if (score >= 75) return "text-white"; // Excellent
    if (score >= 60) return "text-gray-300"; // Above Average
    if (score >= 45) return "text-gray-400"; // Average
    if (score >= 30) return "text-gray-500"; // Below Average
    return "text-destructive"; // Needs Work
  };

  const overallInterpretation = generateOverallInterpretation(scores);

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Background Layer */}
      <div 
        className="fixed inset-0 z-[-1] opacity-[0.15] pointer-events-none bg-cover bg-center bg-no-repeat mix-blend-screen"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/gym-bg.png)` }}
      />
      
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header & Overall Score */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          <div className="w-full flex justify-start">
            <Button variant="ghost" onClick={handleRecalculate} className="text-muted-foreground hover:text-white group">
              <ChevronLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              Recalculate
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <CircularProgress value={scores.overall} size={240} strokeWidth={14} />
          </div>
          
          <div className="max-w-2xl bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="font-display text-2xl uppercase tracking-widest text-primary mb-3">Overall Analysis</h3>
            <p className="text-gray-300 leading-relaxed font-sans text-lg">
              {overallInterpretation}
            </p>
          </div>
        </motion.div>

        {/* Sub-scores Grid */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Strength Card */}
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                      <Dumbbell className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl uppercase tracking-wider text-white leading-none">Strength</h3>
                      <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mt-1">Foundation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-5xl leading-none text-white">{scores.strength}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className={`text-sm font-bold uppercase tracking-widest ${getScoreColor(scores.strength)}`}>
                      {getInterpretationLabel(scores.strength)}
                    </span>
                  </div>
                  <Progress value={scores.strength} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cardio Card */}
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl uppercase tracking-wider text-white leading-none">Cardio</h3>
                      <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mt-1">Engine</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-5xl leading-none text-white">{scores.cardio}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className={`text-sm font-bold uppercase tracking-widest ${getScoreColor(scores.cardio)}`}>
                      {getInterpretationLabel(scores.cardio)}
                    </span>
                  </div>
                  <Progress value={scores.cardio} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Power Card */}
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl uppercase tracking-wider text-white leading-none">Power</h3>
                      <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mt-1">Conditioning</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-5xl leading-none text-white">{scores.power}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className={`text-sm font-bold uppercase tracking-widest ${getScoreColor(scores.power)}`}>
                      {getInterpretationLabel(scores.power)}
                    </span>
                  </div>
                  <Progress value={scores.power} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Body Comp Card */}
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                      <Ruler className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl uppercase tracking-wider text-white leading-none">Body Comp</h3>
                      <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mt-1">Structure</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-5xl leading-none text-white">{scores.bodyComp}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className={`text-sm font-bold uppercase tracking-widest ${getScoreColor(scores.bodyComp)}`}>
                      {getInterpretationLabel(scores.bodyComp)}
                    </span>
                  </div>
                  <Progress value={scores.bodyComp} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
          <Button size="lg" variant="outline" onClick={handleRecalculate} className="min-w-[200px]">
            Calculate Again
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
