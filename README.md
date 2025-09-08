# Literature Review System (LRS)

Sistema web para busca e análise de artigos científicos, desenvolvido com arquitetura separada Frontend + Backend.

## 🚀 Funcionalidades

- **Busca de Artigos**: Pesquisa artigos científicos por termo, ano, autor
- **Filtros Avançados**: Filtros por ano, autor e idioma (português)
- **Análise Automática**: Extração de metodologia, localização, participantes e palavras-chave
- **Interface Responsiva**: Design adaptável para todos os dispositivos
- **Cache Inteligente**: Sistema de cache para otimização de performance
- **Arquitetura Desacoplada**: Frontend e Backend separados para maior flexibilidade

## 🛠️ Tecnologias

### Frontend (Next.js)
- **Framework**: Next.js 15.3.2
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **HTTP Client**: Fetch API nativo
- **Porta**: 3004

### Backend (Servidor Separado)
- **Porta**: 3005
- **APIs**: Integração com CORE API (core.ac.uk)
- **Funcionalidades**: Busca de artigos, análise de texto com IA

## ⚙️ Configuração Local

### Pré-requisitos
- Node.js 18+ 
- NPM ou Yarn
- Chave da API do CORE
- Servidor Backend do LRS (rodando na porta 3005)

### Instalação

#### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd literature-review-system
```

#### 2. Configure o Backend
O sistema requer um servidor backend separado rodando na porta 3005.
**Certifique-se de que o backend esteja rodando antes de iniciar o frontend.**

#### 3. Configure o Frontend

**Instale as dependências:**
```bash
npm install
```

**Configure as variáveis de ambiente:**
```bash
cp .env.example .env.local
```

Edite `.env.local` e configure:
```env
NEXT_PUBLIC_CORE_API_KEY=sua_chave_do_core_aqui
NEXT_PUBLIC_BACKEND_URL=http://localhost:3005
```

#### 4. Execute o servidor frontend
```bash
npm run dev
```

#### 5. Acesse o sistema
- **Frontend**: [http://localhost:3004](http://localhost:3004)
- **Backend**: [http://localhost:3005](http://localhost:3005) (deve estar rodando)

## 🌐 Deploy

### Opção 1: Vercel (Recomendado para Frontend)

**Para o Frontend:**
1. **Faça push para GitHub**
2. **Acesse [vercel.com](https://vercel.com)**
3. **Conecte seu repositório GitHub**
4. **Configure as variáveis de ambiente:**
   - `NEXT_PUBLIC_CORE_API_KEY` = sua chave da API do CORE
   - `NEXT_PUBLIC_BACKEND_URL` = URL do seu backend em produção

5. **Deploy automático!** ✨

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Para o Backend:**
- Configure o backend em um serviço separado (Railway, Heroku, DigitalOcean, etc.)
- Atualize a variável `NEXT_PUBLIC_BACKEND_URL` no frontend para apontar para o backend em produção

### Opção 2: Deploy Conjunto

1. **Configure o backend** em um serviço de hospedagem
2. **Configure o frontend** no Vercel/Netlify
3. **Configure as variáveis de ambiente** corretamente em ambos

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────┐         ┌─────────────────────┐
│                     │  HTTP   │                     │
│   Frontend (Next.js)│ ◄────► │   Backend Server    │
│   Porta: 3004       │         │   Porta: 3005       │
│                     │         │                     │
└─────────────────────┘         └─────────────────────┘
                                           │
                                           ▼
                                 ┌─────────────────────┐
                                 │                     │
                                 │    CORE API         │
                                 │  (core.ac.uk)       │
                                 │                     │
                                 └─────────────────────┘
```

## 🔑 Obtendo Chave da API do CORE

