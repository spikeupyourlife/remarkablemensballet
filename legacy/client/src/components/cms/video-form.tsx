import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVideoSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit, Play, Upload, Image } from "lucide-react";
import type { UploadResult } from "@uppy/core";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Video, InsertVideo } from "@shared/schema";

export default function VideoForm() {
  const { toast } = useToast();
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const form = useForm<InsertVideo>({
    resolver: zodResolver(insertVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      videoType: "youtube",
      startTime: "",
      endTime: "",
      featured: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertVideo) => apiRequest("POST", "/api/videos", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      form.reset({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        videoType: "youtube",
        startTime: "",
        endTime: "",
        featured: false,
      });
      toast({ title: "Success", description: "Video saved successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save video", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertVideo> }) =>
      apiRequest("PUT", `/api/videos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setEditingVideo(null);
      form.reset({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        videoType: "youtube",
        startTime: "",
        endTime: "",
        featured: false,
      });
      toast({ title: "Success", description: "Video updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update video", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/videos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({ title: "Success", description: "Video deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete video", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertVideo) => {
    console.log("Form submitted with data:", data);
    
    // Ensure we have the required fields
    if (!data.title || !data.videoUrl) {
      toast({ 
        title: "Missing Information", 
        description: "Please provide at least a title and video URL", 
        variant: "destructive" 
      });
      return;
    }
    
    if (editingVideo) {
      updateMutation.mutate({ id: editingVideo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const startEdit = (video: Video) => {
    setEditingVideo(video);
    form.reset({
      title: video.title,
      description: video.description || "",
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || "",
      videoType: (video as any).videoType || "youtube",
      startTime: (video as any).startTime || "",
      endTime: (video as any).endTime || "",
      featured: video.featured || false,
    });
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    setIsUploading(false);
    form.reset({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      videoType: "youtube",
      startTime: "",
      endTime: "",
      featured: false,
    });
  };

  const handleThumbnailUpload = async () => {
    try {
      console.log("Requesting thumbnail upload URL...");
      const response = await fetch("/api/objects/upload", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Thumbnail upload response:", data);
      
      if (!data.uploadURL) {
        throw new Error("No upload URL received");
      }
      
      return {
        method: "PUT" as const,
        url: data.uploadURL,
      };
    } catch (error) {
      console.error("Error getting upload URL:", error);
      toast({ title: "Error", description: "Failed to get upload URL", variant: "destructive" });
      throw error;
    }
  };

  const handleThumbnailComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    console.log("Thumbnail upload complete result:", result);
    setIsUploading(true);
    
    if (result.successful && result.successful.length > 0) {
      const uploadUrl = result.successful[0].uploadURL;
      if (uploadUrl) {
        try {
          // Set ACL policy and get normalized path
          const response = await apiRequest("PUT", "/api/performer-images", { imageURL: uploadUrl });
          const data = await response.json();
          
          console.log("Setting thumbnailUrl value to:", data.objectPath);
          // Just update the form field, don't auto-save the video
          form.setValue("thumbnailUrl", data.objectPath, { 
            shouldValidate: true, 
            shouldDirty: true,
            shouldTouch: true
          });
          
          toast({ title: "Success", description: "Thumbnail uploaded successfully - remember to save the video" });
        } catch (error) {
          console.error("Error setting thumbnail ACL:", error);
          toast({ title: "Error", description: "Failed to process uploaded thumbnail", variant: "destructive" });
        }
      }
    } else if (result.failed && result.failed.length > 0) {
      console.error("Thumbnail upload failed:", result.failed);
      const errorMsg = result.failed[0].error || "Unknown upload error";
      toast({ title: "Upload Failed", description: errorMsg, variant: "destructive" });
    }
    
    setIsUploading(false);
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-playfair text-xl font-semibold text-midnight mb-4">
            {editingVideo ? "Edit Video" : "Add New Video"}
          </h3>
          
          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log("Form submit event triggered");
              form.handleSubmit(onSubmit)(e);
            }} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Video title" 
                        {...field} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            console.log("Enter pressed in title field - prevented submission");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/655686235" 
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            console.log("Enter pressed in URL field - prevented submission");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="videoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "youtube"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="vimeo">Vimeo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Thumbnail</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input 
                            placeholder="Or enter thumbnail URL" 
                            {...field} 
                            value={field.value || ""} 
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                console.log("Enter pressed in thumbnail URL field - prevented submission");
                              }
                            }}
                          />
                          <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                              <ObjectUploader
                                maxFileSize={5242880} // 5MB limit
                                onGetUploadParameters={handleThumbnailUpload}
                                onComplete={handleThumbnailComplete}
                                buttonClassName="bg-magenta text-white hover:bg-midnight text-sm"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Thumbnail
                              </ObjectUploader>
                              {isUploading && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-magenta border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm text-gray-600">Uploading...</span>
                                </div>
                              )}
                              {field.value && !isUploading && (
                                <div className="flex items-center space-x-2">
                                  <Image className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-green-600">Thumbnail ready</span>
                                </div>
                              )}
                            </div>
                            {field.value && (
                              <div className="text-xs text-gray-500">
                                Preview: {field.value}
                              </div>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 2m30s or 46m" 
                          {...field} 
                          value={field.value || ""} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              console.log("Enter pressed in start time field - prevented submission");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 5m15s or 48m" 
                          {...field} 
                          value={field.value || ""} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              console.log("Enter pressed in end time field - prevented submission");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Video description..." 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Video</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Display this video prominently on the homepage
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={cancelEdit}
                  disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                >
                  {editingVideo ? "Cancel" : "Clear Form"}
                </Button>
                
                <Button 
                  type="submit" 
                  className="bg-magenta hover:bg-magenta/80"
                  disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    "Saving..."
                  ) : (
                    editingVideo ? "Update Video" : "Save Video"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Videos List */}
      <div>
        <h3 className="font-playfair text-xl font-semibold text-midnight mb-4">Current Videos</h3>
        {isLoading ? (
          <p>Loading videos...</p>
        ) : videos && videos.length > 0 ? (
          <div className="grid gap-4">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {video.thumbnailUrl && (
                        <div className="relative">
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title}
                            className="w-20 h-12 rounded object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-midnight">{video.title}</h4>
                        <p className="text-gray-600 text-sm">{video.description}</p>
                        {video.featured && (
                          <span className="text-xs bg-gold text-midnight px-2 py-1 rounded-full">Featured</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(video)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(video.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No videos found.</p>
        )}
      </div>
    </div>
  );
}
