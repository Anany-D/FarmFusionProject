import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, CheckCircle, BookOpen, ChevronRight, Play, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function EducationModule() {
  // Sample education modules
  const educationModules = [
    {
      id: 1,
      title: "Introduction to Web3",
      description: "Learn the basics of blockchain, cryptocurrency, and decentralized applications.",
      progress: 75,
      lessons: 8,
      completedLessons: 6,
      timeToComplete: "2 hours",
      level: "Beginner"
    },
    {
      id: 2,
      title: "DeFi for Agriculture",
      description: "Understand how decentralized finance can revolutionize agricultural funding.",
      progress: 30,
      lessons: 12,
      completedLessons: 4,
      timeToComplete: "3 hours",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "DAO Governance Basics",
      description: "Learn how to participate in decentralized autonomous organizations.",
      progress: 0,
      lessons: 6,
      completedLessons: 0,
      timeToComplete: "1.5 hours",
      level: "Beginner"
    }
  ];

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Web3 Education
            </CardTitle>
            <CardDescription>
              Learn about blockchain technology and how it applies to agriculture
            </CardDescription>
          </div>
          <Button className="bg-primary text-white hover:bg-primary-dark">
            All Courses
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-center justify-center">
              <div className="rounded-full bg-primary/10 p-4 mb-3">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-medium text-lg text-center mb-1">Your Learning Progress</h3>
              <p className="text-center text-gray-500 text-sm mb-3">Continue your Web3 journey</p>
              <div className="font-bold text-3xl mb-2">42%</div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '42%' }}></div>
              </div>
              <p className="text-center text-gray-500 text-sm mt-3">10 of 26 lessons completed</p>
            </div>
            
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-5 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-white/20 p-1.5 mr-2">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="font-medium">Featured Course</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Smart Contracts in Agriculture</h3>
              <p className="mb-4 opacity-90">Learn how smart contracts can automate and secure agricultural transactions and supply chains.</p>
              <div className="flex flex-wrap gap-3 mb-5">
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white">
                  Intermediate
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white">
                  10 Lessons
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-white">
                  4 Hours
                </Badge>
              </div>
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Play className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            </div>
          </div>
          
          <h3 className="font-medium text-lg mb-4">Your Courses</h3>
          <div className="space-y-4">
            {educationModules.map((module) => (
              <motion.div 
                key={module.id} 
                className="border rounded-lg p-4"
                whileHover={{ y: -3, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                  <h3 className="font-medium text-lg mb-2 md:mb-0">{module.title}</h3>
                  <Badge 
                    variant="outline" 
                    className={module.level === "Beginner" 
                      ? "bg-green-50 text-green-600 border-green-200" 
                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                    }
                  >
                    {module.level}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-3">{module.description}</p>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{module.completedLessons} of {module.lessons} lessons</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex items-center text-sm text-gray-500 mb-3 sm:mb-0">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {module.timeToComplete} to complete
                  </div>
                  
                  <Button 
                    size="sm" 
                    className={
                      module.progress > 0 
                        ? "bg-primary text-white hover:bg-primary-dark"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  >
                    {module.progress > 0 ? "Continue" : "Start"} 
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary">
              Explore All Educational Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
