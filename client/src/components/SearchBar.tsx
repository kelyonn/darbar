import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { products as localProducts } from '../data/products';

interface SearchResult {
  id: number | string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

const fuse = new Fuse(localProducts as SearchResult[], {
  keys: ['name', 'description', 'fabric', 'tags'],
  threshold: 0.35,
  includeScore: true,
});

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const search = useCallback((q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    const matches = fuse.search(q).slice(0, 6).map(r => r.item as SearchResult);
    setResults(matches);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') {
      if (activeIdx >= 0 && results[activeIdx]) {
        navigate(`/product/${results[activeIdx].id}`);
        setOpen(false); setQuery('');
      } else if (query.trim()) {
        navigate(`/collections?search=${encodeURIComponent(query.trim())}`);
        setOpen(false);
      }
    } else if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search collections..."
          className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg font-montserrat text-sm focus:outline-none focus:ring-1 focus:ring-royal-gold bg-gray-50"
          autoComplete="off"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((result, idx) => (
            <Link
              key={result.id}
              to={`/product/${result.id}`}
              onClick={() => { setOpen(false); setQuery(''); }}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${idx === activeIdx ? 'bg-royal-gold/10' : 'hover:bg-gray-50'}`}
            >
              {(result as { images?: string[] }).images?.[0] && (
                <img src={(result as { images?: string[] }).images![0]} alt={result.name} className="w-10 h-10 object-cover rounded" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-montserrat text-sm font-medium text-gray-900 truncate">{result.name}</p>
                <p className="font-montserrat text-xs text-gray-500">₹{result.price.toLocaleString('en-IN')}</p>
              </div>
            </Link>
          ))}
          {query.trim() && (
            <Link
              to={`/collections?search=${encodeURIComponent(query.trim())}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 font-montserrat text-sm text-royal-gold hover:bg-royal-gold/5"
            >
              <Search size={14} />
              See all results for &quot;{query}&quot;
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
