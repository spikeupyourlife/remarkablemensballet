import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Video, Calendar, Camera, FileText } from "lucide-react";
import PerformerForm from "@/components/cms/performer-form";
import VideoForm from "@/components/cms/video-form";
import PerformanceForm from "@/components/cms/performance-form";
import GalleryManagement from "@/components/cms/gallery-management";
import ContentEditor from "@/components/cms/content-editor";

export default function CMS() {
  return (
    <div className="pt-20 min-h-screen bg-pearl">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-5xl font-bold text-midnight mb-6">Content Management System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Manage your ballet company's content with ease. Update performers, videos, performances, and website content.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="performers" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5 mx-auto">
              <TabsTrigger value="performers" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Team</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center space-x-2">
                <Video className="w-4 h-4" />
                <span>Videos</span>
              </TabsTrigger>
              <TabsTrigger value="performances" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Performances</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Content</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performers">
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-midnight">Manage Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformerForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos">
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-midnight">Manage Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performances">
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-midnight">Manage Performances</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryManagement />
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-midnight">Manage Website Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContentEditor />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
