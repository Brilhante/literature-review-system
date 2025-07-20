import axios from 'axios';

const SCIELO_API_URL = 'https://search.scielo.org/api/v1/';
const PAGE_SIZE = 10;

export interface ScieloArticle {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  source: string;
  url: string;
  journal?: string;
}

export const searchArticlesFromScielo = async (
  query: string,
  page = 1
): Promise<{
  data: ScieloArticle[];
  totalHits: number;
  page: number;
  totalPages: number;
}> => {
  if (!query || query.trim() === '') {
    throw new Error('A consulta de busca não pode estar vazia.');
  }

  const offset = (page - 1) * PAGE_SIZE;

  try {
    const response = await axios.get(SCIELO_API_URL, {
      params: {
        q: query,
        lang: 'pt',
        count: PAGE_SIZE,
        from: offset,
        output: 'json',
      },
    });

    const results = response.data?.results || [];

    const articles: ScieloArticle[] = results.map((item: any) => ({
      title: item.title || 'Sem título',
      authors: item.authors || ['Autor desconhecido'],
      year: item.publication_date
        ? parseInt(item.publication_date.substring(0, 4))
        : new Date().getFullYear(),
      abstract: item.abstract || 'Sem resumo disponível',
      source: item.journal || 'Fonte não disponível',
      url: item.url || '',
      journal: item.journal || undefined,
    }));

    return {
      data: articles,
      totalHits: response.data?.count || articles.length,
      page,
      totalPages: Math.ceil((response.data?.count || articles.length) / PAGE_SIZE),
    };
  } catch (error: any) {
    if (error.response) {
      console.error('Erro na resposta da API SciELO:', error.response.data);
      throw new Error('Erro ao buscar dados na API SciELO.');
    } else {
      console.error('Erro na requisição da API SciELO:', error.message);
      throw new Error('Erro de conexão com a API SciELO.');
    }
  }
};
