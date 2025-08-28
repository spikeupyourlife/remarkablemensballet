import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPressArticleSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Trash2, Edit, Upload, X, Image, Calendar, ExternalLink, FileText, Users } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { PressArticle, InsertPressArticle, Performer } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

export default function PressForm() {
  const { toast } = useToast();
  const [editingArticle, setEditingArticle] = useState<PressArticle | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: articles, isLoading } = useQuery<PressArticle[]>({
    queryKey: ["/api/press"],
  });

  // Fetch performers for selection
  const { data: performers = [] } = useQuery<Performer[]>({
    queryKey: ["/api/performers"],
  });

  const form = useForm<InsertPressArticle>({
    resolver: zodResolver(insertPressArticleSchema.extend({
      title: insertPressArticleSchema.shape.title.min(1, "Title is required"),
      content: insertPressArticleSchema.shape.content.min(1, "Content is required"),
    })),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      sourceUrl: "",
      sourceName: "",
      author: "",
      publishedDate: undefined,
      featured: false,
      tags: [],
      performerIds: [],
      imageUrl: "",
    },
    mode: "onBlur",
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertPressArticle) => {
      console.log("Creating press article with data:", data);
      const apiData = {
        ...data,
        publishedDate: data.publishedDate ? data.publishedDate.toISOString() : data.publishedDate,
      };
      return apiRequest("POST", "/api/press", apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/press"] });
      queryClient.invalidateQueries({ queryKey: ["/api/press/featured"] });
      form.reset();
      toast({
        title: "Success",
        description: "Press article created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating press article:", error);
      toast({
        title: "Error",
        description: "Failed to create press article",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertPressArticle }) => {
      const apiData = {
        ...data,
        publishedDate: data.publishedDate ? data.publishedDate.toISOString() : data.publishedDate,
      };
      return apiRequest("PUT", `/api/press/${id}`, apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/press"] });
      queryClient.invalidateQueries({ queryKey: ["/api/press/featured"] });
      setEditingArticle(null);
      form.reset();
      toast({
        title: "Success",
        description: "Press article updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating press article:", error);
      toast({
        title: "Error",
        description: "Failed to update press article",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/press/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/press"] });
      queryClient.invalidateQueries({ queryKey: ["/api/press/featured"] });
      toast({
        title: "Success",
        description: "Press article deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting press article:", error);
      toast({
        title: "Error",
        description: "Failed to delete press article",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPressArticle) => {
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (article: PressArticle) => {
    setEditingArticle(article);
    form.reset({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      sourceUrl: article.sourceUrl || "",
      sourceName: article.sourceName || "",
      author: article.author || "",
      publishedDate: article.publishedDate ? new Date(article.publishedDate) : undefined,
      featured: article.featured || false,
      tags: article.tags || [],
      performerIds: article.performerIds || [],
      imageUrl: article.imageUrl || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
    form.reset();
  };

  const handleImageUpload = () => {
    return apiRequest("POST", "/api/objects/upload").then((response: any) => ({
      method: "PUT" as const,
      url: response.uploadURL,
    }));
  };

  const handleImageComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const imageUrl = result.successful[0].response?.uploadURL || "";
      form.setValue("imageUrl", imageUrl);
      setIsUploading(false);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    }
  };

  const addTag = () => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", [...currentTags, ""]);
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, value: string) => {
    const currentTags = form.getValues("tags") || [];
    const newTags = [...currentTags];
    newTags[index] = value;
    form.setValue("tags", newTags);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magenta mx-auto mb-2"></div>
          <p className="text-gray-600">Loading press articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-midnight mb-4">
          {editingArticle ? "Edit Press Article" : "Add New Press Article"}
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Article title" {...field} data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dance Magazine" {...field} data-testid="input-source-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Article author" {...field} data-testid="input-author" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publishedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                            data-testid="button-publication-date"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
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
            </div>

            <FormField
              control={form.control}
              name="sourceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value || ""} data-testid="input-source-url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary or key quote..." 
                      {...field} 
                      value={field.value || ""}
                      rows={3}
                      data-testid="textarea-excerpt"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Article Content *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Full article text..." 
                      {...field} 
                      rows={8}
                      data-testid="textarea-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-4">
              <FormLabel>Article Image</FormLabel>
              <div className="flex items-center gap-4">
                <ObjectUploader
                  onGetUploadParameters={handleImageUpload}
                  onComplete={handleImageComplete}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  buttonClassName="bg-magenta text-white hover:bg-midnight"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </ObjectUploader>
                {form.watch("imageUrl") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => form.setValue("imageUrl", "")}
                    data-testid="button-remove-image"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove Image
                  </Button>
                )}
              </div>
              {form.watch("imageUrl") && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                  <img
                    src={form.watch("imageUrl")}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <FormLabel>Categories/Tags</FormLabel>
              <div className="space-y-2">
                {(form.watch("tags") || []).map((tag, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder={`Tag ${index + 1}`}
                      className="flex-1"
                      data-testid={`input-tag-${index}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTag(index)}
                      data-testid={`button-remove-tag-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="w-full"
                  data-testid="button-add-tag"
                >
                  Add Tag
                </Button>
              </div>
            </div>

            {/* Performers Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <FormLabel>Performers Featured</FormLabel>
                <Badge variant="outline" className="text-xs">Select performers mentioned in this article</Badge>
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
                                    data-testid={`checkbox-performer-${performer.id}`}
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

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Article</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Display this article prominently on the site
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                      data-testid="switch-featured"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                data-testid="button-submit"
              >
                {editingArticle ? "Update Article" : "Create Article"}
              </Button>
              {editingArticle && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-midnight mb-4">
          Existing Press Articles ({articles?.length || 0})
        </h3>

        {articles && articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-midnight line-clamp-1">{article.title}</h4>
                        {article.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-magenta text-white">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        {article.sourceName && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>{article.sourceName}</span>
                          </div>
                        )}
                        {article.author && (
                          <div className="flex items-center gap-1">
                            <span>by {article.author}</span>
                          </div>
                        )}
                        {article.publishedDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {article.sourceUrl && (
                          <div className="flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            <a 
                              href={article.sourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Original
                            </a>
                          </div>
                        )}
                      </div>

                      {article.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(article)}
                        data-testid={`button-edit-${article.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(article.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${article.id}`}
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
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No press articles yet. Create your first article above.</p>
          </div>
        )}
      </div>
    </div>
  );
}