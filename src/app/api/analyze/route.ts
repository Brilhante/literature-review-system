import { NextResponse } from 'next/server';

// Configuração da rota
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  console.log('API Route: Iniciando processamento da requisição');
  
  try {
    if (request.method !== 'POST') {
      console.log('API Route: Método não permitido');
      return new NextResponse(
        JSON.stringify({ error: 'Método não permitido' }),
        { 
          status: 405,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    let fullText;
    try {
      const body = await request.json();
      fullText = body.fullText;
      console.log('API Route: Texto recebido, tamanho:', fullText?.length);
    } catch (error) {
      console.error('API Route: Erro ao fazer parse do corpo da requisição:', error);
      return new NextResponse(
        JSON.stringify({
          error: 'Erro ao processar o corpo da requisição',
          method: null,
          location: null,
          participants: null,
          mainKeywords: []
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    if (!fullText) {
      console.log('API Route: Texto vazio');
      return new NextResponse(
        JSON.stringify({
          method: null,
          location: null,
          participants: null,
          mainKeywords: []
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    console.log('API Route: Iniciando análise do texto');
    try {
      // Análise básica do texto usando expressões regulares e heurísticas
      const analysis = analyzeText(fullText);
      console.log('API Route: Análise concluída com sucesso');
      
      return new NextResponse(
        JSON.stringify(analysis),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    } catch (error: unknown) {
      console.error('API Route: Erro na análise do texto:', error);
      return new NextResponse(
        JSON.stringify({
          error: `Erro na análise do texto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          method: null,
          location: null,
          participants: null,
          mainKeywords: []
        }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
  } catch (error) {
    console.error('API Route: Erro não tratado:', error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Erro desconhecido na análise',
        method: null,
        location: null,
        participants: null,
        mainKeywords: []
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

// Função para análise básica do texto
function analyzeText(text: string) {
  // Palavras-chave comuns para cada categoria
  const methodKeywords = [
    'método', 'metodologia', 'abordagem', 'estudo', 'pesquisa',
    'qualitativo', 'quantitativo', 'análise', 'coleta de dados',
    'revisão', 'prática', 'artigos', 'temas'
  ];

  const locationKeywords = [
    'local', 'região', 'cidade', 'estado', 'país', 'instituição',
    'universidade', 'hospital', 'clínica', 'escola', 'território',
    'sociocultural', 'contexto'
  ];

  const participantKeywords = [
    'participantes', 'sujeitos', 'amostra', 'população', 'grupo',
    'pacientes', 'estudantes', 'profissionais', 'voluntários',
    'autores', 'pesquisadores'
  ];

  // Função para limpar o texto
  function cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Remove espaços extras
      .replace(/[^\w\s.,;:!?-]/g, '') // Remove caracteres especiais exceto pontuação básica
      .trim();
  }

  // Função para extrair texto entre palavras-chave
  function extractBetweenKeywords(text: string, startKeywords: string[], endKeywords: string[]): string {
    const lowerText = text.toLowerCase();
    let startIndex = -1;
    let endIndex = -1;

    // Encontra o início
    for (const keyword of startKeywords) {
      const index = lowerText.indexOf(keyword.toLowerCase());
      if (index !== -1 && (startIndex === -1 || index < startIndex)) {
        startIndex = index;
      }
    }

    // Encontra o fim
    for (const keyword of endKeywords) {
      const index = lowerText.indexOf(keyword.toLowerCase(), startIndex);
      if (index !== -1 && (endIndex === -1 || index < endIndex)) {
        endIndex = index;
      }
    }

    if (startIndex === -1) return '';
    if (endIndex === -1) endIndex = text.length;

    // Extrai o texto e limpa
    let extracted = text.substring(startIndex, endIndex).trim();
    
    // Remove a palavra-chave inicial se ela estiver no início
    for (const keyword of startKeywords) {
      if (extracted.toLowerCase().startsWith(keyword.toLowerCase())) {
        extracted = extracted.substring(keyword.length).trim();
        break;
      }
    }

    return cleanText(extracted);
  }

  // Extrai metodologia
  const methodText = extractBetweenKeywords(
    text,
    methodKeywords,
    ['resultados', 'conclusão', 'discussão', 'considerações finais', 'abstract', 'resumo']
  );

  // Extrai local
  const locationText = extractBetweenKeywords(
    text,
    locationKeywords,
    ['método', 'metodologia', 'participantes', 'resultados', 'abstract', 'resumo']
  );

  // Extrai participantes
  const participantsText = extractBetweenKeywords(
    text,
    participantKeywords,
    ['resultados', 'análise', 'procedimentos', 'abstract', 'resumo']
  );

  // Extrai palavras-chave
  const words = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const wordFrequency: { [key: string]: number } = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  const mainKeywords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);

  return {
    method: methodText || 'Metodologia não identificada',
    location: locationText || 'Local não identificado',
    participants: participantsText || 'Informações sobre participantes não identificadas',
    mainKeywords
  };
} 