1. Acesse [core.ac.uk/api](https://core.ac.uk/api)
2. Crie uma conta gratuita
3. Solicite uma API key
4. Use a chave nas variáveis de ambiente

## 📁 Estrutura do Projeto

### Frontend (Next.js)
```
src/
├── app/                # App Router (Next.js 13+)
│   ├── globals.css    # Estilos globais
│   ├── layout.tsx     # Layout principal
│   └── page.tsx       # Página inicial
├── components/        # Componentes React
│   ├── ArticleDetails.tsx   # Detalhes do artigo selecionado
│   ├── ArticleList.tsx      # Lista de artigos
│   ├── Pagination.tsx       # Componente de paginação
│   ├── SearchFormCard.tsx   # Formulário de busca
│   └── YearFilter.tsx       # Filtro por ano
└── services/         # Camada de serviços
    ├── coreApi.js    # Comunicação com backend
    └── analysisApi.js # Análise de artigos via backend
```

### Backend (Servidor Separado)
```
literature-review-backend/
├── api/
│   ├── search        # Endpoint para busca de artigos
│   ├── articles/     # Endpoints para detalhes dos artigos
│   └── analyze       # Endpoint para análise de texto
└── ...              # Estrutura do backend
```
│   ├── ArticleList.tsx
│   ├── Pagination.tsx
│   ├── SearchFormCard.tsx
│   └── YearFilter.tsx
└── services/         # Camada de serviços
    ├── coreApi.js    # Integração CORE API
    └── aiAnalysis.js # Análise de texto
```

## 🚀 Scripts Disponíveis

### Frontend (Next.js)
```bash
npm run dev     # Servidor de desenvolvimento (porta 3004)
npm run build   # Build para produção
npm run start   # Servidor de produção (porta 3004)
npm run lint    # Verificação de código
```

### Observação
O backend deve ser iniciado separadamente na porta 3005 para que o sistema funcione corretamente.

## 🎯 Como Usar

1. **Inicie o backend** (porta 3005) - necessário estar rodando
2. **Inicie o frontend** com `npm run dev` (porta 3004)
3. **Digite o termo de busca** (ex: "machine learning")
4. **Aplique filtros** opcionais (ano, autor, apenas português)
5. **Explore os resultados** com paginação inteligente
6. **Clique em um artigo** para ver detalhes e análise automática
7. **Use filtros de ano** na lateral para refinar resultados localmente

## 🔧 Configurações Avançadas

### Personalizar URLs do Backend
```javascript
// .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3005  // Desenvolvimento
NEXT_PUBLIC_BACKEND_URL=https://seu-backend.railway.app  // Produção
```

### Configurar Análise de Texto
O backend é responsável pela análise usando para extrair:
- Metodologia utilizada
- Localização do estudo
- Número de participantes
- Palavras-chave principais

### Ajustar Paginação Local
```javascript
// src/app/page.tsx
const articlesPerPage = 10;  // Artigos por página (frontend)
```

## 📱 URLs de Exemplo

### Desenvolvimento
- **Frontend**: `http://localhost:3004`
- **Backend**: `http://localhost:3005`

### Produção
- **Frontend**: `https://seu-projeto.vercel.app`
- **Backend**: `https://seu-backend.railway.app` (ou outro serviço)

## 🔌 API Endpoints (Backend)

### Busca de Artigos
```http
POST /api/search
Content-Type: application/json

{
  "query": "machine learning",
  "filters": {
    "year": "2023",
    "author": "Silva",
    "portugueseOnly": true
  },
  "page": 1
}
```

### Detalhes do Artigo
```http
GET /api/articles/{articleId}
```

### Análise de Texto
```http
POST /api/analyze
Content-Type: application/json

{
  "fullText": "texto completo do artigo..."
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Documentação**: [Next.js Docs](https://nextjs.org/docs)
- **CORE API**: [core.ac.uk/api](https://core.ac.uk/api)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/literature-review-system/issues)

## ⚠️ Notas Importantes

1. **Dependência do Backend**: O frontend requer que o backend esteja rodando na porta 3005
2. **Variáveis de Ambiente**: Configure corretamente as URLs do backend para desenvolvimento/produção
3. **Chave da API**: Necessária chave válida da CORE API para funcionamento
4. **Análise de IA**: A análise automática de artigos depende do backend configurado com IA
