# Code Splitting por Feature - Guia de Implementação

## 📋 Visão Geral

Com a estrutura feature-based implementada, a aplicação está preparada para code splitting. Este documento descreve as opções e estratégias para implementar code splitting no React Native.

## ⚠️ Limitações do React Native

Diferente do ambiente web, o React Native com Metro bundler tem limitações:

1. **Não suporta `React.lazy()`** por padrão
2. **Metro não faz code splitting automático** como Webpack
3. **Requer configuração adicional** para lazy loading

## 🎯 Estratégias Disponíveis

### Opção 1: Lazy Loading Manual (Recomendado)

Usar `React.lazy()` com um polyfill ou solução customizada para carregar features sob demanda.

#### Implementação

```typescript
// src/utils/lazyLoad.ts
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(importFn);
};

// Exemplo de uso em rotas
const Contracts = lazyLoad(() => import('src/features/contracts/pages/Contracts'));
const FinancialMoviment = lazyLoad(() => import('src/features/financial/pages/FinancialMoviment'));
```

#### Requisitos
- Polyfill para `React.lazy()` (ex: `react-native-lazy-load`)
- Suspense boundaries nas rotas
- Tratamento de erros

### Opção 2: Code Splitting com React Navigation (Atual)

O React Navigation já faz algum code splitting automático através de lazy loading de telas.

#### Status Atual
- ✅ `tabRoutes.tsx` já usa imports diretos
- ⚠️ Todas as features são carregadas no bundle inicial

#### Migração para Lazy Loading

```typescript
// src/routes/config/tabRoutes.tsx
import { lazy } from 'react';

const TAB_ROUTES = [
  {
    name: 'Contracts',
    component: lazy(() => import('src/features/contracts/pages/Contracts')),
    // ...
  },
  // ...
];
```

#### Requisitos
- Atualizar `NavigationContainer` para usar Suspense
- Adicionar loading states

### Opção 3: Bundle Splitting com Metro (Avançado)

Configurar Metro para gerar múltiplos bundles por feature.

#### Configuração `metro.config.js`

```javascript
const { getDefaultConfig } = require('@react-native/metro-config');

const config = {
  transformer: {
    // ... configurações existentes
  },
  resolver: {
    // ... configurações existentes
  },
  // Configuração para code splitting
  serializer: {
    createModuleIdFactory: () => {
      let nextId = 0;
      return (path) => {
        // Agrupar por feature
        if (path.includes('features/contracts')) return `contracts_${nextId++}`;
        if (path.includes('features/financial')) return `financial_${nextId++}`;
        // ...
        return nextId++;
      };
    },
  },
};

module.exports = config;
```

#### Requisitos
- Scripts customizados para build
- Configuração de bundle loading
- Gerenciamento de assets

## 📊 Estrutura Preparada

A estrutura feature-based já está preparada para code splitting:

```
src/features/
  contracts/          ✅ Isolado e pronto para splitting
  financial/          ✅ Isolado e pronto para splitting
  logistics/          ✅ Isolado e pronto para splitting
  withdrawals/       ✅ Isolado e pronto para splitting
  notifications/     ✅ Isolado e pronto para splitting
  stock/             ✅ Isolado e pronto para splitting
  shared/            ⚠️ Deve ser carregado sempre (common chunk)
```

## 🎯 Recomendação

### Fase 1: Lazy Loading de Rotas (Baixo Esforço, Médio Impacto)

1. Implementar lazy loading nas rotas do Tab Navigator
2. Adicionar Suspense boundaries
3. Mostrar loading states durante carregamento

**Benefícios:**
- Reduz tamanho inicial do bundle
- Melhora tempo de inicialização
- Implementação relativamente simples

### Fase 2: Bundle Splitting (Alto Esforço, Alto Impacto)

1. Configurar Metro para gerar bundles por feature
2. Implementar sistema de carregamento dinâmico
3. Otimizar assets e dependências

**Benefícios:**
- Redução significativa do bundle inicial
- Carregamento sob demanda de features
- Melhor performance em dispositivos com pouca memória

## 📝 Checklist de Implementação

### Lazy Loading de Rotas
- [ ] Instalar polyfill para `React.lazy()` (se necessário)
- [ ] Atualizar `tabRoutes.tsx` para usar lazy imports
- [ ] Adicionar Suspense boundaries em `Tabs.tsx`
- [ ] Criar componente de loading para features
- [ ] Testar carregamento de features
- [ ] Medir impacto no bundle size

### Bundle Splitting
- [ ] Configurar `metro.config.js` para code splitting
- [ ] Criar scripts de build para múltiplos bundles
- [ ] Implementar sistema de carregamento dinâmico
- [ ] Configurar assets por bundle
- [ ] Testar carregamento de bundles
- [ ] Medir impacto no bundle size e performance

## 🔍 Ferramentas de Análise

### Analisar Bundle Size

```bash
# Gerar relatório de bundle
npx react-native-bundle-visualizer

# Ou usar Metro diretamente
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output bundle.js --verbose
```

### Verificar Dependências

```bash
# Ver dependências de uma feature
npx react-native-community/cli analyze

# Ver tamanho de módulos
npx webpack-bundle-analyzer bundle.js
```

## 📚 Referências

- [React Native Performance - Code Splitting](https://reactnative.dev/docs/performance)
- [Metro Bundler Configuration](https://metrobundler.dev/docs/configuration)
- [React Navigation - Lazy Loading](https://reactnavigation.org/docs/lazy-loading)

## ⚠️ Notas Importantes

1. **Code splitting pode aumentar complexidade** - Avaliar se o ganho justifica o esforço
2. **Metro bundler limitações** - Não é tão flexível quanto Webpack
3. **Testes necessários** - Validar em diferentes dispositivos e condições de rede
4. **Manutenção contínua** - Configurações de code splitting requerem atenção durante desenvolvimento

## 🎯 Conclusão

A estrutura feature-based está **100% preparada** para code splitting. A implementação pode ser feita incrementalmente:

1. **Agora:** Focar em lazy loading de rotas (baixo esforço)
2. **Futuro:** Considerar bundle splitting se necessário (alto esforço)

A decisão de implementar deve ser baseada em:
- Tamanho atual do bundle
- Performance de inicialização
- Necessidades de negócio
- Recursos disponíveis

---

*Documento criado em Dezembro 2024*

