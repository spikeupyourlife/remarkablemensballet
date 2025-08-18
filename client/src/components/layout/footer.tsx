import { Crown, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Content } from "@shared/schema";

export default function Footer() {
  const { data: socialMediaContent } = useQuery<Content>({
    queryKey: ["/api/content/social-media"],
  });

  const { data: contactContent } = useQuery<Content>({
    queryKey: ["/api/content/contact-info"],
  });

  const getSocialLinks = () => {
    try {
      return socialMediaContent?.content ? JSON.parse(socialMediaContent.content) : {};
    } catch {
      return {};
    }
  };

  const getContactInfo = () => {
    try {
      return contactContent?.content ? JSON.parse(contactContent.content) : {
        phone: "03 000 0000",
        email: "info@remarkablementsballet.com",
        address: "Of no Abode\nQueenstown, 9300"
      };
    } catch {
      return {
        phone: "03 000 0000",
        email: "info@remarkablementsballet.com",
        address: "Of no Abode\nQueenstown, 9300"
      };
    }
  };

  const socialLinks = getSocialLinks();
  const contactInfo = getContactInfo();

  return (
    <footer className="bg-midnight text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-magenta to-gold rounded-full flex items-center justify-center">
                <Crown className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-playfair text-2xl font-bold">Remarkable</h3>
                <p className="font-dancing text-magenta">Mens Ballet</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Redefining the art of ballet through bold expression, classical technique, and fearless creativity. Experience the extraordinary.
            </p>
            <div className="flex space-x-4">
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-magenta transition-colors duration-300">
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-magenta transition-colors duration-300">
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-magenta transition-colors duration-300">
                  <Youtube className="w-6 h-6" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-magenta transition-colors duration-300">
                  <Twitter className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
              <li><Link href="/performers" className="text-gray-400 hover:text-white transition-colors duration-300">Our Performers</Link></li>
              <li><Link href="/videos" className="text-gray-400 hover:text-white transition-colors duration-300">Video Gallery</Link></li>
              <li><Link href="/performances" className="text-gray-400 hover:text-white transition-colors duration-300">Upcoming Shows</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white transition-colors duration-300">Photo Gallery</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li>{contactInfo.phone}</li>
              <li>{contactInfo.email}</li>
              <li dangerouslySetInnerHTML={{ __html: contactInfo.address?.replace(/\n/g, '<br />') || '' }} />
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 Remarkable Mens Ballet. All rights reserved. | 
            <Link href="/privacy-policy" className="hover:text-magenta transition-colors duration-300 ml-1">Privacy Policy</Link> | 
            <Link href="/terms-of-service" className="hover:text-magenta transition-colors duration-300 ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
