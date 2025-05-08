
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Newspaper, 
  Twitter, 
  MessagesSquare, 
  FileText, 
  Search,
  RefreshCw,
  Settings,
  BarChart4,
  Filter,
  XCircle,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for news sources
const newsSources = [
  { id: 'reuters', name: 'Reuters', enabled: true },
  { id: 'ap', name: 'Associated Press', enabled: true },
  { id: 'bbg', name: 'Bloomberg', enabled: true },
  { id: 'wsj', name: 'Wall Street Journal', enabled: true },
  { id: 'cnn', name: 'CNN', enabled: false },
  { id: 'bbc', name: 'BBC', enabled: true },
  { id: 'nyt', name: 'New York Times', enabled: false },
  { id: 'economist', name: 'The Economist', enabled: true },
];

// Mock data for news articles
const newsArticles = [
  {
    id: '1',
    title: 'Global AI Summit Agrees on Regulatory Framework',
    source: 'Reuters',
    date: '2025-05-07',
    categories: ['Technology', 'Policy'],
    summary: 'Leaders from 42 nations agreed on a comprehensive AI regulatory framework that focuses on safety, transparency, and ethical usage.',
    sentiment: 'neutral',
    relevance: 'high'
  },
  {
    id: '2',
    title: 'New Energy Storage Breakthrough Claims 10x Capacity Improvement',
    source: 'Bloomberg',
    date: '2025-05-06',
    categories: ['Energy', 'Innovation'],
    summary: 'Scientists have developed a novel battery chemistry that could potentially increase energy storage capacity by an order of magnitude.',
    sentiment: 'positive',
    relevance: 'medium'
  },
  {
    id: '3',
    title: 'Markets React Strongly to Central Bank Interest Rate Decision',
    source: 'Wall Street Journal',
    date: '2025-05-05',
    categories: ['Finance', 'Economy'],
    summary: 'Global markets experienced significant volatility following the unexpected 50 basis point rate increase announced yesterday.',
    sentiment: 'negative',
    relevance: 'high'
  },
  {
    id: '4',
    title: 'Healthcare Consortium Launches Global Pandemic Prevention Initiative',
    source: 'BBC',
    date: '2025-05-04',
    categories: ['Healthcare', 'Global'],
    summary: 'A coalition of pharmaceutical companies, research institutions, and philanthropic organizations announced a $5 billion initiative aimed at preventing future pandemics.',
    sentiment: 'positive',
    relevance: 'medium'
  },
  {
    id: '5',
    title: 'Social Media Regulations Take Effect in European Union',
    source: 'Associated Press',
    date: '2025-05-03',
    categories: ['Technology', 'Policy', 'Social'],
    summary: 'The Digital Services Act enforcement phase begins today, requiring major platforms to implement new content moderation and transparency measures.',
    sentiment: 'neutral',
    relevance: 'high'
  },
];

// Social media posts
const socialPosts = [
  {
    id: '1',
    platform: 'twitter',
    username: '@TechAnalyst',
    content: 'The new AI regulations are much more balanced than expected. Industry can work with this. #AIRegulation #TechPolicy',
    date: '2025-05-07',
    engagement: 1245,
    sentiment: 'positive',
    relevance: 'high'
  },
  {
    id: '2',
    platform: 'reddit',
    username: 'u/EnergyFuturist',
    content: 'Just reviewed the new battery tech paper. If the energy density claims hold up in production, this is revolutionary for EVs and grid storage.',
    date: '2025-05-06',
    engagement: 842,
    sentiment: 'positive',
    relevance: 'medium'
  },
  {
    id: '3',
    platform: 'twitter',
    username: '@MarketWatcher',
    content: 'Central bank decision caught everyone off guard. Expect continued volatility through next week. #Markets #InterestRates',
    date: '2025-05-05',
    engagement: 963,
    sentiment: 'negative',
    relevance: 'high'
  },
  {
    id: '4',
    platform: 'reddit',
    username: 'u/PolicyExpert',
    content: 'The Digital Services Act implementation will be the biggest test of EU tech regulation so far. Platforms have had time to prepare but compliance will still be challenging.',
    date: '2025-05-03',
    engagement: 721,
    sentiment: 'neutral',
    relevance: 'high'
  },
];

