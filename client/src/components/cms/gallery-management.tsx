import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Search, Filter, Star, Calendar, Users, Eye, MapPin, Heart, Edit, Trash2, Image, Clock, SortAsc, SortDesc } from "lucide-react";
import type { GalleryPhoto, Performer } from "@shared/schema";
import GalleryForm from "./gallery-form";

type SortField = 'title' | 'showDate' | 'createdAt' | 'featured';
type SortOrder = 'asc' | 'desc';

export default function GalleryManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterFeatured, setFilterFeatured] = useState<string>("all");
  const [selectedPerformer, setSelectedPerformer] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);

  // Fetch gallery photos
  const { data: photos = [], isLoading } = useQuery<GalleryPhoto[]>({
    queryKey: ["/api/gallery"],
  });

  // Fetch performers for filtering
  const { data: performers = [] } = useQuery<Performer[]>({
    queryKey: ["/api/performers"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (photoId: string) => {
      await apiRequest("DELETE", `/api/gallery/${photoId}`);
    },
    onSuccess: () => {
      toast({ title: "Photo deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete photo", variant: "destructive" });
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ photoId, featured }: { photoId: string; featured: boolean }) => {
      const response = await apiRequest("PUT", `/api/gallery/${photoId}`, { featured });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Photo updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update photo", variant: "destructive" });
    },
  });

  // Filter and sort photos
  const filteredAndSortedPhotos = photos
    .filter(photo => {
      const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          photo.showName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFeatured = filterFeatured === "all" || 
                             (filterFeatured === "featured" && photo.featured) ||
                             (filterFeatured === "regular" && !photo.featured);

      const matchesPerformer = selectedPerformer === "all" ||
                              (photo.performerIds && photo.performerIds.includes(selectedPerformer));

      return matchesSearch && matchesFeatured && matchesPerformer;
    })
    .sort((a, b) => {
      let compareValue = 0;
      
      switch (sortField) {
        case 'title':
          compareValue = a.title.localeCompare(b.title);
          break;
        case 'showDate':
          const dateA = a.showDate ? new Date(a.showDate).getTime() : 0;
          const dateB = b.showDate ? new Date(b.showDate).getTime() : 0;
          compareValue = dateA - dateB;
          break;
        case 'createdAt':
          const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          compareValue = createdA - createdB;
          break;
        case 'featured':
          compareValue = (a.featured ? 1 : 0) - (b.featured ? 1 : 0);
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  const handleDelete = async (photo: GalleryPhoto) => {
    if (window.confirm(`Are you sure you want to delete "${photo.title}"?`)) {
      deleteMutation.mutate(photo.id);
    }
  };

  const handleToggleFeatured = (photo: GalleryPhoto) => {
    toggleFeaturedMutation.mutate({
      photoId: photo.id,
      featured: !photo.featured
    });
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPerformerName = (performerId: string) => {
    const performer = performers.find(p => p.id === performerId);
    return performer ? performer.name : 'Unknown Performer';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-2xl text-midnight">Gallery Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair text-2xl text-midnight flex items-center justify-between">
          <span>Gallery Management</span>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Gallery Photo</DialogTitle>
              </DialogHeader>
              <GalleryForm onSubmit={() => setShowAddDialog(false)} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search photos by title, description, or show name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Added</SelectItem>
                <SelectItem value="showDate">Show Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="flex gap-2">
            <Select value={filterFeatured} onValueChange={setFilterFeatured}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Photos</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPerformer} onValueChange={setSelectedPerformer}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performers</SelectItem>
                {performers.map(performer => (
                  <SelectItem key={performer.id} value={performer.id}>
                    {performer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredAndSortedPhotos.length} of {photos.length} photos
          </span>
          {(searchTerm || filterFeatured !== "all" || selectedPerformer !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilterFeatured("all");
                setSelectedPerformer("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Photos Grid */}
        {filteredAndSortedPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedPhotos.map((photo) => (
              <Card key={photo.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = 'none';
                        img.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center bg-gray-200">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant={photo.featured ? "default" : "secondary"}
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggleFeatured(photo)}
                    >
                      <Star className={`w-3 h-3 ${photo.featured ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  {photo.featured && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                      Featured
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{photo.description}</p>
                    )}
                  </div>

                  {/* Show Info */}
                  {photo.showName && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span className="truncate">{photo.showName}</span>
                    </div>
                  )}

                  {photo.showDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(photo.showDate)}</span>
                    </div>
                  )}

                  {/* Performers */}
                  {photo.performerIds && photo.performerIds.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-purple-600">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">Performers:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {photo.performerIds.slice(0, 2).map(performerId => (
                          <Badge key={performerId} variant="secondary" className="text-xs">
                            {getPerformerName(performerId)}
                          </Badge>
                        ))}
                        {photo.performerIds.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{photo.performerIds.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags Preview */}
                  {(photo.whoTags?.length || photo.whatTags?.length || photo.whenTags?.length || photo.whereTags?.length || photo.whyTags?.length) && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-600">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {[
                          ...(photo.whoTags || []).slice(0, 2),
                          ...(photo.whatTags || []).slice(0, 1),
                          ...(photo.whenTags || []).slice(0, 1)
                        ].slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {((photo.whoTags?.length || 0) + (photo.whatTags?.length || 0) + (photo.whenTags?.length || 0) + (photo.whereTags?.length || 0) + (photo.whyTags?.length || 0)) > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{((photo.whoTags?.length || 0) + (photo.whatTags?.length || 0) + (photo.whenTags?.length || 0) + (photo.whereTags?.length || 0) + (photo.whyTags?.length || 0)) - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Added {formatDate(photo.createdAt)}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Gallery Photo</DialogTitle>
                        </DialogHeader>
                        <GalleryForm photo={photo} onSubmit={() => {}} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(photo)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filterFeatured !== "all" || selectedPerformer !== "all" 
                ? "No photos match your filters"
                : "No gallery photos yet"
              }
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm || filterFeatured !== "all" || selectedPerformer !== "all"
                ? "Try adjusting your search terms or filters to see more results."
                : "Start building your gallery by adding your first photo."
              }
            </p>
            {(!searchTerm && filterFeatured === "all" && selectedPerformer === "all") && (
              <Button onClick={() => setShowAddDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Photo
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}