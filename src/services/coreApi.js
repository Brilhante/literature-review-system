const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005';

export const searchArticles = async (query, filters = {}, page = 1) => {
  console.log('searchArticles chamada com:', { query, filters, page });
  
  if (!query || query.trim() === '') {
    throw new Error('A consulta de busca não pode estar vazia.');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        filters,
        page
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro na busca de artigos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na busca de artigos:', error);
    throw error;
  }
};

export const getArticleDetails = async (articleId) => {
  if (!articleId) {
    throw new Error('ID do artigo não fornecido');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/articles/${articleId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao buscar detalhes do artigo');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do artigo:', error);
    throw error;
  }
};

// Funções auxiliares mantidas para compatibilidade
export const filterByYearRange = (items, yearRange = {}) => {
  const { gte, lte } = yearRange;

  return items.filter(item => {
    const year = item.year; // Usar 'year' em vez de 'yearPublished'
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
      const authorTokens = normalize(author || '').split(/\s+/).filter(Boolean);

      // Verifica se todos os tokens do filtro estão no nome do autor
      return targetTokens.every(token => authorTokens.includes(token));
    })
  );
};
