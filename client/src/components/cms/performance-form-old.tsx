import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPerformanceSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit, Calendar } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
      ticketUrl: "",
    },
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
    onError: () => {
      toast({ title: "Error", description: "Failed to update performance", variant: "destructive" });
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
    form.reset({
      title: performance.title,
      description: performance.description || "",
      venue: performance.venue,
      date: new Date(performance.date),
      time: performance.time,
      ticketUrl: performance.ticketUrl || "",
    });
  };

  const cancelEdit = () => {
    setEditingPerformance(null);
    form.reset();
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-playfair text-xl font-semibold text-midnight mb-4">
            {editingPerformance ? "Edit Performance" : "Add New Performance"}
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
                      <Input placeholder="Performance title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="Performance venue" {...field} />
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
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input placeholder="8:00 PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
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
                name="ticketUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://tickets.example.com" {...field} />
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
                        placeholder="Performance description..." 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="bg-magenta hover:bg-magenta/80"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingPerformance ? "Update Performance" : "Add Performance"}
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

      {/* Performances List */}
      <div>
        <h3 className="font-playfair text-xl font-semibold text-midnight mb-4">Current Performances</h3>
        {isLoading ? (
          <p>Loading performances...</p>
        ) : performances && performances.length > 0 ? (
          <div className="grid gap-4">
            {performances.map((performance) => (
              <Card key={performance.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[60px]">
                        <Calendar className="w-8 h-8 text-magenta mx-auto mb-1" />
                        <div className="text-xs text-gray-500">
                          {new Date(performance.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-midnight">{performance.title}</h4>
                        <p className="text-gray-600 text-sm">{performance.venue} • {performance.time}</p>
                        <p className="text-gray-500 text-xs">{performance.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(performance)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(performance.id)}
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
          <p className="text-gray-500">No performances found.</p>
        )}
      </div>
    </div>
  );
}
