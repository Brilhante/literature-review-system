'use client';

import React from 'react';

interface SearchFormCardProps {
  searchTerm: string;
  searchYear: string;
  searchAuthor: string;
  portugueseOnly: boolean;
  loading: boolean;
  onSearchTermChange: (value: string) => void;
  onSearchYearChange: (value: string) => void;
  onSearchAuthorChange: (value: string) => void;
  onPortugueseOnlyChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClearFilters: () => void;
}

export const SearchFormCard: React.FC<SearchFormCardProps> = ({
  searchTerm,
  searchYear,
  searchAuthor,
  portugueseOnly,
  loading,
  onSearchTermChange,
  onSearchYearChange,
  onSearchAuthorChange,
  onPortugueseOnlyChange,
  onSubmit,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Termo de Busca
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="Digite sua busca..."
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <input
              id="year"
              type="number"
              value={searchYear}
              onChange={(e) => onSearchYearChange(e.target.value)}
              placeholder="Ex: 2023"
              min="1900"
              max={new Date().getFullYear()}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Autor
            </label>
            <input
              id="author"
              type="text"
              value={searchAuthor}
              onChange={(e) => onSearchAuthorChange(e.target.value)}
              placeholder="Nome do autor"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={portugueseOnly}
                onChange={(e) => onPortugueseOnlyChange(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${
                portugueseOnly ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out transform ${
                  portugueseOnly ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Apenas artigos em português
            </span>
          </label>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium text-lg shadow-sm hover:shadow-md"
          >
            {loading ? 'Buscando...' : 'Buscar Artigos'}
          </button>
          <button
            type="button"
            onClick={onClearFilters}
            disabled={loading}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors font-medium text-lg shadow-sm hover:shadow-md"
          >
            Limpar filtros
          </button>
        </div>
      </form>
    </div>
  );
};
