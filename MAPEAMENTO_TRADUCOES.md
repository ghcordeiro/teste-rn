# Mapeamento de Textos Hardcoded para Tradução

Este documento lista todos os textos hardcoded encontrados no código que precisam ser traduzidos.

## 📋 Componentes de Texto com Tradução

Criados componentes de texto com suporte automático a tradução:
- `TextRegularT` - Texto regular com tradução
- `TextBoldT` - Texto em negrito com tradução  
- `TextLightT` - Texto leve com tradução

**Uso:**
```tsx
import { TextRegularT, TextBoldT, TextLightT } from '@globalStyle';

// Com tradução
<TextRegularT translationKey="contracted" />

// Com parâmetros
<TextRegularT translationKey="welcome" params={{ name: "João" }} />

// Texto direto (fallback)
<TextRegularT>Texto direto</TextRegularT>
```

## 📝 Textos Encontrados por Categoria

### 1. Contratos (Contracts)

| Texto Hardcoded | Chave Sugerida | Arquivo | Status |
|----------------|----------------|---------|--------|
| `Contratado` | `contracted` | `ContractDetails`, `CardContract`, `CardLogistics` | ⚠️ Pendente |
| `Entregue` | `delivered` | `ContractDetails`, `CardContract` | ⚠️ Pendente |
| `Saldo` | `balance` | `ContractDetails`, `CardContract`, `CardLogistics`, `CashFlow` | ✅ Existe |
| `Preço` | `price` | `ContractDetails`, `ModalCardDetails*` | ✅ Existe |
| `Valor` | `value` | `ContractDetails`, `ModalCardDetails*` | ✅ Existe |
| `Valor Total` | `totalValue` | `ContractDetails` | ⚠️ Pendente |
| `Notas Fiscais` | `invoices` | `ContractDetails` (tab name) | ⚠️ Pendente |
| `Pagamentos` | `payments` | `ContractDetails` (tab name), `FilterModalFinancialMoviment` | ⚠️ Pendente |
| `Adiantamentos` | `advances` | `ContractDetails` (tab name) | ⚠️ Pendente |
| `Observações` | `observations` | `ContractDetails` (tab name) | ⚠️ Pendente |

### 2. Logística (Logistics)

| Texto Hardcoded | Chave Sugerida | Arquivo | Status |
|----------------|----------------|---------|--------|
| `Tempo Total` | `totalTime` | `CardDetailsLogistics`, `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Tempo Atual` | `currentTime` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Embarcado` | `shipped` | `CardLogistics` | ⚠️ Pendente |
| `Contrato` | `contract` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Tipo` | `type` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Motorista` | `driver` | `ModalCardDetailsLogistics`, `ModalTrackWithdrawal` | ⚠️ Pendente |
| `Placa` | `plate` | `ModalCardDetailsLogistics`, `ModalTrackWithdrawal` | ⚠️ Pendente |
| `Origem` | `origin` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Destino` | `destination` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Data de Emissão` | `issueDate` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Data de Saída` | `departureDate` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Data de Chegada` | `arrivalDate` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Data de Pesagem` | `weighingDate` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Peso Bruto` | `grossWeight` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Peso Líquido` | `netWeight` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Valor da Nota` | `invoiceValue` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Frete` | `freight` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Status` | `status` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Tempo de Viagem` | `travelTime` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Itens da Nota Fiscal` | `invoiceItems` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Detalhes` | `details` | `ModalCardDetailsLogistics` (tab name) | ✅ Existe |
| `Timeline` | `timeline` | `ModalCardDetailsLogistics` (tab name) | ✅ Existe |
| `Embarques` | `boardings` | `LogisticsDetails` (tab name) | ⚠️ Pendente |
| `Local Embarque` | `boardingPlace` | `LogisticsDetails` | ⚠️ Pendente |
| `Responsável` | `responsible` | `LogisticsDetails` | ⚠️ Pendente |
| `Posição dos contratos` | `contractPosition` | `LogisticsDetails` | ⚠️ Pendente |

### 3. Retiradas (Withdrawals)

| Texto Hardcoded | Chave Sugerida | Arquivo | Status |
|----------------|----------------|---------|--------|
| `Status` | `status` | `CardTrackWithdrawal`, `ModalTrackWithdrawal` | ⚠️ Pendente |
| `Tempo em aberto` | `openTime` | `ModalTrackWithdrawal` | ⚠️ Pendente |
| `Itens` | `items` | `ModalTrackWithdrawal` (tab name) | ✅ Existe |
| `Anexos` | `attachments` | `ModalTrackWithdrawal` (tab name) | ✅ Existe |
| `Data` | `date` | `ModalTrackWithdrawal` | ⚠️ Pendente |
| `Placa` | `plate` | `ModalTrackWithdrawal` | ⚠️ Pendente |
| `Motorista` | `driver` | `ModalTrackWithdrawal` | ⚠️ Pendente |
| `Veículo` | `vehicle` | `ModalTrackWithdrawal` | ⚠️ Pendente |
| `Informe a Placa do Veículo para Retirada!` | `enterVehiclePlateForWithdrawal` | `WithdrawalCart` | ⚠️ Pendente |
| `Placa do veículo inválida!` | `invalidVehiclePlate` | `WithdrawalCart` | ⚠️ Pendente |
| `A placa deve estar no formato AAA0000 ou AAA0A00.` | `plateFormatDescription` | `WithdrawalCart` | ⚠️ Pendente |
| `Informe a Placa do Veículo para retirada!` | `enterVehiclePlateForWithdrawalPlaceholder` | `WithdrawalCart` | ⚠️ Pendente |

### 4. Financeiro (Financial)

| Texto Hardcoded | Chave Sugerida | Arquivo | Status |
|----------------|----------------|---------|--------|
| `Saldo` | `balance` | `CashFlow`, `TabCashFlow` | ✅ Existe |
| `Pagamentos` | `payments` | `FilterModalFinancialMoviment`, `FilterModalCashFlow` | ⚠️ Pendente |
| `Status para geração de arquivo` | `statusForFileGeneration` | `FilterModalContract` | ⚠️ Pendente |

### 5. Outros

| Texto Hardcoded | Chave Sugerida | Arquivo | Status |
|----------------|----------------|---------|--------|
| `Carregando...` | `loading` | `ModalCardDetailsLogistics` | ⚠️ Pendente |
| `Hr` | `hours` | `CardDetailsLogistics`, `ModalCardDetailsLogistics` | ⚠️ Pendente (sufixo de horas) |

## 📊 Estatísticas

- **Total de textos encontrados:** ~50+
- **Chaves já existentes:** ~10
- **Chaves pendentes:** ~40+

## 🔄 Próximos Passos

1. ✅ Criar componentes de texto com tradução (`TextRegularT`, `TextBoldT`, `TextLightT`)
2. ⚠️ Adicionar todas as chaves de tradução nos arquivos `pt-BR.js` e `en-US.js`
3. ⚠️ Substituir todos os textos hardcoded pelos componentes com tradução
4. ⚠️ Testar a aplicação em ambos os idiomas

## 📌 Arquivos Prioritários para Refatoração

1. `src/features/contracts/pages/ContractDetails/index.tsx`
2. `src/components/ModalCardDetailsLogistics/index.tsx`
3. `src/components/ModalTrackWithdrawal/index.tsx`
4. `src/features/logistics/components/CardLogistics/index.tsx`
5. `src/features/logistics/components/CardDetailsLogistics/index.tsx`
6. `src/features/withdrawals/pages/WithdrawalCart/index.tsx`

