'use client';

import { useState } from 'react';
import { searchArticles } from '../services/coreApi';
import { analyzeArticle } from '../services/aiAnalysis';

interface Article {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  source: string;
  url: string;
  method?: string;
  location?: string;
  university?: string;
  journal?: string;
  type?: string;
  keywords?: string[];
  fullText?: string;
  participants?: string;
  mainKeywords?: string[];
}

interface SearchFilters {
  year?: string;
  author?: string;
}

interface ApiArticle {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  source: string;
  url: string;
  method?: string;
  location?: string;
  university?: string;
  journal?: string;
  type?: string;
  keywords?: string[];
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [, setAnalyzing] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const filters: SearchFilters = {};
      if (searchYear) filters.year = searchYear;
      if (searchAuthor) filters.author = searchAuthor;

      const results = await searchArticles(searchTerm, filters);
      const articlesWithIds = results.data.map((article: ApiArticle, index: number) => ({
        ...article,
        id: `${article.title}-${article.year}-${index}-${Date.now()}`
      }));

      setArticles(articlesWithIds);
      setTotalPages(results.totalPages);
      setTotalResults(results.totalHits);
      setSelectedArticle(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar artigos');
      setArticles([]);
      setTotalPages(0);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    setCurrentPage(newPage);
    try {
      const filters: SearchFilters = {};
      if (searchYear) filters.year = searchYear;
      if (searchAuthor) filters.author = searchAuthor;

      const results = await searchArticles(searchTerm, filters);
      const articlesWithIds = results.data.map((article: ApiArticle, index: number) => ({
        ...article,
        id: `${article.title}-${article.year}-${index}-${Date.now()}`
      }));

      setArticles(articlesWithIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar artigos');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleSelect = async (article: Article) => {
    setSelectedArticle(article);
    setAnalyzing(true);

    try {
      if (article.fullText) {
        const analysis = await analyzeArticle(article.fullText);
        setSelectedArticle(prev => prev ? {
          ...prev,
          method: analysis.method ?? prev.method,
          location: analysis.location ?? prev.location,
          participants: analysis.participants ?? prev.participants,
          mainKeywords: analysis.mainKeywords ?? prev.mainKeywords
        } : null);
      }
    } catch (error) {
      console.error('Erro ao analisar artigo:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">Sistema de Revisão de Literatura</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Termo de Busca
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  onChange={(e) => setSearchYear(e.target.value)}
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
                  onChange={(e) => setSearchAuthor(e.target.value)}
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

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm">
            <p className="font-medium">Erro na busca:</p>
            <p>{error}</p>
          </div>
        )}

        {articles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Resultados da Busca</h2>
                  <span className="text-gray-600 font-medium">
                    Total: {totalResults} artigos
                  </span>
                </div>
                <div className="space-y-6">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer bg-white"
                      onClick={() => handleArticleSelect(article)}
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
                          <span className="font-medium text-gray-700">Ano:</span>{' '}
                          {article.year}
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

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center space-x-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                    >
                      ← Anterior
                    </button>
                    <span className="px-6 py-2 text-gray-700 font-medium">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                    >
                      Próxima →
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 bg-white rounded-lg shadow-md">
                {selectedArticle ? (
                  <div>
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Detalhes do Artigo
                      </h3>
                      <p className="text-sm text-gray-500">
                        Informações detalhadas sobre o artigo selecionado
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Universidade</h4>
                        <p className="text-gray-900 font-medium">
                          {selectedArticle.university || 'Não informado'}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Autores</h4>
                        <p className="text-gray-900 font-medium">
                          {selectedArticle.authors.length} autor(es)
                        </p>
                        <div className="mt-2 space-y-1">
                          {selectedArticle.authors.map((author, index) => (
                            <p key={index} className="text-gray-600 text-sm">
                              • {author}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Revista</h4>
                        {selectedArticle.journal ? (
                          <>
                            <p className="text-gray-900 font-medium">
                              {selectedArticle.journal}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-500 italic">Não informado</p>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Tipo de Artigo</h4>
                        <p className="text-gray-900 font-medium">
                          {selectedArticle.type || 'Não informado'}
                        </p>
                      </div>

                      {/* <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Metodologia</h4>
                        {selectedArticle.method ? (
                          <p className="text-gray-900">
                            {selectedArticle.method}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">Não informado</p>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Região do Estudo</h4>
                        {selectedArticle.location ? (
                          <p className="text-gray-900">
                            {selectedArticle.location}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">Não informado</p>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Participantes</h4>
                        {selectedArticle.participants ? (
                          <p className="text-gray-900">
                            {selectedArticle.participants}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">Não informado</p>
                        )}
                      </div> */}

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Palavras-chave Principais</h4>
                        {selectedArticle.mainKeywords && selectedArticle.mainKeywords.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedArticle.mainKeywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">Não informado</p>
                        )}
                      </div>

                      {selectedArticle.url && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Link do Artigo</h4>
                          <a
                            href={selectedArticle.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Acessar Artigo Completo
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      )}

                      {/* <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Análise do Artigo</h4>
                        {analyzing ? (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Analisando artigo...</span>
                          </div>
                        ) : (
                          <>
                            {selectedArticle.method && (
                              <p className="text-gray-900">
                                Metodologia: {selectedArticle.method}
                              </p>
                            )}
                            {selectedArticle.location && (
                              <p className="text-gray-900">
                                Região: {selectedArticle.location}
                              </p>
                            )}
                            {selectedArticle.participants && (
                              <p className="text-gray-900">
                                Participantes: {selectedArticle.participants}
                              </p>
                            )}
                            {selectedArticle.mainKeywords && selectedArticle.mainKeywords.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <p className="text-gray-900 font-medium">Palavras-chave Principais</p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedArticle.mainKeywords.map((keyword, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                    >
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div> */}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium mb-1">Selecione um artigo</p>
                    <p className="text-gray-400 text-sm">para ver mais detalhes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-2">Nenhum resultado encontrado</p>
            <p className="text-gray-400">Faça uma busca para ver os artigos</p>
          </div>
        )}
      </div>
    </main>
  );
}
