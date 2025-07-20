'use client';

import React from 'react';

interface SearchFormCardProps {
  searchTerm: string;
  searchYear: string;
  searchAuthor: string;
  loading: boolean;
  onSearchTermChange: (value: string) => void;
  onSearchYearChange: (value: string) => void;
  onSearchAuthorChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchFormCard: React.FC<SearchFormCardProps> = ({
  searchTerm,
  searchYear,
  searchAuthor,
  loading,
  onSearchTermChange,
  onSearchYearChange,
  onSearchAuthorChange,
  onSubmit,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={onSubmit} className="space-y-4">
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
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium text-lg shadow-sm hover:shadow-md"
          >
            {loading ? 'Buscando...' : 'Buscar Artigos'}
          </button>
        </div>
      </form>
    </div>
  );
};
