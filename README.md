# ERP Next.js

Sistema ERP moderno construído com Next.js, TypeScript e Tailwind CSS.

## Tecnologias Principais

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Prisma (ORM)

## Requisitos

- Node.js 18+
- npm ou yarn
- Git

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lugardetech/erp-next.git
cd erp-next
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

- `/src/app`: Componentes e lógica específica das rotas
- `/src/components`: Componentes React reutilizáveis
- `/src/services`: Serviços e lógica de negócios
- `/src/lib`: Utilitários e funções auxiliares
- `/src/config`: Configurações da aplicação

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a build de produção
- `npm start`: Inicia o servidor de produção
- `npm run lint`: Executa o linter

## Contribuição

1. Crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`
2. Commit suas mudanças: `git commit -m 'feat: Adiciona nova feature'`
3. Push para a branch: `git push origin feature/nome-da-feature`
4. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 