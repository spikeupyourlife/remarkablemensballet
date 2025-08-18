import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Content } from "@shared/schema";

export default function Contact() {
  const { data: contactInfo } = useQuery<Content>({
    queryKey: ["/api/content", "contact-info"],
  });

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-5xl font-bold text-midnight mb-6">Get In Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Whether you're interested in our performances, have questions about classes, or want to collaborate, reach out to us.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="font-playfair text-3xl font-semibold text-midnight mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-magenta/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-magenta" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-1">Phone</h3>
                    <p className="text-gray-600">03 000 0000</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-magenta/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-magenta" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-1">Email</h3>
                    <p className="text-gray-600">info@remarkablementsballet.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-magenta/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-magenta" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-1">Address</h3>
                    <p className="text-gray-600">Of no Abode<br />Queenstown, 9300</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-magenta/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-magenta" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight mb-1">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <Card className="bg-gradient-to-br from-lavender to-pearl border-none">
              <CardContent className="p-6">
                <h3 className="font-playfair text-xl font-semibold text-midnight mb-3">Visit Our Studio</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our rehearsal studio is open for tours by appointment. Come see where the magic happens and meet our talented performers in their creative environment.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold text-midnight mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <Input placeholder="Your first name" className="border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <Input placeholder="Your last name" className="border-gray-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input type="email" placeholder="your.email@example.com" className="border-gray-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Input placeholder="What is this regarding?" className="border-gray-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your inquiry..."
                    className="border-gray-300 min-h-[120px] resize-none"
                  />
                </div>

                <Button className="w-full bg-magenta hover:bg-magenta/80 text-white py-3 font-medium">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}