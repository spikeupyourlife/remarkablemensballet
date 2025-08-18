import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Users, Eye, Search, Filter, X, Star, SortAsc, SortDesc } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { GalleryPhoto, Performer } from "@shared/schema";

type SortField = 'title' | 'showDate' | 'createdAt' | 'featured';
type SortOrder = 'asc' | 'desc';

export default function Gallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterFeatured, setFilterFeatured] = useState<string>("all");
  const [selectedPerformer, setSelectedPerformer] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const { data: photos = [], isLoading } = useQuery<GalleryPhoto[]>({
    queryKey: ["/api/gallery"],
  });

  const { data: performers = [] } = useQuery<Performer[]>({
    queryKey: ["/api/performers"],
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 font-serif">Gallery</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Loading stunning moments from our performances...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-700 aspect-[3/4] rounded-lg mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-serif">Gallery</h1>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4">
            Discover the artistry and passion behind every performance through our collection of memorable moments.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
              <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white flex-1">
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
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 shrink-0"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>

            {/* Featured Filter */}
            <Select value={filterFeatured} onValueChange={setFilterFeatured}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Photos</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="regular">Regular Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Performer Filter */}
            <Select value={selectedPerformer} onValueChange={setSelectedPerformer}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performers</SelectItem>
                {performers.map((performer) => (
                  <SelectItem key={performer.id} value={performer.id}>
                    {performer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-slate-400 text-xs sm:text-sm">
            Showing {filteredAndSortedPhotos.length} of {photos.length} photos
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredAndSortedPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredAndSortedPhotos.map((photo) => (
              <GalleryPhotoCard 
                key={photo.id} 
                photo={photo} 
                onImageClick={() => setSelectedPhoto(photo)} 
              />
            ))}
          </div>
        ) : searchTerm || filterFeatured !== "all" || selectedPerformer !== "all" ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Results Found</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              Try adjusting your search terms or filters to find more photos.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFilterFeatured("all");
                setSelectedPerformer("all");
              }}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Photos Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Our gallery is being curated. Check back soon for stunning photography from our performances.
            </p>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 p-0">
              <div className="relative">
                <img 
                  src={selectedPhoto.imageUrl} 
                  alt={selectedPhoto.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white mb-4">
                    {selectedPhoto.title}
                    {selectedPhoto.featured && (
                      <Badge className="ml-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </DialogTitle>
                </DialogHeader>

                {selectedPhoto.description && (
                  <p className="text-slate-300 mb-4">
                    {selectedPhoto.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedPhoto.showName && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span>{selectedPhoto.showName}</span>
                    </div>
                  )}
                  {selectedPhoto.showDate && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{new Date(selectedPhoto.showDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedPhoto.performerIds && selectedPhoto.performerIds.length > 0 && (
                    <div className="col-span-2 flex items-start gap-2 text-slate-300">
                      <Users className="w-4 h-4 text-purple-400 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {selectedPhoto.performerIds.map(performerId => {
                          const performer = performers.find(p => p.id === performerId);
                          return performer ? (
                            <Badge key={performer.id} variant="outline" className="text-xs border-slate-600 text-slate-300">
                              {performer.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

interface GalleryPhotoCardProps {
  photo: GalleryPhoto;
  onImageClick: () => void;
}

function GalleryPhotoCard({ photo, onImageClick }: GalleryPhotoCardProps) {
  const formatDate = (date: string | Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="group overflow-hidden bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
      <div 
        className="relative aspect-[3/4] overflow-hidden cursor-pointer"
        onClick={onImageClick}
      >
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Eye className="w-6 h-6 text-white" />
          </div>
        </div>
        {photo.featured && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            Featured
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {photo.title}
          </h3>
          {photo.description && (
            <p className="text-slate-400 text-sm line-clamp-2">
              {photo.description}
            </p>
          )}
        </div>

        {/* Show Details */}
        {(photo.showName || photo.showDate) && (
          <div className="space-y-2">
            {photo.showName && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>{photo.showName}</span>
              </div>
            )}
            {photo.showDate && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{formatDate(photo.showDate)}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="space-y-3">
          {photo.whoTags && photo.whoTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-medium text-pink-400 uppercase tracking-wide">Who</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {photo.whoTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {photo.whatTags && photo.whatTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">What</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {photo.whatTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {photo.whenTags && photo.whenTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-xs font-medium text-green-400 uppercase tracking-wide">When</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {photo.whenTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {photo.whereTags && photo.whereTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-medium text-yellow-400 uppercase tracking-wide">Where</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {photo.whereTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}