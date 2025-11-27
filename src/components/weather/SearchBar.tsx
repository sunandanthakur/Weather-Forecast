import { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

const suggestions = [
  'New York, USA',
  'London, UK',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Mumbai, India',
  'Delhi, India',
  'Paris, France',
  'Dubai, UAE',
  'San Francisco, USA',
  'Singapore',
  'Berlin, Germany',
  'Toronto, Canada',
  'São Paulo, Brazil',
  'Cape Town, South Africa',
  'Bangkok, Thailand',
];

export const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions = query.length > 0
    ? suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      setQuery('');
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      onSearch(suggestion);
      setQuery('');
      setIsFocused(false);
    }
  };

  return (
    <div className="relative animate-fade-in">
      <form onSubmit={handleSubmit}>
        <div className={cn(
          'glass-card flex items-center gap-3 px-4 py-3 transition-all duration-300',
          isFocused && 'ring-2 ring-foreground/20'
        )}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-muted-foreground flex-shrink-0 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search any city, town, or village..."
            disabled={isLoading}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {isFocused && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card-strong p-2 z-50 max-h-64 overflow-y-auto">
          <div className="px-3 py-1.5 text-xs text-muted-foreground uppercase tracking-wider">
            {query ? 'Suggestions' : 'Popular Cities'}
          </div>
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-foreground/90 hover:bg-secondary transition-colors"
            >
              {suggestion}
            </button>
          ))}
          {filteredSuggestions.length === 0 && (
            <div className="px-3 py-2.5 text-muted-foreground">
              Press Enter to search "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
