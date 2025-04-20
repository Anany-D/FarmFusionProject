import { motion } from "framer-motion";
import { Microjob } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, MapPin, Calendar, Briefcase, Info } from "lucide-react";

interface JobCardProps {
  job: Microjob;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-border/50 hover:border-primary/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <Badge variant={
              job.status === 'open' ? 'default' : 
              job.status === 'in-progress' ? 'secondary' : 'outline'
            }>
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {job.location}
              {job.remote && <Badge variant="outline" className="ml-2 text-xs">Remote</Badge>}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {job.description}
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <span className="font-medium">{job.payment}</span>
                <span className="text-muted-foreground ml-1">{job.paymentType}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>{job.duration}</span>
            </div>
          </div>
          
          <div className="bg-muted/50 p-2 rounded">
            <div className="text-xs text-muted-foreground mb-1">Required Skills</div>
            <div className="flex flex-wrap gap-1">
              {job.skillsRequired.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between gap-2">
          <Link href={`/microjobs/${job.id}`}>
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Info className="h-4 w-4" />
              Details
            </Button>
          </Link>
          <Button size="sm" className="w-full gap-1">
            <Briefcase className="h-4 w-4" />
            Apply
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
