# 🔧 Correção - ESLint e @types/node-cron no Deploy

## ❌ Problemas

1. **ESLint não encontrado**:
   ```
   O ESLint precisa estar instalado para ser executado durante as compilações
   ```

2. **@types/node-cron não encontrado**:
   ```
   Não foi possível encontrar um arquivo de declaração para o módulo 'node-cron'
   ```

## ✅ Causa

O `eslint`, `eslint-config-next` e `@types/node-cron` estavam em `devDependencies`, mas são necessários durante o build de produção. O Next.js executa ESLint durante o build e precisa dos tipos para verificar o código TypeScript.

## ✅ Solução Aplicada

### Dependências Movidas para `dependencies`:

1. **`eslint`** - Necessário para o Next.js executar linting durante o build
2. **`eslint-config-next`** - Configuração do ESLint para Next.js
3. **`@types/node-cron`** - Tipos TypeScript para `node-cron` (usado em `lib/cron-job.ts`)

### Dependências Mantidas em `devDependencies`:

- `@types/bcryptjs` - Apenas para desenvolvimento
- `@types/jsonwebtoken` - Apenas para desenvolvimento
- `@types/react` - Apenas para desenvolvimento
- `@types/react-dom` - Apenas para desenvolvimento

## 🚀 Status

- ✅ `eslint` movido para `dependencies`
- ✅ `eslint-config-next` movido para `dependencies`
- ✅ `@types/node-cron` movido para `dependencies`
- ✅ Pronto para deploy no Render

## 📝 Notas

- O Next.js executa ESLint durante o build por padrão
- Tipos TypeScript usados no código devem estar em `dependencies` se o código for verificado durante o build
- Dependências necessárias durante o build devem estar em `dependencies`

