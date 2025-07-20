export const analyzeArticle = async (fullText) => {
  if (!fullText) {
    return {
      method: null,
      location: null,
      participants: null,
      mainKeywords: []
    };
  }

  try {
    // Usando o caminho absoluto para a API
    const response = await fetch(`${window.location.origin}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ fullText }),
    });

    // Tenta ler o corpo da resposta como texto primeiro
    const responseText = await response.text();

    // Verifica se a resposta é HTML (erro 404 ou similar)
    if (responseText.trim().toLowerCase().startsWith('<!doctype html>')) {
      throw new Error('API não encontrada. Verifique se o servidor está rodando e se a rota está correta.');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta:', parseError);
      throw new Error('Resposta inválida do servidor: ' + responseText.substring(0, 100));
    }

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao analisar artigo');
    }

    return data;
  } catch (error) {
    console.error('Erro na análise do artigo:', error);
    return {
      error: error.message,
      method: null,
      location: null,
      participants: null,
      mainKeywords: []
    };
  }
}; 