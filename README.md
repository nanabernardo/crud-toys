# 🧸 Registro de Brinquedos

CRUD completo para gerenciamento de brinquedos com Next.js 14, Prisma, SQLite e Tailwind CSS.

---

## 🏗️ Estrutura do Projeto

```
toy-registry/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── public/
│   └── uploads/               # Imagens enviadas (criada automaticamente)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── toys/
│   │   │   │   ├── route.ts        # GET (listagem) + POST (criação)
│   │   │   │   └── [id]/route.ts   # GET + PATCH (edição) + DELETE
│   │   │   └── upload/route.ts     # Upload de imagens
│   │   ├── toys/
│   │   │   ├── new/page.tsx        # Página de criação
│   │   │   └── [id]/page.tsx       # Página de edição
│   │   ├── globals.css
│   │   ├── layout.tsx              # Layout raiz (navbar, footer)
│   │   └── page.tsx                # Listagem principal
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Spinner.tsx         # Indicador de loading
│   │   │   └── Toast.tsx           # Notificações de sucesso/erro
│   │   ├── DeleteModal.tsx         # Modal de confirmação de exclusão
│   │   ├── SearchBar.tsx           # Busca com debounce
│   │   ├── SortControls.tsx        # Ordenação por campo
│   │   ├── ToyCard.tsx             # Card individual
│   │   ├── ToyForm.tsx             # Formulário reutilizável (create/edit)
│   │   └── ToyGrid.tsx             # Grid de cards
│   └── lib/
│       ├── prisma.ts               # Singleton do Prisma Client
│       ├── types.ts                # Tipos TypeScript compartilhados
│       ├── utils.ts                # Helpers de moeda e formatação
│       └── validations.ts          # Schemas Zod
```

---

## 🚀 Passo a Passo para Rodar

### 1. Clone e instale dependências

```bash
git clone <seu-repo>
cd toy-registry
npm install
```

### 2. Configure o banco de dados

O arquivo `.env` já está configurado para SQLite local:

```env
DATABASE_URL="file:./dev.db"
```

> **Para PostgreSQL:** troque para `postgresql://user:pass@localhost:5432/toy_registry`
> e ajuste o `provider` em `prisma/schema.prisma`.

### 3. Crie o banco e gere o Prisma Client

```bash
npm run db:push      # Cria as tabelas no SQLite
npm run db:generate  # Gera o Prisma Client tipado
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 5. (Opcional) Visualize o banco com Prisma Studio

```bash
npm run db:studio
```

---

## 📋 Funcionalidades

| Feature       | Descrição                                         |
| ------------- | ------------------------------------------------- |
| ✅ Listar     | Cards com imagem, valores e badge de economia     |
| ✅ Criar      | Formulário com validação Zod e máscara de moeda   |
| ✅ Editar     | Mesma página/formulário, carrega dados existentes |
| ✅ Deletar    | Modal de confirmação antes de excluir             |
| ✅ Upload     | Imagem local (salva em /public/uploads) ou URL    |
| ✅ Busca      | Filtro por nome com debounce de 350ms             |
| ✅ Ordenação  | Por nome, valor encontrado, valor oferecido, data |
| ✅ Moeda      | Máscara R$ em tempo real no formulário            |
| ✅ Loading    | Spinners e estados de loading em todas as ações   |
| ✅ Feedback   | Toast de sucesso/erro após cada operação          |
| ✅ Responsivo | Layout adapta de 1 a 4 colunas conforme tela      |

---

## 🛠️ Decisões Técnicas

### Por que SQLite?

Zero configuração — não precisa instalar servidor de banco. Ideal para desenvolvimento local e projetos pequenos. Para produção com múltiplos usuários simultâneos, migre para PostgreSQL.

### Por que App Router?

O App Router (Next.js 13+) permite Server Components, que buscam dados direto no servidor sem expor a lógica ao cliente. A página principal é um Server Component que passa dados prontos para os Client Components de interatividade.

### Por que Zod no cliente E no servidor?

Segurança em camadas: o frontend valida antes de enviar (melhor UX), o backend valida novamente (nunca confie no cliente). O mesmo schema é reutilizado nos dois lados.

### Upload de imagem

Armazenado em `/public/uploads/` com nome gerado por timestamp + random. Em produção, substituir pela rota de upload do S3 ou Cloudinary mantendo a mesma interface da API.

---

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia build de produção
npm run db:push      # Sincroniza schema com banco
npm run db:generate  # Regenera Prisma Client
npm run db:studio    # Interface visual do banco
```
