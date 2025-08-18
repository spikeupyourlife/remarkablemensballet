import { useQuery } from "@tanstack/react-query";
import { Play, ChevronDown, ArrowRight, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PerformerCard from "@/components/performer-card";
import VideoPlayer from "@/components/video-player";
import PerformanceCard from "@/components/performance-card";
import { Badge } from "@/components/ui/badge";
import type { Performer, Video, Performance } from "@shared/schema";
import heroImage from "@assets/FB_IMG_1608191733357_1755485442788.jpg";
import artisticVisionImage from "@assets/IMG_20191125_210353_1755485986058.jpg";

export default function Home() {
  const { data: featuredPerformers, isLoading: performersLoading } = useQuery<Performer[]>({
    queryKey: ["/api/performers/featured"],
  });

  const { data: featuredVideos, isLoading: videosLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos/featured"],
  });

  const { data: upcomingPerformances, isLoading: performancesLoading } = useQuery<Performance[]>({
    queryKey: ["/api/performances/upcoming"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/70 to-magenta/50 z-10"></div>
        <img 
          src={heroImage} 
          alt="The Remarkable Mens Ballet company performers in colorful makeup and tutus" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-in">
            Remarkable<br />
            <span className="text-gold font-dancing text-3xl sm:text-5xl lg:text-7xl">Mens Ballet</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 font-light max-w-2xl mx-auto leading-relaxed animate-slide-up px-4">
            Where artistry meets expression. Experience the beauty of ballet reimagined through bold performances and fearless creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up px-4">
            <Button 
              onClick={() => scrollToSection('videos')}
              className="bg-magenta hover:bg-magenta/80 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Performances
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('about')}
              className="border-2 border-white text-white hover:bg-white hover:text-midnight px-8 py-4 rounded-full text-lg font-medium transition-all duration-300"
            >
              Discover Our Story
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="text-white text-2xl" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-5xl font-bold text-midnight mb-6">Our Artistic Vision</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Breaking boundaries and redefining elegance through the timeless art of ballet.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="font-playfair text-3xl font-semibold text-midnight">Redefining Ballet Excellence</h3>
                <p className="text-gray-700 leading-relaxed">
                  The Remarkable Mens Ballet company was founded on the principle that artistic expression knows no boundaries. Our performers bring together classical ballet technique with contemporary interpretation, creating performances that celebrate both tradition and innovation.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Through our unique approach to choreography and costume design, we explore themes of identity, beauty, and artistic freedom. Each performance is a celebration of the human spirit and the transformative power of dance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Badge className="bg-lavender text-midnight px-4 py-2 text-sm font-medium">Classical Technique</Badge>
                  <Badge className="bg-magenta text-white px-4 py-2 text-sm font-medium">Contemporary Innovation</Badge>
                  <Badge className="bg-gold text-midnight px-4 py-2 text-sm font-medium">Artistic Expression</Badge>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={artisticVisionImage} 
                  alt="Two Remarkable Mens Ballet performers laughing and enjoying a moment together during rehearsal" 
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-magenta to-midnight p-6 rounded-2xl text-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold">15+</div>
                    <div className="text-sm font-medium">Professional Dancers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Performers */}
      <section id="performers" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-midnight mb-6">Our Stars</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the extraordinary artists who bring our vision to life on stage.
            </p>
          </div>
          
          {performersLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-80 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredPerformers?.map((performer) => (
                <PerformerCard key={performer.id} performer={performer} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button className="bg-midnight text-white hover:bg-magenta transition-colors duration-300 font-medium">
              Meet All Our Performers
            </Button>
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <section id="videos" className="py-20 bg-gradient-to-br from-lavender to-pearl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-midnight mb-6">Performance Highlights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the magic of our performances through these carefully curated video highlights.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Featured Video */}
            {featuredVideos && featuredVideos.length > 0 && (
              <div className="mb-12">
                <VideoPlayer video={featuredVideos[0]} featured={true} />
              </div>
            )}
            
            {/* Video Grid */}
            {videosLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVideos?.slice(1).map((video) => (
                  <VideoPlayer key={video.id} video={video} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Performances */}
      <section id="performances" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-midnight mb-6">Upcoming Performances</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't miss our upcoming shows. Book your tickets now for an unforgettable experience.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-6">
            {performancesLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-pearl rounded-2xl p-6 md:p-8 animate-pulse">
                  <div className="grid md:grid-cols-4 gap-6 items-center">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="md:col-span-2 space-y-2">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              upcomingPerformances?.map((performance) => (
                <PerformanceCard key={performance.id} performance={performance} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-5xl font-bold text-midnight mb-6">Get In Touch</h2>
              <p className="text-xl text-gray-600">
                Ready to book our company or have questions? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-magenta text-white rounded-full p-3 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-1">Phone</h3>
                    <p className="text-gray-600">03 000 0000</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-magenta text-white rounded-full p-3 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-1">Email</h3>
                    <p className="text-gray-600">info@remarkablemensballet.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-magenta text-white rounded-full p-3 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-1">Address</h3>
                    <p className="text-gray-600">Of no Abode<br />Queenstown, 9300</p>
                  </div>
                </div>
              </div>
              
              <Card className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent outline-none transition-all duration-200" 
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent outline-none transition-all duration-200" 
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">Subject</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent outline-none transition-all duration-200">
                        <option>Booking Inquiry</option>
                        <option>Press & Media</option>
                        <option>General Question</option>
                        <option>Collaboration</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">Message</label>
                      <textarea 
                        rows={4} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent outline-none transition-all duration-200 resize-none" 
                        placeholder="Tell us about your inquiry..."
                      ></textarea>
                    </div>
                    
                    <Button type="submit" className="w-full bg-magenta text-white hover:bg-magenta/80 transition-colors duration-300">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
