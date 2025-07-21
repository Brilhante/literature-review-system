'use client';

import React from 'react';

interface Article {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  url: string;
}

interface ArticleListProps {
  articles: Article[];
  totalResults: number;
  onSelect: (article: Article) => void | Promise<void>;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  totalResults,
  onSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Resultados da Busca</h2>
        <span className="text-gray-600 font-medium">Total: {totalResults} artigos</span>
      </div>
      <div className="space-y-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer bg-white hover:bg-gray-50"
            onClick={() => onSelect(article)}
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
              {article.title}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium text-gray-700">Autores:</span>{' '}
                {article.authors.join(', ')}
              </p>
              <p>
                <span className="font-medium text-gray-700">Ano:</span> {article.year}
              </p>
              <p className="line-clamp-3">
                <span className="font-medium text-gray-700">Resumo:</span>{' '}
                {article.abstract}
              </p>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Acessar Artigo Completo →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