// Academic papers
const academicPapers = [
  {
    id: '1',
    title: 'Quantum Computing Applications in Predictive Financial Modeling',
    authors: 'Zhang, R., Patel, S., Johnson, M.',
    journal: 'Journal of Quantum Finance',
    date: '2025-04',
    abstract: 'This paper explores novel applications of quantum algorithms to predict market behaviors with significantly improved accuracy over classical methods.',
    relevance: 'high',
    categories: ['Finance', 'Quantum Computing']
  },
  {
    id: '2',
    title: 'Climate Tipping Points: A Bayesian Network Analysis',
    authors: 'Anderson, K., Garcia, L., Smith, J.',
    journal: 'Environmental Modeling & Assessment',
    date: '2025-03',
    abstract: 'Using Bayesian network models to identify and quantify potential climate system tipping points and their cascading effects.',
    relevance: 'medium',
    categories: ['Climate', 'Statistical Modeling']
  },
  {
    id: '3',
    title: 'Social Sentiment as a Leading Indicator for Policy Effectiveness',
    authors: 'Wilson, T., Nakamura, H., Al-Farsi, O.',
    journal: 'Journal of Public Policy Analysis',
    date: '2025-02',
    abstract: 'This research demonstrates how large-scale social sentiment analysis can predict policy implementation success with 74% accuracy.',
    relevance: 'high',
    categories: ['Policy', 'Sentiment Analysis', 'Social Science']
  },
];

