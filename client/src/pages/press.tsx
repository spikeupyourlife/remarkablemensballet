import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ExternalLink, User, Search, Filter, X, Star, SortAsc, SortDesc, FileText, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PressArticle } from "@shared/schema";

type SortField = 'title' | 'publishedDate' | 'createdAt' | 'featured';
type SortOrder = 'asc' | 'desc';

export default function Press() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('publishedDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterFeatured, setFilterFeatured] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<PressArticle | null>(null);

  const { data: articles = [], isLoading } = useQuery<PressArticle[]>({
    queryKey: ["/api/press"],
  });

  // Get all unique tags from articles
  const allTags = Array.from(new Set(articles.flatMap(article => article.tags || []))).sort();

  // Filter and sort articles
  const filteredAndSortedArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.sourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFeatured = filterFeatured === "all" || 
                             (filterFeatured === "featured" && article.featured) ||
                             (filterFeatured === "regular" && !article.featured);

      const matchesTag = selectedTag === "all" ||
                        (article.tags && article.tags.includes(selectedTag));

      return matchesSearch && matchesFeatured && matchesTag;
    })
    .sort((a, b) => {
      let compareValue = 0;
      
      switch (sortField) {
        case 'title':
          compareValue = a.title.localeCompare(b.title);
          break;
        case 'publishedDate':
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
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
            <h1 className="text-5xl font-bold text-white mb-4 font-serif">Press</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Loading press coverage and media articles...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-700 aspect-[3/2] rounded-lg mb-4"></div>
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-serif">Press</h1>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4">
            Discover what critics and media outlets are saying about Remarkable Mens Ballet. From reviews to interviews, explore our press coverage.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                data-testid="input-search-articles"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
              <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white flex-1" data-testid="select-sort-field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publishedDate">Publication Date</SelectItem>
                  <SelectItem value="createdAt">Date Added</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 shrink-0"
                data-testid="button-sort-order"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>

            {/* Featured Filter */}
            <Select value={filterFeatured} onValueChange={setFilterFeatured}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-featured-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Articles</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="regular">Regular Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-tag-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-slate-400 text-xs sm:text-sm" data-testid="text-results-count">
            Showing {filteredAndSortedArticles.length} of {articles.length} articles
          </div>
        </div>

        {/* Articles Grid */}
        {filteredAndSortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredAndSortedArticles.map((article) => (
              <PressArticleCard 
                key={article.id} 
                article={article} 
                onArticleClick={() => setSelectedArticle(article)} 
              />
            ))}
          </div>
        ) : searchTerm || filterFeatured !== "all" || selectedTag !== "all" ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Results Found</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              Try adjusting your search terms or filters to find more articles.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFilterFeatured("all");
                setSelectedTag("all");
              }}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Press Articles Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Our press coverage is being compiled. Check back soon for articles, reviews, and interviews.
            </p>
          </div>
        )}

        {/* Article Modal */}
        {selectedArticle && (
          <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
            <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto" aria-describedby="article-description">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white mb-4 pr-8">
                  {selectedArticle.title}
                  {selectedArticle.featured && (
                    <Badge className="ml-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
                data-testid="button-close-modal"
              >
                <X className="w-4 h-4" />
              </Button>

              {selectedArticle.imageUrl && (
                <div className="mb-6">
                  <img 
                    src={selectedArticle.imageUrl} 
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {selectedArticle.excerpt && (
                <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-slate-300 text-lg italic">
                    {selectedArticle.excerpt}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                {selectedArticle.sourceName && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="font-medium">{selectedArticle.sourceName}</span>
                  </div>
                )}
                {selectedArticle.author && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>{selectedArticle.author}</span>
                  </div>
                )}
                {selectedArticle.publishedDate && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>{new Date(selectedArticle.publishedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div id="article-description" className="prose prose-invert max-w-none mb-6">
                <div className="text-slate-300 whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>
              </div>

              {selectedArticle.sourceUrl && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => selectedArticle.sourceUrl && window.open(selectedArticle.sourceUrl, '_blank')}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    data-testid="button-view-original"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Original Article
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

interface PressArticleCardProps {
  article: PressArticle;
  onArticleClick: () => void;
}

function PressArticleCard({ article, onArticleClick }: PressArticleCardProps) {
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
        className="relative aspect-[3/2] overflow-hidden cursor-pointer"
        onClick={onArticleClick}
        data-testid={`card-article-${article.id}`}
      >
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <FileText className="w-16 h-16 text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>
        {article.featured && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            Featured
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-slate-400 text-sm line-clamp-3 mb-3">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Article Details */}
        <div className="space-y-2">
          {article.sourceName && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="font-medium">{article.sourceName}</span>
            </div>
          )}
          {article.author && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <User className="w-4 h-4 text-purple-400" />
              <span>{article.author}</span>
            </div>
          )}
          {article.publishedDate && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{formatDate(article.publishedDate)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">Categories</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                  +{article.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Read More Indicator */}
        <div className="pt-2 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Click to read more</span>
            {article.sourceUrl && (
              <div className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                <span>Source available</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}