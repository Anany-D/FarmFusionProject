import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  Play, 
  Award,
  Leaf,
  Bookmark,
  Clock,
  Search,
  Share2,
  Star,
  FileText,
  Video,
  Code,
  PanelRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function Education() {
  // Mock education data - in a real app this would come from an API
  const courses = [
    {
      id: 1,
      title: "Introduction to Web3",
      description: "Learn the basics of blockchain, cryptocurrency, and decentralized applications.",
      level: "Beginner",
      lessons: 8,
      completedLessons: 6,
      timeToComplete: "2 hours",
      progress: 75,
      tags: ["blockchain", "crypto", "web3"],
      image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "DeFi for Agriculture",
      description: "Understand how decentralized finance can revolutionize agricultural funding.",
      level: "Intermediate",
      lessons: 12,
      completedLessons: 4,
      timeToComplete: "3 hours",
      progress: 30,
      tags: ["defi", "finance", "farming"],
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "DAO Governance Basics",
      description: "Learn how to participate in decentralized autonomous organizations.",
      level: "Beginner",
      lessons: 6,
      completedLessons: 0,
      timeToComplete: "1.5 hours",
      progress: 0,
      tags: ["dao", "governance", "community"],
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: "Smart Contracts in Agriculture",
      description: "Explore how smart contracts can automate and secure agricultural transactions.",
      level: "Advanced",
      lessons: 10,
      completedLessons: 2,
      timeToComplete: "4 hours",
      progress: 20,
      tags: ["smart contracts", "automation", "security"],
      image: "https://images.unsplash.com/photo-1625246333195-78d73c3ed144?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      title: "Tokenization of Farm Assets",
      description: "Learn how to represent physical farm assets as digital tokens.",
      level: "Intermediate",
      lessons: 8,
      completedLessons: 0,
      timeToComplete: "2.5 hours",
      progress: 0,
      tags: ["tokens", "assets", "digital"],
      image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Featured course content (lessons)
  const featuredCourseLessons = [
    { id: 1, title: "Understanding Blockchain Fundamentals", type: "video", duration: "12 min", completed: true },
    { id: 2, title: "What is Web3 and Why It Matters", type: "article", duration: "8 min", completed: true },
    { id: 3, title: "Cryptocurrency and Digital Wallets", type: "video", duration: "15 min", completed: false },
    { id: 4, title: "Decentralized Applications (dApps)", type: "interactive", duration: "20 min", completed: false },
    { id: 5, title: "Smart Contracts Basics", type: "video", duration: "18 min", completed: false }
  ];

  const [selectedLesson, setSelectedLesson] = useState(featuredCourseLessons[2]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Web3 Education</h1>
          <p className="text-muted-foreground">Learn about blockchain technology and its applications in agriculture</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved Courses
          </Button>
          <Button className="bg-primary text-white hover:bg-primary-dark">
            <Search className="h-4 w-4 mr-2" />
            Browse All Courses
          </Button>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={item}>
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div>
                <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Your Learning Journey
                </CardTitle>
                <CardDescription>
                  Track your progress and continue learning
                </CardDescription>
              </div>
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
                  <p className="text-center text-gray-500 text-sm mt-3">12 of 26 lessons completed</p>
                </div>
                
                <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-5 md:col-span-2">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-white/20 p-1.5 mr-2">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Continue Learning</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Introduction to Web3</h3>
                  <p className="mb-4 opacity-90">Learn the basics of blockchain, cryptocurrency, and decentralized applications.</p>
                  <div className="flex flex-wrap gap-3 mb-5">
                    <Badge className="bg-white/20 hover:bg-white/30 border-none text-white">
                      Beginner
                    </Badge>
                    <Badge className="bg-white/20 hover:bg-white/30 border-none text-white">
                      75% Complete
                    </Badge>
                    <Badge className="bg-white/20 hover:bg-white/30 border-none text-white">
                      6 of 8 Lessons
                    </Badge>
                  </div>
                  <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Course
                  </Button>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mb-4">In Progress Courses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.filter(course => course.progress > 0 && course.progress < 100).map((course) => (
                  <motion.div 
                    key={course.id} 
                    className="border rounded-lg overflow-hidden"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-40 relative">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Button variant="secondary" size="sm" className="rounded-full h-10 w-10 p-0">
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={
                          course.level === "Beginner" ? "secondary" :
                          course.level === "Intermediate" ? "outline" : "default"
                        }
                      >
                        {course.level}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-1 line-clamp-1">{course.title}</h4>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>{course.completedLessons} of {course.lessons} lessons</span>
                        <span>{course.timeToComplete}</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5 mb-3" />
                      <Button variant="outline" size="sm" className="w-full justify-center">
                        Continue
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Featured Course: Introduction to Web3</CardTitle>
              <CardDescription>
                Start learning about blockchain technology with this beginner-friendly course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button className="rounded-full h-16 w-16 bg-white/20 hover:bg-white/30 text-white">
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-white font-medium">{selectedLesson.title}</h3>
                      <div className="flex items-center text-white/70 text-sm mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{selectedLesson.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Tabs defaultValue="overview">
                      <TabsList className="mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="transcript">Transcript</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview">
                        <h3 className="font-medium text-lg mb-2">About This Course</h3>
                        <p className="text-gray-600 mb-4">
                          This comprehensive introduction to Web3 technologies will give you a solid foundation in blockchain, cryptocurrency, and decentralized applications. Perfect for beginners, this course requires no prior knowledge of blockchain or advanced technical skills.
                        </p>
                        
                        <h4 className="font-medium mb-2">What You'll Learn</h4>
                        <ul className="space-y-2 mb-4">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                            <span>Core concepts of blockchain technology and how it works</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                            <span>How cryptocurrencies function and their role in decentralized systems</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                            <span>Understand Web3 applications and how they differ from traditional web apps</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                            <span>Setting up digital wallets and interacting with decentralized applications</span>
                          </li>
                        </ul>
                        
                        <div className="flex gap-2">
                          <Button className="bg-primary text-white hover:bg-primary-dark">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Enroll Now
                          </Button>
                          <Button variant="outline">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="transcript">
                        <div className="max-h-[300px] overflow-y-auto pr-2">
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>00:00</strong> - Welcome to our introduction to Web3 technology. In this lesson, we'll be covering the fundamentals of blockchain and how it forms the backbone of the decentralized web.
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>01:45</strong> - Blockchain is essentially a distributed ledger that records transactions across many computers. This ensures that the record cannot be altered retroactively without altering all subsequent blocks.
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>03:28</strong> - The key innovation of blockchain is that it allows for trustless transactions. This means that two parties can make an exchange without the need for a trusted third party.
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>05:12</strong> - In traditional systems, we rely on central authorities like banks to verify transactions. But in a blockchain system, verification is handled by the network through a process called consensus.
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>07:35</strong> - There are different consensus mechanisms, with Proof of Work and Proof of Stake being the most common. Each has its advantages and drawbacks in terms of security and efficiency.
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>10:20</strong> - Now, let's look at how these blockchain fundamentals apply specifically to agriculture and supply chains...
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="resources">
                        <div className="space-y-3">
                          <div className="flex items-center p-3 border rounded-md">
                            <FileText className="h-5 w-5 text-blue-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Course Slides (PDF)</h4>
                              <p className="text-sm text-gray-500">Complete slide deck from the video lessons</p>
                            </div>
                            <Button size="sm" variant="ghost" className="ml-auto">
                              Download
                            </Button>
                          </div>
                          
                          <div className="flex items-center p-3 border rounded-md">
                            <Code className="h-5 w-5 text-green-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Sample Code Repository</h4>
                              <p className="text-sm text-gray-500">GitHub repository with example projects</p>
                            </div>
                            <Button size="sm" variant="ghost" className="ml-auto">
                              Visit
                            </Button>
                          </div>
                          
                          <div className="flex items-center p-3 border rounded-md">
                            <BookOpen className="h-5 w-5 text-purple-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Additional Reading</h4>
                              <p className="text-sm text-gray-500">Curated articles and tutorials</p>
                            </div>
                            <Button size="sm" variant="ghost" className="ml-auto">
                              View List
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="border rounded-lg">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Course Content</h3>
                      <div className="text-sm text-gray-500 mt-1">8 lessons • 2 hours total</div>
                    </div>
                    
                    <div className="divide-y">
                      {featuredCourseLessons.map((lesson) => (
                        <div 
                          key={lesson.id} 
                          className={`p-3 flex items-center cursor-pointer transition-colors ${selectedLesson.id === lesson.id ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            ) : lesson.type === "video" ? (
                              <Video className="h-5 w-5 text-blue-500" />
                            ) : lesson.type === "article" ? (
                              <FileText className="h-5 w-5 text-purple-500" />
                            ) : (
                              <PanelRight className="h-5 w-5 text-amber-500" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{lesson.title}</h4>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                          
                          {selectedLesson.id === lesson.id && (
                            <div className="w-1.5 h-12 bg-primary rounded-l-full ml-3"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Recommended Courses</CardTitle>
              <CardDescription>
                Expand your knowledge with these curated courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.filter(course => course.progress === 0).map((course) => (
                  <motion.div 
                    key={course.id} 
                    className="border rounded-lg overflow-hidden"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-40 relative">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={
                          course.level === "Beginner" ? "secondary" :
                          course.level === "Intermediate" ? "outline" : "default"
                        }
                      >
                        {course.level}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-1 line-clamp-1">{course.title}</h4>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span>{course.lessons} lessons</span>
                        <span>{course.timeToComplete}</span>
                      </div>
                      <Button variant="default" size="sm" className="w-full justify-center bg-primary text-white hover:bg-primary-dark">
                        Start Learning
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Browse All Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
