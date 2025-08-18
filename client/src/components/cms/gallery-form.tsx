import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { insertGalleryPhotoSchema, type InsertGalleryPhoto, type GalleryPhoto, type Performer } from "@shared/schema";

// Form schema for handling string inputs that get converted to proper types
const galleryFormSchema = z.object({
  title: z.string(),
  imageUrl: z.string(),
  showDate: z.string().optional(),
  showName: z.string().optional(), 
  venue: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  performerIds: z.array(z.string()).optional(),
  whoTags: z.array(z.string()).optional(),
  whatTags: z.array(z.string()).optional(),
  whenTags: z.array(z.string()).optional(),
  whereTags: z.array(z.string()).optional(),
  whyTags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

type GalleryFormData = z.infer<typeof galleryFormSchema>;
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Upload, Calendar, MapPin, Users, Eye, Clock, Heart } from "lucide-react";
import type { UploadResult } from "@uppy/core";
import { ObjectUploader } from "@/components/ObjectUploader";

interface GalleryFormProps {
  photo?: GalleryPhoto;
  onSubmit?: () => void;
}

export default function GalleryForm({ photo, onSubmit }: GalleryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all performers for selection
  const { data: performers = [] } = useQuery<Performer[]>({
    queryKey: ["/api/performers"],
  });

  const form = useForm({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: photo?.title || "",
      imageUrl: photo?.imageUrl || "",
      showDate: photo?.showDate ? new Date(photo.showDate).toISOString().slice(0, 16) : "",
      showName: photo?.showName || "",
      description: photo?.description || "",
      tags: photo?.tags || [],
      performerIds: photo?.performerIds || [],
      whoTags: photo?.whoTags || [],
      whatTags: photo?.whatTags || [],
      whenTags: photo?.whenTags || [],
      whereTags: photo?.whereTags || [],
      whyTags: photo?.whyTags || [],
      featured: photo?.featured || false,
    },
  });

  // Custom tag management functions
  const addTag = (tagType: keyof Pick<GalleryFormData, 'whoTags' | 'whatTags' | 'whenTags' | 'whereTags' | 'whyTags'>) => {
    const currentTags = form.getValues(tagType) || [];
    form.setValue(tagType, [...currentTags, ""]);
  };

  const removeTag = (tagType: keyof Pick<GalleryFormData, 'whoTags' | 'whatTags' | 'whenTags' | 'whereTags' | 'whyTags'>, index: number) => {
    const currentTags = form.getValues(tagType) || [];
    const newTags = currentTags.filter((_, i) => i !== index);
    form.setValue(tagType, newTags);
  };

  const updateTag = (tagType: keyof Pick<GalleryFormData, 'whoTags' | 'whatTags' | 'whenTags' | 'whereTags' | 'whyTags'>, index: number, value: string) => {
    const currentTags = form.getValues(tagType) || [];
    const newTags = [...currentTags];
    newTags[index] = value;
    form.setValue(tagType, newTags);
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertGalleryPhoto) => {
      const response = await apiRequest("POST", "/api/gallery", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Gallery photo created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      form.reset();
      onSubmit?.();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertGalleryPhoto) => {
      const response = await apiRequest("PUT", `/api/gallery/${photo?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Gallery photo updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      onSubmit?.();
    },
  });

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    console.log("Upload result:", result);
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const uploadUrl = uploadedFile.uploadURL as string;
      console.log("Upload URL:", uploadUrl);
      
      if (uploadUrl) {
        try {
          // Set ACL policy and get normalized path like performer images
          const response = await apiRequest("PUT", "/api/gallery-images", { imageURL: uploadUrl });
          const data = await response.json();
          form.setValue("imageUrl", data.objectPath);
          toast({ title: "Image uploaded successfully" });
          console.log("Set image URL to:", data.objectPath);
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

  const handleGetUploadParameters = async () => {
    const response = await fetch('/api/objects/upload', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleSubmit = (data: GalleryFormData) => {
    console.log("Form data before formatting:", data);
    const formattedData: InsertGalleryPhoto = {
      ...data,
      showDate: data.showDate ? data.showDate : null,
      performerIds: data.performerIds?.filter(id => id.trim()) || [],
      whoTags: data.whoTags?.filter(tag => tag.trim()) || [],
      whatTags: data.whatTags?.filter(tag => tag.trim()) || [],
      whenTags: data.whenTags?.filter(tag => tag.trim()) || [],
      whereTags: data.whereTags?.filter(tag => tag.trim()) || [],
      whyTags: data.whyTags?.filter(tag => tag.trim()) || [],
    };
    console.log("Formatted data to send:", formattedData);

    if (photo) {
      updateMutation.mutate(formattedData);
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const addTagField = (fieldType: 'who' | 'what' | 'when' | 'where' | 'why') => {
    switch (fieldType) {
      case 'who': addTag('whoTags'); break;
      case 'what': addTag('whatTags'); break;
      case 'when': addTag('whenTags'); break;
      case 'where': addTag('whereTags'); break;
      case 'why': addTag('whyTags'); break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Photo Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter photo title" {...field} />
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
                        <Textarea placeholder="Describe the photo..." rows={3} {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <div className="space-y-4">
                        {field.value && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <img
                              src={field.value}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={5 * 1024 * 1024} // 5MB
                          onGetUploadParameters={handleGetUploadParameters}
                          onComplete={handleUploadComplete}
                          buttonClassName="w-full"
                        >
                          <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            <span>{field.value ? "Replace Image" : "Upload Image"}</span>
                          </div>
                        </ObjectUploader>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Photo</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Display this photo prominently in the gallery
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Show Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Show Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="showName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Show Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Swan Lake Reimagined" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Show Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Contextual Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Contextual Tags</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add relevant tags to help categorize and search this photo
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Performers Selection */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Performers</span>
                  <Badge variant="outline" className="text-xs">Select performers in this photo</Badge>
                </div>
                <FormField
                  control={form.control}
                  name="performerIds"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {performers.map((performer) => (
                          <FormField
                            key={performer.id}
                            control={form.control}
                            name="performerIds"
                            render={({ field }) => {
                              const isChecked = field.value?.includes(performer.id) || false;
                              return (
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValue, performer.id]);
                                        } else {
                                          field.onChange(currentValue.filter(id => id !== performer.id));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex-1">
                                    <FormLabel className="text-sm font-medium cursor-pointer">
                                      {performer.name}
                                    </FormLabel>
                                    <p className="text-xs text-muted-foreground">{performer.role}</p>
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Who Tags */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-pink-500" />
                  <span className="font-medium">Other People</span>
                  <Badge variant="outline" className="text-xs">Non-performer names</Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addTagField('who')}
                    className="ml-auto"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {(form.watch('whoTags') || []).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`whoTags.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="e.g., Alexander Rivera, Lead Dancers" 
                                {...field}
                                onChange={(e) => updateTag('whoTags', index, e.target.value)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeTag('whoTags', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* What Tags */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">What</span>
                  <Badge variant="outline" className="text-xs">What's happening</Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addTagField('what')}
                    className="ml-auto"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {(form.watch('whatTags') || []).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`whatTags.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="e.g., Performance, Rehearsal, Bow" 
                                {...field}
                                onChange={(e) => updateTag('whatTags', index, e.target.value)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeTag('whatTags', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* When Tags */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="font-medium">When</span>
                  <Badge variant="outline" className="text-xs">Time context</Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addTagField('when')}
                    className="ml-auto"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {(form.watch('whenTags') || []).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`whenTags.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="e.g., Opening Night, Final Bow, Intermission" 
                                {...field}
                                onChange={(e) => updateTag('whenTags', index, e.target.value)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeTag('whenTags', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Where Tags */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">Where</span>
                  <Badge variant="outline" className="text-xs">Location details</Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addTagField('where')}
                    className="ml-auto"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {(form.watch('whereTags') || []).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`whereTags.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="e.g., Main Stage, Backstage, Dressing Room" 
                                {...field}
                                onChange={(e) => updateTag('whereTags', index, e.target.value)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeTag('whereTags', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Tags */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Why</span>
                  <Badge variant="outline" className="text-xs">Context & purpose</Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addTagField('why')}
                    className="ml-auto"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {(form.watch('whyTags') || []).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`whyTags.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="e.g., Celebration, Behind-the-Scenes, Artistic Expression" 
                                {...field}
                                onChange={(e) => updateTag('whyTags', index, e.target.value)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeTag('whyTags', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : photo ? "Update Photo" : "Create Photo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}