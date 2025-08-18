import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPerformerSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Performer, InsertPerformer } from "@shared/schema";

export default function PerformerForm() {
  const { toast } = useToast();
  const [editingPerformer, setEditingPerformer] = useState<Performer | null>(null);

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
    form.reset({
      name: performer.name,
      role: performer.role,
      bio: performer.bio,
      imageUrl: performer.imageUrl || "",
      featured: performer.featured || false,
    });
  };

  const cancelEdit = () => {
    setEditingPerformer(null);
    form.reset();
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
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
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
