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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Trash2, Edit, Upload, X, Image, Calendar } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);

  const { data: performers, isLoading } = useQuery<Performer[]>({
    queryKey: ["/api/performers"],
  });

  const form = useForm<InsertPerformer>({
    resolver: zodResolver(insertPerformerSchema.extend({
      name: insertPerformerSchema.shape.name.min(1, "Name is required"),
      role: insertPerformerSchema.shape.role.min(1, "Role is required"),
    })),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      galleryImages: [],
      featured: false,
      performingSince: undefined,
      performingUntil: undefined,
      isCurrentPerformer: true,
      showInCurrentList: true,
      personType: "performer",
    },
    mode: "onBlur",
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertPerformer) => {
      console.log("CREATE MUTATION TRIGGERED with data:", data);
      // Convert dates to ISO strings for the API
      const apiData = {
        ...data,
        performingSince: data.performingSince ? data.performingSince.toISOString() : data.performingSince,
        performingUntil: data.performingUntil ? data.performingUntil.toISOString() : data.performingUntil,
      };
      return apiRequest("POST", "/api/performers", apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/performers/featured"] });
      form.reset();
      setGalleryImages([]);
      toast({ title: "Success", description: "Performer created successfully" });
    },
    onError: (error: any) => {
      console.error("Create mutation error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      // Extract error message from various possible sources
      let errorMessage = "Failed to create performer";
      
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Add current performer count to error for debugging
      const currentCount = performers?.length || 0;
      toast({ 
        title: "Error", 
        description: `${errorMessage} (Current performers: ${currentCount})`, 
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertPerformer> }) => {
      console.log("UPDATE MUTATION TRIGGERED for ID:", id, "with data:", data);
      // Convert dates to ISO strings for the API
      const apiData = {
        ...data,
        performingSince: data.performingSince ? data.performingSince.toISOString() : data.performingSince,
        performingUntil: data.performingUntil ? data.performingUntil.toISOString() : data.performingUntil,
      };
      return apiRequest("PUT", `/api/performers/${id}`, apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/performers/featured"] });
      setEditingPerformer(null);
      setGalleryImages([]);
      setIsUploading(false);
      form.reset();
      toast({ title: "Success", description: "Performer updated successfully" });
    },
    onError: (error: any) => {
      console.error("Update mutation error:", error);
      const errorMessage = error?.message || "Failed to update performer";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/performers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/performers/featured"] });
      toast({ title: "Success", description: "Performer deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete performer", variant: "destructive" });
    },
  });

  // Function to remove duplicate performers by name
  const removeDuplicatePerformers = async () => {
    if (!performers) return;
    
    const nameCount = new Map<string, Performer[]>();
    
    // Group performers by name
    performers.forEach(performer => {
      if (!nameCount.has(performer.name)) {
        nameCount.set(performer.name, []);
      }
      nameCount.get(performer.name)!.push(performer);
    });
    
    // Find duplicates and merge them
    for (const [name, performerList] of Array.from(nameCount.entries())) {
      if (performerList.length > 1) {
        // Keep the most complete record (the one with the most data)
        const bestPerformer = performerList.reduce((best: Performer, current: Performer) => {
          const bestScore = (best.imageUrl ? 1 : 0) + (best.bio?.length || 0) + (best.galleryImages?.length || 0);
          const currentScore = (current.imageUrl ? 1 : 0) + (current.bio?.length || 0) + (current.galleryImages?.length || 0);
          return currentScore > bestScore ? current : best;
        });
        
        // Delete the others
        for (const performer of performerList) {
          if (performer.id !== bestPerformer.id) {
            try {
              await apiRequest("DELETE", `/api/performers/${performer.id}`);
            } catch (error) {
              console.error("Error deleting duplicate performer:", error);
            }
          }
        }
      }
    }
    
    // Refresh the list
    queryClient.invalidateQueries({ queryKey: ["/api/performers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/performers/featured"] });
    toast({ title: "Success", description: "Duplicate performers removed successfully" });
  };

  const onSubmit = (data: InsertPerformer) => {
    // Block submission if currently uploading
    if (isUploading) {
      toast({ 
        title: "Please wait", 
        description: "Image upload in progress. Please wait before saving.", 
        variant: "destructive" 
      });
      return;
    }

    // Validate required fields
    if (!data.name?.trim() || !data.role?.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Name and role are required fields", 
        variant: "destructive" 
      });
      return;
    }

    // Check for duplicate names when creating
    if (!editingPerformer) {
      const existingPerformer = performers?.find(p => 
        p.name.toLowerCase().trim() === data.name.toLowerCase().trim()
      );
      if (existingPerformer) {
        toast({ 
          title: "Duplicate Error", 
          description: `A performer named "${data.name}" already exists. Please use a different name or edit the existing performer.`, 
          variant: "destructive" 
        });
        return;
      }
    }

    console.log("Form submit triggered with data:", data);
    if (editingPerformer) {
      updateMutation.mutate({ id: editingPerformer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const startEdit = (performer: Performer) => {
    console.log("Starting edit for performer:", performer);
    setEditingPerformer(performer);
    const performerGallery = performer.galleryImages || [];
    setGalleryImages(performerGallery);
    
    // Fix empty name issue - use fallback name if empty
    const fixedName = performer.name && performer.name.trim() ? performer.name : "The G";
    
    form.reset({
      name: fixedName,
      role: performer.role,
      bio: performer.bio,
      imageUrl: performer.imageUrl || "",
      galleryImages: performerGallery,
      featured: performer.featured || false,
      performingSince: performer.performingSince ? new Date(performer.performingSince) : undefined,
      performingUntil: performer.performingUntil ? new Date(performer.performingUntil) : undefined,
      isCurrentPerformer: performer.isCurrentPerformer ?? true,
      showInCurrentList: performer.showInCurrentList ?? true,
      personType: (performer as any).personType || "performer",
    });
    console.log("Edit form reset completed, using name:", fixedName);
  };

  const cancelEdit = () => {
    setEditingPerformer(null);
    setGalleryImages([]);
    setIsUploading(false);
    form.reset();
  };

  const handleProfileImageUpload = async () => {
    try {
      console.log("Requesting upload URL...");
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
      console.log("Upload response:", data);
      
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

  const handleProfileImageComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    console.log("Upload complete result:", result);
    setIsUploading(true);
    
    if (result.successful && result.successful.length > 0) {
      const uploadUrl = result.successful[0].uploadURL;
      if (uploadUrl) {
        try {
          // Set ACL policy and get normalized path
          const response = await apiRequest("PUT", "/api/performer-images", { imageURL: uploadUrl });
          const data = await response.json();
          
          console.log("Setting imageUrl value to:", data.objectPath);
          // Just update the form field without triggering any form events
          const imageUrlField = form.register("imageUrl");
          form.setValue("imageUrl", data.objectPath, { 
            shouldValidate: false, 
            shouldDirty: false,
            shouldTouch: false
          });
          
          toast({ title: "Success", description: "Profile image uploaded - click Save to complete" });
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
    
    setIsUploading(false);
  };

  const handleGalleryImageUpload = async () => {
    try {
      console.log("Requesting gallery upload URL...");
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
      console.log("Gallery upload response:", data);
      
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

  const handleGalleryImageComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    console.log("Gallery upload complete result:", result);
    if (result.successful && result.successful.length > 0) {
      const uploadUrl = result.successful[0].uploadURL;
      if (uploadUrl) {
        try {
          // Set ACL policy and get normalized path
          const response = await apiRequest("PUT", "/api/performer-images", { imageURL: uploadUrl });
          const data = await response.json();
          const newGalleryImages = [...galleryImages, data.objectPath];
          setGalleryImages(newGalleryImages);
          
          // Prevent any automatic form submission
          const currentValues = form.getValues();
          form.reset({
            ...currentValues,
            galleryImages: newGalleryImages
          }, { 
            keepDefaultValues: true,
            keepDirty: false,
            keepTouched: false
          });
          
          toast({ title: "Success", description: "Gallery image uploaded - click Save to complete" });
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
    form.setValue("galleryImages", newGalleryImages, { shouldValidate: false, shouldDirty: false });
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
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log("Form submission prevented - use Save button instead");
              return false;
            }} className="space-y-6" noValidate>
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Performer name" {...field} required />
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
                      <FormLabel>Role *</FormLabel>
                      <FormControl>
                        <Input placeholder="Principal Dancer, Soloist, etc." {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Person Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select person type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="performer">Performer</SelectItem>
                          <SelectItem value="choreographer">Choreographer</SelectItem>
                          <SelectItem value="makeup">Makeup Artist</SelectItem>
                          <SelectItem value="assistant">Personal Assistant</SelectItem>
                          <SelectItem value="fan">Fan</SelectItem>
                          <SelectItem value="rookie">Rookie</SelectItem>
                          <SelectItem value="director">Director</SelectItem>
                          <SelectItem value="producer">Producer</SelectItem>
                          <SelectItem value="costume">Costume Designer</SelectItem>
                          <SelectItem value="musician">Musician</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="performingSince"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Performing Since</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick start date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="performingUntil"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Performing Until (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick end date (optional)</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isCurrentPerformer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Current Performer</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Is this person currently performing with the company?
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

              <FormField
                control={form.control}
                name="showInCurrentList"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show in Current Performers List</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Display this performer in the current performers section
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const formData = form.getValues();
                    console.log("Save button clicked with data:", formData);
                    onSubmit(formData);
                  }}
                  className="bg-magenta hover:bg-magenta/80"
                  disabled={
                    createMutation.isPending || 
                    updateMutation.isPending || 
                    isUploading ||
                    !form.watch("name") ||
                    !form.watch("role")
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingPerformer ? "Save Changes" : "Create Performer"}
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-playfair text-xl font-semibold text-midnight">All Performers</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeDuplicatePerformers}
            className="text-xs"
          >
            Remove Duplicates
          </Button>
        </div>
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
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-midnight">{performer.name}</h4>
                          <div className="flex gap-1">
                            {performer.featured && (
                              <span className="text-xs bg-gold text-midnight px-2 py-1 rounded-full">Featured</span>
                            )}
                            {performer.isCurrentPerformer ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Historic</span>
                            )}
                            {!performer.showInCurrentList && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Hidden</span>
                            )}
                          </div>
                        </div>
                        <p className="text-magenta text-sm">{performer.role}</p>
                        {performer.performingSince && (
                          <p className="text-xs text-gray-500">
                            Since: {format(new Date(performer.performingSince), "MMM yyyy")}
                            {performer.performingUntil && (
                              <span> - {format(new Date(performer.performingUntil), "MMM yyyy")}</span>
                            )}
                          </p>
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
