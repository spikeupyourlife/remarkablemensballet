import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertPerformanceSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit, Calendar, Plus, Image, Clock, Star } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Performance, InsertPerformance } from "@shared/schema";

export default function PerformanceForm() {
  const { toast } = useToast();
  const [editingPerformance, setEditingPerformance] = useState<Performance | null>(null);

  const { data: performances, isLoading } = useQuery<Performance[]>({
    queryKey: ["/api/performances"],
  });

  const form = useForm<InsertPerformance>({
    resolver: zodResolver(insertPerformanceSchema),
    defaultValues: {
      title: "",
      description: "",
      venue: "",
      date: new Date(),
      time: "",
      posterUrl: "",
      showTimes: [{ date: new Date().toISOString().split('T')[0], time: "", additionalInfo: "" }],
      ticketUrl: "",
      featured: false,
    },
  });

  const { fields: showTimeFields, append: addShowTime, remove: removeShowTime } = useFieldArray({
    control: form.control,
    name: "showTimes",
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertPerformance) => apiRequest("POST", "/api/performances", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performances"] });
      form.reset();
      toast({ title: "Success", description: "Performance created successfully" });
    },
    onError: (error: any) => {
      console.error("Create performance error:", error);
      const errorMessage = error?.response?.data?.error || "Failed to create performance";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertPerformance> }) =>
      apiRequest("PUT", `/api/performances/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performances"] });
      setEditingPerformance(null);
      form.reset();
      toast({ title: "Success", description: "Performance updated successfully" });
    },
    onError: (error: any) => {
      console.error("Update performance error:", error);
      const errorMessage = error?.response?.data?.error || "Failed to update performance";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/performances/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performances"] });
      toast({ title: "Success", description: "Performance deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete performance", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertPerformance) => {
    if (editingPerformance) {
      updateMutation.mutate({ id: editingPerformance.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const startEdit = (performance: Performance) => {
    setEditingPerformance(performance);
    const showTimes = performance.showTimes || [{ 
      date: new Date(performance.date).toISOString().split('T')[0], 
      time: performance.time, 
      additionalInfo: "" 
    }];
    
    form.reset({
      title: performance.title,
      description: performance.description || "",
      venue: performance.venue,
      date: new Date(performance.date),
      time: performance.time,
      posterUrl: performance.posterUrl || "",
      showTimes: showTimes,
      ticketUrl: performance.ticketUrl || "",
      featured: performance.featured || false,
    });
  };

  const cancelEdit = () => {
    setEditingPerformance(null);
    form.reset();
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  if (isLoading) {
    return <div>Loading performances...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Performances</h2>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingPerformance ? "Edit Performance" : "Add New Performance"}
          </h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performance Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter performance title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter venue name" {...field} />
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
                        placeholder="Enter performance description" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="posterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poster Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Upload poster image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show Times Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base font-medium">Show Times *</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addShowTime({ 
                      date: new Date().toISOString().split('T')[0], 
                      time: "", 
                      additionalInfo: "" 
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Show Time
                  </Button>
                </div>

                {showTimeFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium">Show Time {index + 1}</h4>
                      {showTimeFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeShowTime(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name={`showTimes.${index}.date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`showTimes.${index}.time`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 7:30 PM" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`showTimes.${index}.additionalInfo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Info</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Matinee, Opening Night" 
                                {...field} 
                                value={field.value || ""} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ticketUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://..." 
                          {...field} 
                          value={field.value || ""} 
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gold" />
                          Featured Performance
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Show this performance on the home page
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Legacy fields for backward compatibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legacy Date (for compatibility)</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={formatDateForInput(field.value)}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legacy Time (for compatibility)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 7:30 PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingPerformance ? "Update Performance" : "Create Performance"}
                </Button>
                {editingPerformance && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Existing Performances */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Performances</h3>
        {performances && performances.length > 0 ? (
          performances.map((performance) => (
            <Card key={performance.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{performance.title}</h4>
                    <p className="text-sm text-gray-600">{performance.venue}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(performance.date).toLocaleDateString()} at {performance.time}
                    </p>
                    {performance.showTimes && performance.showTimes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Additional Show Times:</p>
                        {performance.showTimes.map((showTime, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {new Date(showTime.date).toLocaleDateString()} at {showTime.time}
                            {showTime.additionalInfo && ` (${showTime.additionalInfo})`}
                          </p>
                        ))}
                      </div>
                    )}
                    {performance.description && (
                      <p className="text-sm text-gray-600 mt-2">{performance.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(performance)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(performance.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No performances created yet.</p>
        )}
      </div>
    </div>
  );
}