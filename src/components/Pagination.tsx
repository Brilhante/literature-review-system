'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  hasMoreResults?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  loading,
  onPageChange,
  hasMoreResults = true,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-center space-x-4">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 ease-in-out font-medium cursor-pointer transform hover:scale-105 active:scale-95"
          >
            ← Anterior
          </button>
        )}
        <span className="px-6 py-2 text-gray-700 font-medium">
          Página {currentPage} de {totalPages}
        </span>
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 ease-in-out font-medium cursor-pointer transform hover:scale-105 active:scale-95"
          >
            Próxima →
          </button>
        )}
      </div>
      {!hasMoreResults && currentPage === totalPages && (
        <div className="mt-4 text-center text-sm text-gray-500 animate-fade-in">
          Todos os resultados disponíveis foram carregados
        </div>
      )}
    </div>
  );
};
