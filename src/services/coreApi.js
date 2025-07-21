import axios from 'axios';

const CORE_API_KEY = process.env.NEXT_PUBLIC_CORE_API_KEY;
const CORE_API_URL = 'https://api.core.ac.uk/v3';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const PAGE_SIZE = 10; // Tamanho da página no frontend
const API_PAGE_SIZE = 50; // Tamanho da página na API

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (requestFn, retryCount = 0) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retryCount < MAX_RETRIES && (error.response?.status === 500 || error.response?.status === 429)) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount); // Backoff exponencial
      console.log(`Tentativa ${retryCount + 1} falhou, tentando novamente em ${delay}ms...`);
      await sleep(delay);
      return makeRequest(requestFn, retryCount + 1);
    }
    throw error;
  }
};

export const filterByYearRange = (items, yearRange = {}) => {
  const { gte, lte } = yearRange;

  return items.filter(item => {
    const year = item.yearPublished;
    if (!year) return false;

    if (gte && year < gte) return false;
    if (lte && year > lte) return false;

    return true;
  });
};

const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, ''); // remove pontuações

export const filterByAuthorName = (items, authorName) => {
  if (!authorName) return items;

  const targetTokens = normalize(authorName).split(/\s+/).filter(Boolean);

  return items.filter(item =>
    Array.isArray(item.authors) &&
    item.authors.some(author => {
      const authorTokens = normalize(author.name || '').split(/\s+/).filter(Boolean);

      // Verifica se todos os tokens do filtro estão no nome do autor
      return targetTokens.every(token => authorTokens.includes(token));
    })
  );
};

