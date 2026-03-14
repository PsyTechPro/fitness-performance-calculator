import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Activity, Dumbbell, HeartPulse, Ruler, Timer, Info } from "lucide-react";

import { useCalculatorStore } from "@/store/use-calculator";
import { PerformanceMetrics } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  age: z.coerce.number().min(1, "Age is required"),
  pushUps: z.coerce.number().min(0),
  pullUps: z.coerce.number().min(0),
  hangMin: z.coerce.number().min(0),
  hangSec: z.coerce.number().min(0).max(59, "Max 59 seconds"),
  gripStrength: z.string().optional().transform(v => v === '' || v === undefined ? undefined : Number(v)),
  sprints: z.coerce.number().min(0),
  mileMin: z.coerce.number().min(0),
  mileSec: z.coerce.number().min(0).max(59, "Max 59 seconds"),
  rhr: z.coerce.number().min(20).max(250, "Invalid heart rate"),
  waist: z.coerce.number().min(10, "Invalid waist size"),
});

type FormValues = z.input<typeof formSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CalculatorForm() {
  const [, setLocation] = useLocation();
  const setMetrics = useCalculatorStore((state) => state.setMetrics);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined, pushUps: undefined, pullUps: undefined, 
      hangMin: undefined, hangSec: undefined, gripStrength: "", 
      sprints: undefined, mileMin: undefined, mileSec: undefined, 
      rhr: undefined, waist: undefined
    }
  });

  const onSubmit = (data: any) => {
    setMetrics(data as PerformanceMetrics);
    setLocation("/results");
  };

  return (
    <div className="min-h-screen pb-24 pt-12 px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 z-[-1] opacity-20 pointer-events-none bg-cover bg-center bg-no-repeat mix-blend-overlay"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/gym-bg.png)` }}
      />
      
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-glow">Performance <span className="text-primary">Calculator</span></h1>
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
            Enter your best verified numbers. No egos, just raw data. Find out where you truly stand.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/10 border border-primary/30 rounded-xl p-5 mb-10 flex gap-4 items-start shadow-[0_0_30px_rgba(255,69,0,0.1)]"
        >
          <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-primary-foreground/90 font-medium leading-relaxed">
            <strong className="text-white block mb-1 text-base uppercase tracking-wider font-display">Critical Rule</strong>
            Push-ups and pull-ups must be performed in <span className="text-primary font-bold">ONE continuous set</span> without stopping. 
            All 100-yard sprints must be completed in <span className="text-primary font-bold">ONE workout session</span>.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
            
            {/* 00 / BASICS */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                <span className="text-primary font-display text-2xl">00</span>
                <h2 className="text-2xl font-display text-white tracking-widest">Basics</h2>
              </div>
              <Card>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (Years)</Label>
                    <Input id="age" type="number" placeholder="e.g. 30" {...register("age")} />
                    {errors.age && <p className="text-destructive text-xs">{errors.age.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist">Waist Size (Inches)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input id="waist" type="number" className="pl-10" placeholder="e.g. 32" {...register("waist")} />
                    </div>
                    {errors.waist && <p className="text-destructive text-xs">{errors.waist.message as string}</p>}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* 01 / STRENGTH */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                <span className="text-primary font-display text-2xl">01</span>
                <h2 className="text-2xl font-display text-white tracking-widest">Strength & Power</h2>
              </div>
              <Card>
                <CardContent className="p-6 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pushUps">Max Push-ups (Continuous)</Label>
                      <Input id="pushUps" type="number" placeholder="e.g. 45" {...register("pushUps")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pullUps">Max Pull-ups (Continuous)</Label>
                      <Input id="pullUps" type="number" placeholder="e.g. 12" {...register("pullUps")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Dead Hang Time</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input type="number" placeholder="Min" {...register("hangMin")} />
                      </div>
                      <span className="text-muted-foreground font-display text-xl">:</span>
                      <div className="flex-1">
                        <Input type="number" placeholder="Sec" {...register("hangSec")} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sprints">100-Yard Sprints (In one session)</Label>
                      <div className="relative">
                        <Activity className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input id="sprints" type="number" className="pl-10" placeholder="e.g. 10" {...register("sprints")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gripStrength">Grip Strength (lbs) <span className="text-muted-foreground/50 font-normal ml-1">(Optional)</span></Label>
                      <div className="relative">
                        <Dumbbell className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input id="gripStrength" type="number" className="pl-10" placeholder="e.g. 120" {...register("gripStrength")} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* 02 / CARDIO */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                <span className="text-primary font-display text-2xl">02</span>
                <h2 className="text-2xl font-display text-white tracking-widest">Cardiovascular</h2>
              </div>
              <Card>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>1-Mile Run Time</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <Timer className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input type="number" className="pl-10" placeholder="Min" {...register("mileMin")} />
                      </div>
                      <span className="text-muted-foreground font-display text-xl">:</span>
                      <div className="flex-1">
                        <Input type="number" placeholder="Sec" {...register("mileSec")} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rhr">Resting Heart Rate (BPM)</Label>
                    <div className="relative">
                      <HeartPulse className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input id="rhr" type="number" className="pl-10" placeholder="e.g. 55" {...register("rhr")} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="flex justify-center pt-8"
          >
            <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[280px]">
              Calculate My Score
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
