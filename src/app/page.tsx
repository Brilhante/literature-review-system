'use client';

import { useState, useMemo, useEffect } from 'react';
import { searchArticles } from '../services/coreApi';
import { analyzeArticle } from '../services/aiAnalysis';
import { ArticleDetails } from '@/components/ArticleDetails';
import { SearchFormCard } from '@/components/SearchFormCard';
import { ArticleList } from '@/components/ArticleList';
import { Pagination } from '@/components/Pagination';
import { YearFilter } from '@/components/YearFilter';

interface Article {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
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
  portugueseOnly?: boolean;
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
  // Removido: const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]); // Todos os artigos da API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [portugueseOnly, setPortugueseOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [, setAnalyzing] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false); // Se há mais resultados disponíveis
  const [filterInfo, setFilterInfo] = useState<string | null>(null); // Informação sobre filtros aplicados
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  // Anos únicos dos artigos carregados
  const availableYears = useMemo(() => {
    const years = allArticles.map(a => a.year).filter(Boolean);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [allArticles]);

  // Artigos filtrados localmente por ano (aplicar sobre allArticles)
  const filteredByYearArticles = useMemo(() => {
    if (selectedYears.length === 0) return allArticles;
    return allArticles.filter(a => selectedYears.includes(a.year));
  }, [allArticles, selectedYears]);

  // Paginação local após filtro de ano
  const articlesPerPage = 10;
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    return filteredByYearArticles.slice(startIndex, endIndex);
  }, [filteredByYearArticles, currentPage]);

  // Atualizar totalPages e totalResults dinamicamente
  useEffect(() => {
    setTotalPages(Math.ceil(filteredByYearArticles.length / articlesPerPage));
    setTotalResults(filteredByYearArticles.length);
    // Se a página atual ficou inválida, volta para a primeira
    if ((currentPage - 1) * articlesPerPage >= filteredByYearArticles.length && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredByYearArticles, currentPage]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFilterInfo(null);
    setCurrentPage(1);

    try {
      const filters: SearchFilters = {};
      if (searchYear) filters.year = searchYear;
      if (searchAuthor) filters.author = searchAuthor;
      if (portugueseOnly) filters.portugueseOnly = true;

      const results = await searchArticles(searchTerm, filters, 1);
      const articlesWithIds = results.data.map((article: ApiArticle, index: number) => ({
        ...article,
        id: `${article.title}-${article.year}-${index}-${Date.now()}`
      }));

      setAllArticles(articlesWithIds);
      setHasMoreResults(results.hasMoreResults);

      // Mostrar apenas os primeiros 10 artigos
      // setArticles(articlesWithIds.slice(0, 10)); // Removido
      setTotalPages(Math.ceil(results.totalHits / 10));
      setTotalResults(results.totalHits);
      setSelectedArticle(null);

      // Mostrar informação sobre filtros se aplicados
      if (searchYear || searchAuthor || portugueseOnly) {
        const filterMessages = [];
        if (searchYear) filterMessages.push(`ano: ${searchYear}`);
        if (searchAuthor) filterMessages.push(`autor: "${searchAuthor}"`);
        if (portugueseOnly) filterMessages.push('apenas português');
        setFilterInfo(`Filtros aplicados: ${filterMessages.join(', ')}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar artigos');
      // setArticles([]); // Removido
      setAllArticles([]);
      setTotalPages(0);
      setTotalResults(0);
      setHasMoreResults(false);
      setFilterInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    console.log('Mudando para página:', newPage);

    setSelectedArticle(null);

    // Calcular quantos artigos já temos carregados
    const articlesPerPage = 10;
    const totalLoadedArticles = allArticles.length;
    const maxLocalPages = Math.ceil(totalLoadedArticles / articlesPerPage);

    // Se a página solicitada está dentro dos artigos já carregados
    if (newPage <= maxLocalPages) {
      setCurrentPage(newPage);
      // Removido: const startIndex = (newPage - 1) * articlesPerPage;
      // Removido: const endIndex = startIndex + articlesPerPage;
      // Removido: setArticles(allArticles.slice(startIndex, endIndex));
      return;
    }

    // Se precisamos buscar mais artigos da API e há mais resultados disponíveis
    if (!hasMoreResults) {
      console.log('Não há mais resultados disponíveis');
      return;
    }

    setLoading(true);
    setCurrentPage(newPage);

    try {
      const filters: SearchFilters = {};
      if (searchYear) filters.year = searchYear;
      if (searchAuthor) filters.author = searchAuthor;
      if (portugueseOnly) filters.portugueseOnly = true;

      // Calcular qual página da API precisamos buscar
      const apiPage = Math.ceil((newPage * articlesPerPage) / 50);
      console.log('Buscando artigos da API, página:', apiPage);

      const results = await searchArticles(searchTerm, filters, apiPage);
      const newArticlesWithIds = results.data.map((article: ApiArticle, index: number) => ({
        ...article,
        id: `${article.title}-${article.year}-${index}-${Date.now()}`
      }));

      // Adicionar novos artigos aos existentes
      const updatedAllArticles = [...allArticles, ...newArticlesWithIds];
      setAllArticles(updatedAllArticles);
      setHasMoreResults(results.hasMoreResults);

      // Atualizar total de resultados
      setTotalResults(updatedAllArticles.length);
      setTotalPages(Math.ceil(updatedAllArticles.length / articlesPerPage));

      // Mostrar a página solicitada
      // Removido: const startIndex = (newPage - 1) * articlesPerPage;
      // Removido: const endIndex = startIndex + articlesPerPage;
      // Removido: setArticles(updatedAllArticles.slice(startIndex, endIndex));

    } catch (err) {
      console.error('Erro na paginação:', err);
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchYear('');
    setSearchAuthor('');
    setPortugueseOnly(false);
    setSelectedYears([]);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">Sistema de Revisão de Literatura</h1>

        <SearchFormCard
          searchTerm={searchTerm}
          searchYear={searchYear}
          searchAuthor={searchAuthor}
          portugueseOnly={portugueseOnly}
          loading={loading}
          onSearchTermChange={setSearchTerm}
          onSearchYearChange={setSearchYear}
          onSearchAuthorChange={setSearchAuthor}
          onPortugueseOnlyChange={setPortugueseOnly}
          onSubmit={handleSearch}
          onClearFilters={handleClearFilters}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm">
            <p className="font-medium">Erro na busca:</p>
            <p>{error}</p>
          </div>
        )}

        {filterInfo && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg shadow-sm">
            <p className="font-medium">Informação:</p>
            <p>{filterInfo}</p>
          </div>
        )}

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Carregando...</span>
            </div>
          </div>
        )}

        {!loading && filteredByYearArticles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <ArticleList
                  articles={paginatedArticles}
                  totalResults={totalResults}
                  onSelect={handleArticleSelect}
                />
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                loading={loading}
                onPageChange={handlePageChange}
                hasMoreResults={hasMoreResults}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 flex flex-col gap-6">
                <YearFilter years={availableYears} selectedYears={selectedYears} onChange={setSelectedYears} />
                <ArticleDetails article={selectedArticle} />
              </div>
            </div>
          </div>
        )}

        {!loading && filteredByYearArticles.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-2">Nenhum resultado encontrado</p>
            <p className="text-gray-400">Faça uma busca para ver os artigos</p>
          </div>
        )}
      </div>
    </main>
  );
}
