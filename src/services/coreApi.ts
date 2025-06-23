import axios from 'axios';

interface CoreApiResponse {
  data: {
    title: string;
    authors: string[];
    year: number;
    abstract: string;
    source: string;
    url: string;
    method?: string;
    location?: string;
  }[];
  totalPages: number;
  totalHits: number;
}

interface SearchFilters {
  year?: string;
  author?: string;
}

const CORE_API_KEY = process.env.NEXT_PUBLIC_CORE_API_KEY;
const CORE_API_URL = 'https://core.ac.uk/api/v2';

export const searchArticles = async (query: string, filters: SearchFilters = {}): Promise<CoreApiResponse> => {
  try {
    const response = await axios.post(
      `${CORE_API_URL}/search`,
      {
        q: query,
        ...filters
      },
      {
        headers: {
          'Authorization': `Bearer ${CORE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar artigos na API do CORE:', error);
    throw error;
  }
};

export const getArticleDetails = async (articleId: string): Promise<CoreApiResponse['data'][0]> => {
  try {
    const response = await axios.get(
      `${CORE_API_URL}/articles/${articleId}`,
      {
        headers: {
          'Authorization': `Bearer ${CORE_API_KEY}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do artigo:', error);
    throw error;
  }
}; 