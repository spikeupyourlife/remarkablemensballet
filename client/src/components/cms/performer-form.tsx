import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPerformerSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit, Upload, X, Image } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Performer, InsertPerformer } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

export default function PerformerForm() {
  const { toast } = useToast();
  const [editingPerformer, setEditingPerformer] = useState<Performer | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const { data: performers, isLoading } = useQuery<Performer[]>({
    queryKey: ["/api/performers"],
  });

  const form = useForm<InsertPerformer>({
    resolver: zodResolver(insertPerformerSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      galleryImages: [],
      featured: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertPerformer) => apiRequest("POST", "/api/performers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performers"] });
      form.reset();
      toast({ title: "Success", description: "Performer created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create performer", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertPerformer> }) =>
      apiRequest("PUT", `/api/performers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performers"] });
      setEditingPerformer(null);
      form.reset();
      toast({ title: "Success", description: "Performer updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update performer", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/performers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performers"] });
      toast({ title: "Success", description: "Performer deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete performer", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertPerformer) => {
    if (editingPerformer) {
      updateMutation.mutate({ id: editingPerformer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const startEdit = (performer: Performer) => {
    setEditingPerformer(performer);
    const performerGallery = performer.galleryImages || [];
    setGalleryImages(performerGallery);
    form.reset({
      name: performer.name,
      role: performer.role,
      bio: performer.bio,
      imageUrl: performer.imageUrl || "",
      galleryImages: performerGallery,
      featured: performer.featured || false,
    });
  };

  const cancelEdit = () => {
    setEditingPerformer(null);
    setGalleryImages([]);
    form.reset();
  };

  const handleProfileImageUpload = async () => {
    try {
      const response = await apiRequest("POST", "/api/objects/upload");
      console.log("Upload response:", response);
      const uploadURL = (response as any).uploadURL;
      if (!uploadURL) {
        throw new Error("No upload URL received");
      }
      return {
        method: "PUT" as const,
        url: uploadURL,
      };
    } catch (error) {
      console.error("Error getting upload URL:", error);
      toast({ title: "Error", description: "Failed to get upload URL", variant: "destructive" });
      throw error;
    }
  };

  const handleProfileImageComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    console.log("Upload complete result:", result);
    if (result.successful && result.successful.length > 0) {
      const uploadUrl = result.successful[0].uploadURL;
      if (uploadUrl) {
        try {
          // Set ACL policy and get normalized path
          const response = await apiRequest("PUT", "/api/performer-images", { imageURL: uploadUrl });
          form.setValue("imageUrl", (response as any).objectPath);
          toast({ title: "Success", description: "Profile image uploaded successfully" });
        } catch (error) {
          console.error("Error setting image ACL:", error);
          toast({ title: "Error", description: "Failed to process uploaded image", variant: "destructive" });
        }
      }
    } else if (result.failed && result.failed.length > 0) {
      console.error("Upload failed:", result.failed);
      const errorMsg = result.failed[0].error || "Unknown upload error";
      toast({ title: "Upload Failed", description: errorMsg, variant: "destructive" });
    }
  };

  const handleGalleryImageUpload = async () => {
    try {
      const response = await apiRequest("POST", "/api/objects/upload");
      console.log("Upload response:", response);
      const uploadURL = (response as any).uploadURL;
      if (!uploadURL) {
        throw new Error("No upload URL received");
      }
      return {
        method: "PUT" as const,
        url: uploadURL,
      };
    } catch (error) {
      console.error("Error getting upload URL:", error);
      toast({ title: "Error", description: "Failed to get upload URL", variant: "destructive" });
      throw error;
    }
  };

  const handleGalleryImageComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    console.log("Gallery upload complete result:", result);
    if (result.successful && result.successful.length > 0) {
      const uploadUrl = result.successful[0].uploadURL;
      if (uploadUrl) {
        try {
          // Set ACL policy and get normalized path
          const response = await apiRequest("PUT", "/api/performer-images", { imageURL: uploadUrl });
          const newGalleryImages = [...galleryImages, (response as any).objectPath];
          setGalleryImages(newGalleryImages);
          form.setValue("galleryImages", newGalleryImages);
          toast({ title: "Success", description: "Gallery image uploaded successfully" });
        } catch (error) {
          console.error("Error setting image ACL:", error);
          toast({ title: "Error", description: "Failed to process uploaded image", variant: "destructive" });
        }
      }
    } else if (result.failed && result.failed.length > 0) {
      console.error("Gallery upload failed:", result.failed);
      const errorMsg = result.failed[0].error || "Unknown upload error";
      toast({ title: "Upload Failed", description: errorMsg, variant: "destructive" });
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGalleryImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newGalleryImages);
    form.setValue("galleryImages", newGalleryImages);
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-playfair text-xl font-semibold text-midnight mb-4">
            {editingPerformer ? "Edit Performer" : "Add New Performer"}
          </h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Performer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Principal Dancer, Soloist, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input placeholder="Image URL or upload below" {...field} value={field.value || ""} />
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <ObjectUploader
                              maxFileSize={5242880} // 5MB limit
                              onGetUploadParameters={handleProfileImageUpload}
                              onComplete={handleProfileImageComplete}
                              buttonClassName="bg-magenta text-white hover:bg-midnight"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Profile Image
                            </ObjectUploader>
                            {field.value && (
                              <div className="flex items-center space-x-2">
                                <Image className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600">Image uploaded</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            📸 Recommended: High-quality images, max 5MB. For best results, use 800x800px or larger for profile images.
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="galleryImages"
                render={() => (
                  <FormItem>
                    <FormLabel>Gallery Images</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <ObjectUploader
                              maxFileSize={5242880} // 5MB limit
                              onGetUploadParameters={handleGalleryImageUpload}
                              onComplete={handleGalleryImageComplete}
                              buttonClassName="bg-midnight text-white hover:bg-magenta"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Add Gallery Image
                            </ObjectUploader>
                            <span className="text-sm text-gray-600">
                              {galleryImages.length} image{galleryImages.length !== 1 ? 's' : ''} uploaded
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            🎭 Gallery images showcase the performer's work. Use high-quality photos max 5MB each.
                          </p>
                        </div>
                        {galleryImages.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {galleryImages.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  <img 
                                    src={imageUrl} 
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLImageElement;
                                      target.style.display = 'none';
                                      const sibling = target.nextElementSibling as HTMLElement;
                                      if (sibling) sibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="hidden w-full h-full items-center justify-center">
                                    <Image className="w-8 h-8 text-gray-400" />
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeGalleryImage(index)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Performer's biography and background..." 
                        rows={4}
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
                      <FormLabel className="text-base">Featured Performer</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Display this performer on the homepage
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
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
                  {editingPerformer ? "Update Performer" : "Add Performer"}
                </Button>
                
                {editingPerformer && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Performers List */}
      <div>
        <h3 className="font-playfair text-xl font-semibold text-midnight mb-4">Current Performers</h3>
        {isLoading ? (
          <p>Loading performers...</p>
        ) : performers && performers.length > 0 ? (
          <div className="grid gap-4">
            {performers.map((performer) => (
              <Card key={performer.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {performer.imageUrl && (
                        <img 
                          src={performer.imageUrl} 
                          alt={performer.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-midnight">{performer.name}</h4>
                        <p className="text-magenta text-sm">{performer.role}</p>
                        {performer.featured && (
                          <span className="text-xs bg-gold text-midnight px-2 py-1 rounded-full">Featured</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(performer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(performer.id)}
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
          <p className="text-gray-500">No performers found.</p>
        )}
      </div>
    </div>
  );
}
