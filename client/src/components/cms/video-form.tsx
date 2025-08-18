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
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit, Play } from "lucide-react";
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
      featured: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertVideo) => apiRequest("POST", "/api/videos", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      form.reset();
      toast({ title: "Success", description: "Video created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create video", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertVideo> }) =>
      apiRequest("PUT", `/api/videos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setEditingVideo(null);
      form.reset();
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
      featured: video.featured || false,
    });
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    form.reset();
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Video title" {...field} />
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
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  type="submit" 
                  className="bg-magenta hover:bg-magenta/80"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingVideo ? "Update Video" : "Add Video"}
                </Button>
                
                {editingVideo && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
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
