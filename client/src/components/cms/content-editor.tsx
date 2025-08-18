import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContentSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Edit, FileText } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Content, InsertContent } from "@shared/schema";

const contentSections = [
  {
    key: "about",
    title: "About Section",
    description: "Main about section content on the homepage",
    type: "text"
  },
  {
    key: "hero-subtitle",
    title: "Hero Subtitle", 
    description: "Subtitle text displayed in the hero section",
    type: "text"
  },
  {
    key: "company-mission",
    title: "Company Mission",
    description: "Mission statement and company values",
    type: "text"
  },
  {
    key: "contact-info",
    title: "Contact Information",
    description: "Phone, email, and address information (JSON format)",
    type: "json"
  },
  {
    key: "social-media",
    title: "Social Media Links",
    description: "Social media URLs and handles (JSON format)",
    type: "json"
  },
  {
    key: "privacy-policy",
    title: "Privacy Policy",
    description: "Privacy policy content for legal compliance",
    type: "text"
  },
  {
    key: "terms-of-service", 
    title: "Terms of Service",
    description: "Terms of service agreement content",
    type: "text"
  },
];

export default function ContentEditor() {
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState("about");
  const [isEditing, setIsEditing] = useState(false);

  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  const { data: currentContent } = useQuery<Content>({
    queryKey: ["/api/content", selectedSection],
    enabled: !!selectedSection,
  });

  const form = useForm<InsertContent>({
    resolver: zodResolver(insertContentSchema),
    defaultValues: {
      key: selectedSection,
      title: "",
      content: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertContent) => apiRequest("POST", "/api/content", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/content", selectedSection] });
      setIsEditing(false);
      toast({ title: "Success", description: "Content updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update content", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertContent) => {
    // Validate JSON for JSON type fields
    if (isJsonType) {
      try {
        JSON.parse(data.content || "{}");
      } catch (error) {
        toast({ 
          title: "Invalid JSON", 
          description: "Please enter valid JSON format. Check your syntax.", 
          variant: "destructive" 
        });
        return;
      }
    }
    updateMutation.mutate({ ...data, key: selectedSection });
  };

  const startEditing = () => {
    setIsEditing(true);
    form.reset({
      key: selectedSection,
      title: currentContent?.title || "",
      content: currentContent?.content || "",
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    form.reset();
  };

  const selectedSectionInfo = contentSections.find(section => section.key === selectedSection);
  const isJsonType = selectedSectionInfo?.type === "json";
  
  const getPlaceholderText = () => {
    if (selectedSection === "contact-info") {
      return `{
  "phone": "+1-555-0123",
  "email": "info@remarkablemens.ballet",
  "address": "123 Dance Street, Arts District, NY 10001",
  "hours": "Mon-Fri 9AM-6PM"
}`;
    }
    if (selectedSection === "social-media") {
      return `{
  "facebook": "https://facebook.com/remarkablemens",
  "instagram": "https://instagram.com/remarkablemens", 
  "twitter": "https://twitter.com/remarkablemens",
  "youtube": "https://youtube.com/@remarkablemens",
  "tiktok": "https://tiktok.com/@remarkablemens"
}`;
    }
    return "Enter your content here...";
  };

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Section Selector */}
        <div className="lg:col-span-1">
          <h3 className="font-playfair text-xl font-semibold text-midnight mb-4">Content Sections</h3>
          <div className="space-y-2">
            {contentSections.map((section) => (
              <Button
                key={section.key}
                variant={selectedSection === section.key ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto py-2 px-3 ${
                  selectedSection === section.key 
                    ? "bg-magenta hover:bg-magenta/80 text-white" 
                    : "hover:bg-pearl"
                }`}
                onClick={() => {
                  setSelectedSection(section.key);
                  setIsEditing(false);
                  form.reset();
                }}
              >
                <div className="w-full">
                  <div className="font-medium text-sm leading-tight">{section.title}</div>
                  <div className="text-xs opacity-80 leading-tight mt-1 break-words pr-2">{section.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-playfair text-xl font-semibold text-midnight">
                    {selectedSectionInfo?.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{selectedSectionInfo?.description}</p>
                </div>
                {!isEditing && (
                  <Button onClick={startEditing} className="bg-magenta hover:bg-magenta/80">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Content
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter section title..." {...field} value={field.value || ""} />
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
                          <FormLabel>Content {isJsonType && "(JSON Format)"}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={getPlaceholderText()} 
                              rows={isJsonType ? 8 : 12}
                              className="resize-none font-mono text-sm"
                              {...field} 
                            />
                          </FormControl>
                          {isJsonType && (
                            <div className="text-xs text-gray-500">
                              Enter valid JSON format. Use the placeholder as a template.
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        className="bg-magenta hover:bg-magenta/80"
                        disabled={updateMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button type="button" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  {currentContent ? (
                    <>
                      {currentContent.title && (
                        <div>
                          <h4 className="font-semibold text-midnight mb-2">Title:</h4>
                          <p className="text-gray-700 bg-pearl p-4 rounded-lg">
                            {currentContent.title}
                          </p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-midnight mb-2">Content:</h4>
                        <div className="text-gray-700 bg-pearl p-4 rounded-lg whitespace-pre-wrap">
                          {currentContent.content || "No content available"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last updated: {currentContent.updatedAt ? new Date(currentContent.updatedAt).toLocaleDateString() : "Unknown"}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No content found for this section.</p>
                      <p className="text-gray-400 text-sm">Click "Edit Content" to add content.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Overview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-playfair text-xl font-semibold text-midnight mb-4">Content Overview</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentSections.map((section) => {
              const content = allContent?.find(c => c.key === section.key);
              return (
                <div 
                  key={section.key}
                  className="border rounded-lg p-4 hover:bg-pearl transition-colors cursor-pointer"
                  onClick={() => setSelectedSection(section.key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-midnight">{section.title}</h4>
                    {content ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full" title="Content available" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-300 rounded-full" title="No content" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{section.description}</p>
                  {content && (
                    <p className="text-xs text-gray-500 truncate">
                      {content.content ? `${content.content.slice(0, 60)}...` : "No content"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