export const searchArticles = async (query, filters = {}, page = 1) => {
  console.log('searchArticles chamada com:', { query, filters, page });
  
  if (!CORE_API_KEY) {
    throw new Error('Chave da API do CORE não configurada. Configure a variável de ambiente NEXT_PUBLIC_CORE_API_KEY.');
  }

  if (!query || query.trim() === '') {
    throw new Error('A consulta de busca não pode estar vazia.');
  }

  try {
    const requestBody = {
      q: query.trim(),
      limit: API_PAGE_SIZE,
      offset: Math.max(0, (page - 1) * API_PAGE_SIZE),
      filters: {}
    };
    
    // Filtro por ano - aplicar diretamente na API
    if (filters.year) {
      const year = parseInt(filters.year, 10);
      requestBody.filters.yearPublished = { gte: year, lte: year };
    }

    // Filtro por autor - aplicar diretamente na API
    if (filters.author && filters.author.trim() !== '') {
      requestBody.filters.authors = [filters.author.trim()];
    }

    console.log('Requisição para API:', requestBody);

    const response = await makeRequest(() => 
      axios.post(
        `${CORE_API_URL}/search/works`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${CORE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      )
    );

    console.log('Resposta da API:', {
      totalHits: response.data.totalHits,
      resultsCount: response.data.results?.length,
      page: page
    });

    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error('Resposta inválida da API do CORE');
    }

    const rawResults = response.data?.results || [];
    const actualResultsCount = rawResults.length;
    const totalHitsFromAPI = response.data.totalHits || 0;

    // Aplicar filtros localmente como fallback se a API não aplicou corretamente
    let filteredResults = rawResults;
    
    // Filtro por ano local
    if (filters.year) {
      const year = parseInt(filters.year, 10);
      filteredResults = filteredResults.filter(item => {
        const itemYear = item.yearPublished;
        return itemYear && itemYear === year;
      });
    }
    
    // Filtro por autor local
    if (filters.author && filters.author.trim() !== '') {
      const targetAuthor = filters.author.trim().toLowerCase();
      filteredResults = filteredResults.filter(item => {
        if (!Array.isArray(item.authors)) return false;
        return item.authors.some(author => {
          const authorName = (author.name || '').toLowerCase();
          return authorName.includes(targetAuthor) || targetAuthor.includes(authorName);
        });
      });
    }

    // Filtro por idioma português
    if (filters.portugueseOnly) {
      filteredResults = filteredResults.filter(item => {
        return item.language && item.language.code === 'pt';
      });
    }

    console.log('Filtros aplicados:', {
      originalCount: rawResults.length,
      filteredCount: filteredResults.length,
      filters: filters
    });

    // Se não encontrou resultados com filtros, tentar busca mais ampla
    if (filteredResults.length === 0 && (filters.year || filters.author)) {
      console.log('Nenhum resultado encontrado com filtros, tentando busca mais ampla...');
      
      // Tentar busca sem filtros de autor, mas mantendo o ano
      const fallbackRequestBody = {
        q: query.trim(),
        limit: API_PAGE_SIZE,
        offset: Math.max(0, (page - 1) * API_PAGE_SIZE),
        filters: {}
      };
      
      if (filters.year) {
        const year = parseInt(filters.year, 10);
        fallbackRequestBody.filters.yearPublished = { gte: year, lte: year };
      }
      
      const fallbackResponse = await makeRequest(() => 
        axios.post(
          `${CORE_API_URL}/search/works`,
          fallbackRequestBody,
          {
            headers: {
              'Authorization': `Bearer ${CORE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 20000
          }
        )
      );
      
      if (fallbackResponse.data && Array.isArray(fallbackResponse.data.results)) {
        const fallbackResults = fallbackResponse.data.results;
        
        // Aplicar filtros localmente nos resultados da busca mais ampla
        if (filters.author && filters.author.trim() !== '') {
          const targetAuthor = filters.author.trim().toLowerCase();
          filteredResults = fallbackResults.filter(item => {
            if (!Array.isArray(item.authors)) return false;
            return item.authors.some(author => {
              const authorName = (author.name || '').toLowerCase();
              return authorName.includes(targetAuthor) || targetAuthor.includes(authorName);
            });
          });
        } else {
          filteredResults = fallbackResults;
        }
        
        console.log('Resultados da busca alternativa:', {
          originalCount: fallbackResults.length,
          filteredCount: filteredResults.length
        });
      }
    }

    return {
      data: filteredResults.map(work => ({
        
        title: work.title || 'Sem título',
        authors: Array.isArray(work.authors) ? work.authors.map(author => author.name || 'Autor desconhecido') : ['Autor desconhecido'],
        year: work.yearPublished || new Date().getFullYear(),
        abstract: work.abstract || 'Sem resumo disponível',
        source: work.sourceFulltextUrl || work.source || 'Fonte não disponível',
        url: work.downloadUrl || work.sourceFulltextUrl || '',
        method: work.methodology || undefined,
        location: work.location || undefined,
        university: work.publisher || undefined,
        journal: work.journals && work.journals.length > 0 ? work.journals[0].title : undefined,
        type: work.type || undefined,
        keywords: work.keywords || [],
        fullText: work.fullText || undefined,
        participants: work.participants || undefined,
        mainKeywords: work.mainKeywords || []
      })),
      totalHits: filteredResults.length, // Usar o número de resultados filtrados
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(filteredResults.length / PAGE_SIZE),
      hasMoreResults: totalHitsFromAPI > actualResultsCount // Indicar se há mais resultados disponíveis
    };
  } catch (error) {
    if (error.response) {
      console.error('Erro na resposta da API do CORE:', {
        status: error.response.status,
        data: error.response.data
      });
      
      if (error.response.status === 500) {
        throw new Error('A API do CORE está temporariamente indisponível. Por favor, tente novamente em alguns instantes.');
      }
      
      if (error.response.status === 429) {
        throw new Error('Muitas requisições em um curto período. Por favor, aguarde alguns instantes antes de tentar novamente.');
      }
      
      throw new Error(`Erro na API do CORE: ${error.response.status} - ${error.response.data?.message || 'Erro desconhecido'}`);
    } else if (error.request) {
      console.error('Sem resposta da API do CORE:', error.request);
      throw new Error('Não foi possível conectar com a API do CORE. Verifique sua conexão com a internet.');
    } else {
      console.error('Erro ao configurar requisição para a API do CORE:', error.message);
      throw new Error(`Erro ao buscar artigos: ${error.message}`);
    }
  }
};

export const getArticleDetails = async (articleId) => {
  if (!CORE_API_KEY) {
    throw new Error('Chave da API do CORE não configurada. Configure a variável de ambiente NEXT_PUBLIC_CORE_API_KEY.');
  }

  if (!articleId) {
    throw new Error('ID do artigo não fornecido');
  }

  try {
    const response = await makeRequest(() =>
      axios.get(
        `${CORE_API_URL}/works/${articleId}`,
        {
          headers: {
            'Authorization': `Bearer ${CORE_API_KEY}`
          },
          timeout: 20000
        }
      )
    );

    if (!response.data) {
      throw new Error('Resposta inválida da API do CORE');
    }

    const work = response.data;
    return {
      title: work.title || 'Sem título',
      authors: Array.isArray(work.authors) ? work.authors.map(author => author.name || 'Autor desconhecido') : ['Autor desconhecido'],
      year: work.yearPublished || new Date().getFullYear(),
      abstract: work.abstract || 'Sem resumo disponível',
      source: work.sourceFulltextUrl || work.source || 'Fonte não disponível',
      url: work.downloadUrl || work.sourceFulltextUrl || '',
      method: work.methodology || undefined,
      location: work.location || undefined,
      university: work.publisher || undefined,
      journal: work.source || undefined,
      type: work.type || undefined,
      keywords: work.keywords || [],
      fullText: work.fullText || undefined,
      participants: work.participants || undefined,
      mainKeywords: work.mainKeywords || []
    };
  } catch (error) {
    if (error.response) {
      console.error('Erro na resposta da API do CORE:', {
        status: error.response.status,
        data: error.response.data
      });
      
      if (error.response.status === 500) {
        throw new Error('A API do CORE está temporariamente indisponível. Por favor, tente novamente em alguns instantes.');
      }
      
      if (error.response.status === 429) {
        throw new Error('Muitas requisições em um curto período. Por favor, aguarde alguns instantes antes de tentar novamente.');
      }
      
      throw new Error(`Erro na API do CORE: ${error.response.status} - ${error.response.data?.message || 'Erro desconhecido'}`);
    } else if (error.request) {
      console.error('Sem resposta da API do CORE:', error.request);
      throw new Error('Não foi possível conectar com a API do CORE. Verifique sua conexão com a internet.');
    } else {
      console.error('Erro ao configurar requisição para a API do CORE:', error.message);
      throw new Error(`Erro ao buscar detalhes do artigo: ${error.message}`);
    }
  }
}; 