import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-white/10">
        <CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold text-white tracking-wider">404 Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>

          <Link href="/" className="mt-4 inline-block">
            <Button size="lg" className="w-full sm:w-auto">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
