import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Coins, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function MicrojobModule() {
  // Sample data
  const microjobs = [
    {
      id: 1,
      title: "Seasonal Harvest Help Needed",
      skills: ["Physical strength", "Basic farming"],
      compensation: 20.50,
      location: "Rural County, Midwest",
      duration: "2 weeks",
      postedBy: "John Farmer",
      status: "open"
    },
    {
      id: 2,
      title: "Agricultural Data Analyst",
      skills: ["Data analysis", "Agricultural knowledge"],
      compensation: 35.75,
      location: "Remote",
      duration: "1 month",
      postedBy: "AgriTech Industries",
      status: "open"
    },
    {
      id: 3,
      title: "Drone Operator for Field Monitoring",
      skills: ["Drone piloting", "Photography"],
      compensation: 27.25,
      location: "Eastern Farm Belt",
      duration: "3 days",
      postedBy: "Modern Farms Inc.",
      status: "open"
    }
  ];

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Microjobs
            </CardTitle>
            <CardDescription>
              Find short-term work opportunities or hire skilled labor
            </CardDescription>
          </div>
          <Button className="bg-primary text-white hover:bg-primary-dark">
            Post Job
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {microjobs.map((job) => (
              <motion.div 
                key={job.id} 
                className="border rounded-lg p-4"
                whileHover={{ y: -3, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-lg">{job.title}</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    {job.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {job.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Coins className="h-4 w-4 mr-1 text-gray-400" />
                    ${job.compensation}/hour
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className="text-sm text-gray-500 mb-1 block">Skills required:</span>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Posted by: <span className="text-gray-700">{job.postedBy}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary">
              View All Microjobs
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
