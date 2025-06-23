import axios from 'axios';

const CORE_API_KEY = process.env.NEXT_PUBLIC_CORE_API_KEY;
const CORE_API_URL = 'https://api.core.ac.uk/v3';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const PAGE_SIZE = 10;

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

export const searchArticles = async (query, filters = {}, page = 1) => {
  if (!CORE_API_KEY) {
    throw new Error('Chave da API do CORE não configurada. Configure a variável de ambiente NEXT_PUBLIC_CORE_API_KEY.');
  }

  if (!query || query.trim() === '') {
    throw new Error('A consulta de busca não pode estar vazia.');
  }

  try {
    const requestBody = {
      q: query.trim(),
      limit: PAGE_SIZE,
      offset: Math.max(0, (page - 1) * PAGE_SIZE),
      filters: {}
    };

    // Adiciona filtros apenas se forem fornecidos
    if (filters.year) {
      const year = parseInt(filters.year);
      if (!isNaN(year) && year > 0) {
        requestBody.filters.yearPublished = {
          gte: year,
          lte: year
        };
      }
    }

    if (filters.author && filters.author.trim() !== '') {
      requestBody.filters.authors = [filters.author.trim()];
    }

    const response = await makeRequest(() => 
      axios.post(
        `${CORE_API_URL}/search/works`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${CORE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000 // Aumentado para 20 segundos
        }
      )
    );

    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error('Resposta inválida da API do CORE');
    }

    // Transformar a resposta para o formato esperado
    console.log(response.data.results)
    return {
      data: response.data.results.map(work => ({
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
      totalHits: response.data.totalHits || 0,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil((response.data.totalHits || 0) / PAGE_SIZE)
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