const DataFeeds = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeFeed, setActiveFeed] = useState<'news' | 'social' | 'academic'>('news');
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const filterItems = (items: any[], type: 'news' | 'social' | 'academic') => {
    if (!searchQuery && activeFilters.length === 0) {
      return items;
    }
    
    return items.filter(item => {
      // Search query filter
      const matchesSearch = searchQuery === '' || (
        type === 'news' ? 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) :
        type === 'social' ?
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) :
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.abstract.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Category filters
      const matchesFilters = activeFilters.length === 0 || (
        type === 'news' ? 
          item.categories.some((c: string) => activeFilters.includes(c)) :
        type === 'social' ?
          activeFilters.includes(item.sentiment) || activeFilters.includes(item.platform) :
          item.categories.some((c: string) => activeFilters.includes(c))
      );
      
      return matchesSearch && matchesFilters;
    });
  };
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600/20 text-green-400';
      case 'negative': return 'bg-red-600/20 text-red-400';
      case 'neutral': return 'bg-blue-600/20 text-blue-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };
  
  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'high': return 'bg-purple-600/20 text-purple-400';
      case 'medium': return 'bg-yellow-600/20 text-yellow-400';
      case 'low': return 'bg-gray-600/20 text-gray-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h1 className="text-2xl font-bold">Data Feeds</h1>
          <div className="flex gap-2 mt-2 lg:mt-0 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data feeds..."
                className="w-[200px] pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery('')}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <RefreshCw size={16} />
              <span>Refresh</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Settings size={16} />
              <span>Configure</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - data source controls */}
          <div className="space-y-6">
            {/* Feed type selection */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Newspaper className="h-4 w-4 text-cyber" />
                      <span className="text-sm">News APIs</span>
                    </div>
                    <Button 
                      variant={activeFeed === 'news' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveFeed('news')}
                      className="h-8"
                    >
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm">Social Media</span>
                    </div>
                    <Button 
                      variant={activeFeed === 'social' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveFeed('social')}
                      className="h-8"
                    >
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-neural" />
                      <span className="text-sm">Academic Papers</span>
                    </div>
                    <Button 
                      variant={activeFeed === 'academic' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveFeed('academic')}
                      className="h-8"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Source configuration */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-mono">Active Sources</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Edit All
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeFeed === 'news' && (
                  <>
                    {newsSources.map(source => (
                      <div key={source.id} className="flex items-center justify-between">
                        <span className="text-sm">{source.name}</span>
                        <Switch checked={source.enabled} />
                      </div>
                    ))}
                  </>
                )}
                
                {activeFeed === 'social' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Twitter / X</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reddit</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">YouTube</span>
                      <Switch />
                    </div>
                  </>
                )}
                
                {activeFeed === 'academic' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">arXiv</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSRN</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">PubMed</span>
                      <Switch />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Filter controls */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-mono flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Active Filters
                </CardTitle>
                {activeFilters.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveFilters([])}
                    className="h-7 text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {activeFeed === 'news' && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-1">Categories</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Technology', 'Finance', 'Policy', 'Energy', 'Healthcare'].map(category => (
                        <Badge 
                          key={category}
                          variant={activeFilters.includes(category) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer",
                            activeFilters.includes(category) ? "bg-cyber text-white" : ""
                          )}
                          onClick={() => toggleFilter(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-1">Relevance</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['high', 'medium'].map(relevance => (
                          <Badge 
                            key={relevance}
                            variant={activeFilters.includes(relevance) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer",
                              activeFilters.includes(relevance) ? "bg-cyber text-white" : ""
                            )}
                            onClick={() => toggleFilter(relevance)}
                          >
                            {relevance}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeFeed === 'social' && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-1">Platforms</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['twitter', 'reddit'].map(platform => (
                        <Badge 
                          key={platform}
                          variant={activeFilters.includes(platform) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer",
                            activeFilters.includes(platform) ? "bg-cyber text-white" : ""
                          )}
                          onClick={() => toggleFilter(platform)}
                        >
                          {platform === 'twitter' ? 'Twitter / X' : 'Reddit'}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['positive', 'negative', 'neutral'].map(sentiment => (
                          <Badge 
                            key={sentiment}
                            variant={activeFilters.includes(sentiment) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer",
                              activeFilters.includes(sentiment) ? "bg-cyber text-white" : ""
                            )}
                            onClick={() => toggleFilter(sentiment)}
                          >
                            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeFeed === 'academic' && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-1">Categories</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Finance', 'Climate', 'Policy', 'Quantum Computing', 'Statistical Modeling'].map(category => (
                        <Badge 
                          key={category}
                          variant={activeFilters.includes(category) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer",
                            activeFilters.includes(category) ? "bg-cyber text-white" : ""
                          )}
                          onClick={() => toggleFilter(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Stats panel */}
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart4 className="h-5 w-5 text-cyber" />
                  <h3 className="font-mono text-sm">Feed Statistics</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last updated:</span>
                    <span>2 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Items processed today:</span>
                    <span>1,458</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Anomaly detection:</span>
                    <span className="flex items-center text-neural">
                      <Check className="h-3 w-3 mr-1" /> Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content - Data feed display */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue={activeFeed} onValueChange={(v) => setActiveFeed(v as any)}>
              <TabsList>
                <TabsTrigger value="news" className="flex items-center gap-1">
                  <Newspaper className="h-4 w-4" />
                  <span>News</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-1">
                  <MessagesSquare className="h-4 w-4" />
                  <span>Social</span>
                </TabsTrigger>
                <TabsTrigger value="academic" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Academic</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="news" className="mt-4 space-y-4">
                {filterItems(newsArticles, 'news').length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No news articles match your filters</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilters([]);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  filterItems(newsArticles, 'news').map((article) => (
                    <Card key={article.id} className="cyber-border card-glow overflow-hidden">
                      <CardHeader className="bg-card/50 py-2 px-4 space-y-0">
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">{article.source} • {article.date}</div>
                          <div className="flex gap-1">
                            <Badge className={getSentimentColor(article.sentiment)}>
                              {article.sentiment}
                            </Badge>
                            <Badge className={getRelevanceColor(article.relevance)}>
                              {article.relevance}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-medium text-lg">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.summary}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {article.categories.map((category: string, i: number) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="bg-card/50 text-xs cursor-pointer"
                              onClick={() => toggleFilter(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="social" className="mt-4 space-y-4">
                {filterItems(socialPosts, 'social').length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No social posts match your filters</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilters([]);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  filterItems(socialPosts, 'social').map((post) => (
                    <Card key={post.id} className="overflow-hidden border-border">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground overflow-hidden">
                              {post.platform === 'twitter' ? 
                                <Twitter className="h-4 w-4 text-cyan-500" /> : 
                                <MessagesSquare className="h-4 w-4 text-orange-500" />
                              }
                            </div>
                            <div>
                              <div className="font-medium text-sm">{post.username}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <span>{post.platform === 'twitter' ? 'Twitter/X' : 'Reddit'}</span>
                                <span>•</span>
                                <span>{post.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Badge className={getSentimentColor(post.sentiment)}>
                              {post.sentiment}
                            </Badge>
                            <Badge className={getRelevanceColor(post.relevance)}>
                              {post.relevance}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm">{post.content}</p>
                        
                        <div className="text-xs text-muted-foreground">
                          Engagement: {post.engagement.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="academic" className="mt-4 space-y-4">
                {filterItems(academicPapers, 'academic').length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No papers match your filters</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilters([]);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  filterItems(academicPapers, 'academic').map((paper) => (
                    <Card key={paper.id} className="neural-border overflow-hidden">
                      <CardHeader className="bg-card/50 py-2 px-4 space-y-0">
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">{paper.journal} • {paper.date}</div>
                          <Badge className={getRelevanceColor(paper.relevance)}>
                            {paper.relevance}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-medium text-lg">{paper.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Authors:</span> {paper.authors}
                        </div>
                        <p className="text-sm">{paper.abstract}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {paper.categories.map((category: string, i: number) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="bg-card/50 text-xs cursor-pointer"
                              onClick={() => toggleFilter(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DataFeeds;
