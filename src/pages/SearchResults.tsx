import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'page' | 'article' | 'service' | 'simulator';
  date?: string;
  image?: string;
}

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    
    // Simuler une recherche (à remplacer par une vraie recherche dans la base de données)
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Services comptables',
          description: 'Découvrez nos services d\'expertise comptable pour les entrepreneurs franco-maghrébins. Nous proposons une gamme complète de services adaptés à vos besoins spécifiques.',
          url: '/services#comptabilite',
          type: 'service',
          image: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg'
        },
        {
          id: '2',
          title: 'Simulateur de charges sociales',
          description: 'Calculez vos charges sociales selon votre statut juridique et estimez votre rémunération nette.',
          url: '/simulators',
          type: 'simulator'
        },
        {
          id: '3',
          title: 'Fiscalité internationale',
          description: 'Optimisation fiscale pour les entrepreneurs franco-maghrébins. Stratégies légales pour optimiser votre fiscalité entre la France et le Maghreb.',
          url: '/blog/optimisation-fiscale-internationale',
          type: 'article',
          date: '2025-01-08'
        },
        {
          id: '4',
          title: 'Expertise comptable digitale',
          description: 'MBC propose une expertise comptable 100% digitale, moderne et adaptée aux entrepreneurs d\'aujourd\'hui.',
          url: '/services',
          type: 'page'
        },
        {
          id: '5',
          title: 'Simulateur de TVA',
          description: 'Calculez rapidement le montant de TVA à facturer ou à déduire selon les différents taux en vigueur.',
          url: '/simulators',
          type: 'simulator'
        },
        {
          id: '6',
          title: 'Création d\'entreprise en France pour les entrepreneurs maghrébins',
          description: 'Guide complet pour créer votre entreprise en France, avec les spécificités pour les entrepreneurs d\'origine maghrébine.',
          url: '/blog/creation-entreprise-france-maghreb',
          type: 'article',
          date: '2025-01-15'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(mockResults);
      setLoading(false);
    }, 800);
  };

  const filteredResults = activeFilter === 'all' 
    ? results 
    : results.filter(result => result.type === activeFilter);

  const resultCounts = {
    all: results.length,
    page: results.filter(r => r.type === 'page').length,
    article: results.filter(r => r.type === 'article').length,
    service: results.filter(r => r.type === 'service').length,
    simulator: results.filter(r => r.type === 'simulator').length
  };

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Résultats de recherche pour "{query}"
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="search"
                  defaultValue={query}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="p-4">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setActiveFilter('all')}>
                    Tous ({resultCounts.all})
                  </TabsTrigger>
                  <TabsTrigger value="page" onClick={() => setActiveFilter('page')}>
                    Pages ({resultCounts.page})
                  </TabsTrigger>
                  <TabsTrigger value="article" onClick={() => setActiveFilter('article')}>
                    Articles ({resultCounts.article})
                  </TabsTrigger>
                  <TabsTrigger value="service" onClick={() => setActiveFilter('service')}>
                    Services ({resultCounts.service})
                  </TabsTrigger>
                  <TabsTrigger value="simulator" onClick={() => setActiveFilter('simulator')}>
                    Simulateurs ({resultCounts.simulator})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="space-y-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <div key={result.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <a 
                        href={result.url} 
                        className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg p-4 -mx-4"
                      >
                        <div className="flex items-start">
                          {result.image && (
                            <div className="flex-shrink-0 mr-4">
                              <img 
                                src={result.image} 
                                alt={result.title} 
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {result.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              {result.description}
                            </p>
                            <div className="flex items-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                result.type === 'service' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                result.type === 'article' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                result.type === 'simulator' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}>
                                {result.type === 'service' ? 'Service' :
                                 result.type === 'article' ? 'Article' :
                                 result.type === 'simulator' ? 'Simulateur' : 'Page'}
                              </span>
                              {result.date && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                  {result.date}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                {result.url}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Essayez avec d'autres termes ou vérifiez l'orthographe
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="page" className="space-y-6">
                {/* Contenu identique à "all" mais filtré par type */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <div key={result.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <a 
                        href={result.url} 
                        className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg p-4 -mx-4"
                      >
                        <div className="flex items-start">
                          {result.image && (
                            <div className="flex-shrink-0 mr-4">
                              <img 
                                src={result.image} 
                                alt={result.title} 
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {result.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              {result.description}
                            </p>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                {result.url}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Aucune page trouvée
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Essayez avec d'autres termes ou vérifiez l'orthographe
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="article" className="space-y-6">
                {/* Contenu identique à "all" mais filtré par type */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <div key={result.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <a 
                        href={result.url} 
                        className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg p-4 -mx-4"
                      >
                        <div className="flex items-start">
                          {result.image && (
                            <div className="flex-shrink-0 mr-4">
                              <img 
                                src={result.image} 
                                alt={result.title} 
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {result.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              {result.description}
                            </p>
                            <div className="flex items-center">
                              {result.date && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {result.date}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                {result.url}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Aucun article trouvé
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Essayez avec d'autres termes ou vérifiez l'orthographe
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="service" className="space-y-6">
                {/* Contenu identique à "all" mais filtré par type */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <div key={result.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <a 
                        href={result.url} 
                        className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg p-4 -mx-4"
                      >
                        <div className="flex items-start">
                          {result.image && (
                            <div className="flex-shrink-0 mr-4">
                              <img 
                                src={result.image} 
                                alt={result.title} 
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {result.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              {result.description}
                            </p>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                {result.url}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Aucun service trouvé
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Essayez avec d'autres termes ou vérifiez l'orthographe
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="simulator" className="space-y-6">
                {/* Contenu identique à "all" mais filtré par type */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <div key={result.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <a 
                        href={result.url} 
                        className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg p-4 -mx-4"
                      >
                        <div className="flex items-start">
                          {result.image && (
                            <div className="flex-shrink-0 mr-4">
                              <img 
                                src={result.image} 
                                alt={result.title} 
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {result.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              {result.description}
                            </p>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                {result.url}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Aucun simulateur trouvé
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Essayez avec d'autres termes ou vérifiez l'orthographe
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;