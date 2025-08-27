# Literature Review System (LRS)

Sistema web para busca e análise de artigos científicos, desenvolvido com Next.js e integração com a API do CORE.

## 🚀 Funcionalidades

- **Busca de Artigos**: Pesquisa artigos científicos por termo, ano, autor
- **Filtros Avançados**: Filtros por ano e autor específico
- **Análise Automática**: Extração de metodologia, localização e palavras-chave
- **Interface Responsiva**: Design adaptável para todos os dispositivos
- **Cache Inteligente**: Sistema de cache para otimização de performance

## 🛠️ Tecnologias

- **Framework**: Next.js 15.3.2
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **HTTP Client**: Axios
- **API Externa**: CORE API (core.ac.uk)

## ⚙️ Configuração Local

### Pré-requisitos
- Node.js 18+ 
- NPM ou Yarn
- Chave da API do CORE

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd literature-review-system
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione sua chave da API do CORE:
```env
NEXT_PUBLIC_CORE_API_KEY=sua_chave_aqui
```

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse o sistema**
Abra [http://localhost:3004](http://localhost:3004) no seu navegador.

## 🌐 Deploy Gratuito

### Opção 1: Vercel (Recomendado)

1. **Faça push para GitHub**
2. **Acesse [vercel.com](https://vercel.com)**
3. **Conecte seu repositório GitHub**
4. **Configure a variável de ambiente:**
   - `NEXT_PUBLIC_CORE_API_KEY` = sua chave da API

5. **Deploy automático!** ✨

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Opção 2: Netlify

1. **Faça push para GitHub**
2. **Acesse [netlify.com](https://netlify.com)**
3. **Conecte seu repositório**
4. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Configure variáveis de ambiente**

## 🔑 Obtendo Chave da API do CORE

1. Acesse [core.ac.uk/api](https://core.ac.uk/api)
2. Crie uma conta gratuita
3. Solicite uma API key
4. Use a chave nas variáveis de ambiente

## 📁 Estrutura do Projeto

```
src/
├── app/                # App Router (Next.js 13+)
│   ├── api/analyze/   # API para análise de texto
│   ├── globals.css    # Estilos globais
│   ├── layout.tsx     # Layout principal
│   └── page.tsx       # Página inicial
├── components/        # Componentes React
│   ├── ArticleDetails.tsx
│   ├── ArticleList.tsx
│   ├── Pagination.tsx
│   ├── SearchFormCard.tsx
│   └── YearFilter.tsx
└── services/         # Camada de serviços
    ├── coreApi.js    # Integração CORE API
    └── aiAnalysis.js # Análise de texto
```

## 🚀 Scripts Disponíveis

```bash
npm run dev     # Servidor de desenvolvimento (porta 3004)
npm run build   # Build para produção
npm run start   # Servidor de produção
npm run lint    # Verificação de código
```

## 🎯 Como Usar

1. **Digite o termo de busca** (ex: "machine learning")
2. **Aplique filtros** opcionais (ano, autor)
3. **Explore os resultados** com paginação
4. **Clique em um artigo** para ver detalhes e análise automática
5. **Use filtros de ano** na lateral para refinar resultados

## 🔧 Configurações Avançadas

### Personalizar Cache
```javascript
// src/services/coreApi.js
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora
```

### Ajustar Paginação
```javascript
// src/services/coreApi.js
const PAGE_SIZE = 10;        // Itens por página
const API_PAGE_SIZE = 30;    // Itens por requisição
```

## 📱 URLs de Exemplo

- **Produção**: `https://seu-projeto.vercel.app`
- **Desenvolvimento**: `http://localhost:3004`

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
