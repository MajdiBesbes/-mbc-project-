import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SearchResult {
  title: string;
  description: string;
  url: string;
  type: 'page' | 'article' | 'service' | 'simulator';
}

const SearchBar: React.FC<{ className?: string; mobile?: boolean }> = ({ className = '', mobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    
    // Simuler une recherche (à remplacer par une vraie recherche dans la base de données)
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          title: 'Services comptables',
          description: 'Découvrez nos services d\'expertise comptable pour les entrepreneurs',
          url: '/services#comptabilite',
          type: 'service'
        },
        {
          title: 'Simulateur de charges sociales',
          description: 'Calculez vos charges sociales selon votre statut juridique',
          url: '/simulators',
          type: 'simulator'
        },
        {
          title: 'Fiscalité internationale',
          description: 'Optimisation fiscale pour les entrepreneurs franco-maghrébins',
          url: '/blog/optimisation-fiscale-internationale',
          type: 'article'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(mockResults);
      setLoading(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleResultClick = (url: string) => {
    navigate(url);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center ${
          mobile 
            ? 'text-gray-800 dark:text-gray-200' 
            : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white'
        } transition-colors`}
        aria-label="Rechercher"
      >
        <Search size={mobile ? 24 : 20} />
        {mobile && <span className="ml-2">Rechercher</span>}
      </button>

      {isOpen && (
        <div className={`${
          mobile 
            ? 'fixed inset-0 z-50 bg-gray-900/50 flex items-start justify-center pt-20' 
            : 'absolute right-0 mt-2 z-50'
        }`}>
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden ${
            mobile ? 'w-full max-w-lg mx-4' : 'w-96'
          }`}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-4 py-3 pl-10 pr-10 border-b border-gray-200 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </form>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                  <span className="ml-2">Recherche en cours...</span>
                </div>
              ) : results.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((result, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleResultClick(result.url)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{result.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{result.description}</p>
                          </div>
                          <ArrowRight size={16} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="mt-1">
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
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query.length >= 2 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Aucun résultat trouvé pour "{query}"
                </div>
              ) : null}
            </div>

            {results.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={handleSearch}
                  className="w-full text-center text-sm text-primary dark:text-primary-light hover:underline"
                >
                  Voir tous les résultats pour "{query}"
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;