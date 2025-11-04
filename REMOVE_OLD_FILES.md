# Arquivos Antigos para Remoção

Este documento lista os arquivos que foram migrados para `src/features/` e podem ser removidos após validação completa.

## ⚠️ IMPORTANTE: Validação Necessária

Antes de remover qualquer arquivo, certifique-se de que:
1. ✅ Todos os imports foram atualizados para usar `src/features/`
2. ✅ A aplicação compila sem erros
3. ✅ Testes manuais foram realizados
4. ✅ Não há referências diretas aos arquivos antigos

## 📁 Arquivos em `src/pages/` para Remoção

### Contracts
- `src/pages/Contracts/` - ✅ Migrado para `src/features/contracts/pages/Contracts/`
- `src/pages/ContractDetails/` - ✅ Migrado para `src/features/contracts/pages/ContractDetails/`
- `src/pages/TabsContractDetails/` - ⚠️ Verificar se ainda é usado (parece ser um componente antigo)

### Financial
- `src/pages/FinancialMoviment/` - ✅ Migrado para `src/features/financial/pages/FinancialMoviment/`
- `src/pages/FinancialStatement/` - ✅ Migrado para `src/features/financial/pages/FinancialStatement/`
- `src/pages/CashFlow/` - ✅ Migrado para `src/features/financial/pages/CashFlow/`

### Logistics
- `src/pages/Logistics/` - ✅ Migrado para `src/features/logistics/pages/Logistics/`
- `src/pages/LogisticsDetails/` - ✅ Migrado para `src/features/logistics/pages/LogisticsDetails/`

### Withdrawals
- `src/pages/NewWithdrawal/` - ✅ Migrado para `src/features/withdrawals/pages/NewWithdrawal/`
- `src/pages/TrackWithdrawal/` - ✅ Migrado para `src/features/withdrawals/pages/TrackWithdrawal/`
- `src/pages/WithdrawalCart/` - ✅ Migrado para `src/features/withdrawals/pages/WithdrawalCart/`

### Notifications
- `src/pages/Notificacoes/` - ✅ Migrado para `src/features/notifications/pages/Notificacoes/`
- `src/pages/PageNotificationAssayResult/` - ✅ Migrado para `src/features/notifications/pages/PageNotificationAssayResult/`
- `src/pages/PageNotificationNews/` - ✅ Migrado para `src/features/notifications/pages/PageNotificationNews/`
- `src/pages/PageNotificationNotification/` - ✅ Migrado para `src/features/notifications/pages/PageNotificationNotification/`
- `src/pages/PageNotificationWithdrawal/` - ✅ Migrado para `src/features/notifications/pages/PageNotificationWithdrawal/`

### Stock
- `src/pages/Stock/` - ✅ Migrado para `src/features/stock/pages/Stock/`

## 📁 Arquivos em `src/components/` para Remoção

### Contracts
- `src/components/CardContract/` - ✅ Migrado para `src/features/contracts/components/CardContract/`
- `src/components/CardHomeContract/` - ✅ Migrado para `src/features/contracts/components/CardHomeContract/`
- `src/components/TabContractNF/` - ✅ Migrado para `src/features/contracts/components/TabContractNF/`
- `src/components/TabContractPayment/` - ✅ Migrado para `src/features/contracts/components/TabContractPayment/`
- `src/components/TabContractAdvance/` - ✅ Migrado para `src/features/contracts/components/TabContractAdvance/`
- `src/components/TabContractNFObs/` - ✅ Migrado para `src/features/contracts/components/TabContractNFObs/`

### Financial
- `src/components/CardFinancialMoviment/` - ✅ Migrado para `src/features/financial/components/CardFinancialMoviment/`
- `src/components/CardFinancialStatement/` - ✅ Migrado para `src/features/financial/components/CardFinancialStatement/`
- `src/components/CardFinancialMovimentModalCashFlow/` - ✅ Migrado para `src/features/financial/components/CardFinancialMovimentModalCashFlow/`
- `src/components/CardHomeMoviment/` - ✅ Migrado para `src/features/financial/components/CardHomeMoviment/`
- `src/components/TabCashFlow/` - ⚠️ Verificar - existe em `src/components/` e `src/features/financial/components/`
- `src/components/CardDetailsCashFlow/` - ⚠️ Verificar - ainda pode ser usado
- `src/components/ModalCardDetailsCashFlow/` - ⚠️ Verificar - ainda pode ser usado

### Logistics
- `src/components/CardLogistics/` - ✅ Migrado para `src/features/logistics/components/CardLogistics/`
- `src/components/CardDetailsLogistics/` - ✅ Migrado para `src/features/logistics/components/CardDetailsLogistics/`
- `src/components/TabLogisticsBoarding/` - ✅ Migrado para `src/features/logistics/components/TabLogisticsBoarding/`
- `src/components/TabLogisticsDetails/` - ✅ Migrado para `src/features/logistics/components/TabLogisticsDetails/`

### Withdrawals
- `src/components/CardWithdrawal/` - ✅ Migrado para `src/features/withdrawals/components/CardWithdrawal/`
- `src/components/CardWithdrawalCart/` - ✅ Migrado para `src/features/withdrawals/components/CardWithdrawalCart/`
- `src/components/CardWithdrawalItem/` - ✅ Migrado para `src/features/withdrawals/components/CardWithdrawalItem/`
- `src/components/TabItemsTrackWithdrawal/` - ⚠️ Verificar - existe em `src/components/` e `src/features/withdrawals/components/`

### Notifications
- `src/components/CardNotification/` - ✅ Migrado para `src/features/notifications/components/CardNotification/`

### Stock
- `src/components/CardStock/` - ✅ Migrado para `src/features/stock/components/CardStock/`
- `src/components/ModalCardStock/` - ✅ Migrado para `src/features/stock/components/ModalCardStock/`

## 📁 Arquivos em `src/dtos/` para Remoção

### Contracts
- `src/dtos/contract.ts` - ✅ Migrado para `src/features/contracts/types/contract.ts`
- `src/dtos/resumoContract.ts` - ✅ Migrado para `src/features/contracts/types/resumoContract.ts`

### Financial
- `src/dtos/financialMoviment.ts` - ✅ Migrado para `src/features/financial/types/financialMoviment.ts`
- `src/dtos/financialStatement.ts` - ✅ Migrado para `src/features/financial/types/financialStatement.ts`
- `src/dtos/cash-flow.ts` - ✅ Migrado para `src/features/financial/types/cash-flow.ts`

### Logistics
- `src/dtos/logistics.ts` - ✅ Migrado para `src/features/logistics/types/logistics.ts`

### Withdrawals
- `src/dtos/withdrawal.ts` - ✅ Migrado para `src/features/withdrawals/types/withdrawal.ts`
- `src/dtos/delivery-order.ts` - ✅ Migrado para `src/features/withdrawals/types/delivery-order.ts`
- `src/dtos/ISaveWithdrawalDto.ts` - ✅ Migrado para `src/features/withdrawals/types/ISaveWithdrawalDto.ts`

### Notifications
- `src/dtos/notification.ts` - ✅ Migrado para `src/features/notifications/types/notification.ts`
- `src/dtos/notification-news.ts` - ✅ Migrado para `src/features/notifications/types/notification-news.ts`

### Stock
- `src/dtos/stock.ts` - ✅ Migrado para `src/features/stock/types/stock.ts`
- `src/dtos/resumoStock.ts` - ✅ Migrado para `src/features/stock/types/resumoStock.ts`

## 🔍 Arquivos que Precisam de Verificação

Estes arquivos podem ainda estar sendo usados e precisam de verificação antes da remoção:

1. `src/components/TabCashFlow/` - Verificar se ainda é usado além do `src/features/financial/components/TabCashFlow/`
2. `src/components/TabItemsTrackWithdrawal/` - Verificar se ainda é usado além do `src/features/withdrawals/components/TabItemsTrackWithdrawal/`
3. `src/components/CardDetailsCashFlow/` - Verificar se ainda é usado
4. `src/components/ModalCardDetailsCashFlow/` - Verificar se ainda é usado
5. `src/pages/TabsContractDetails/` - Verificar se ainda é usado

## 📝 Comandos para Verificação

```bash
# Verificar se há imports dos arquivos antigos (fora de src/features/)
grep -r "from.*pages/(Contracts|Financial|Logistics|Withdrawal|Notification|Stock)" src/ --include="*.tsx" --include="*.ts" | grep -v "src/features"

# Verificar se há imports dos componentes antigos (fora de src/features/)
grep -r "from.*components/(CardContract|CardFinancial|CardLogistics|CardWithdrawal|CardNotification|CardStock|TabContract|TabLogistics|TabCashFlow)" src/ --include="*.tsx" --include="*.ts" | grep -v "src/features"
```

## ✅ Checklist de Remoção

Antes de remover os arquivos, confirme:

- [ ] Todos os imports foram atualizados
- [ ] Aplicação compila sem erros
- [ ] Testes manuais realizados
- [ ] Nenhuma referência direta aos arquivos antigos
- [ ] Backup criado (git commit antes da remoção)

## 🗑️ Comandos de Remoção (após validação)

```bash
# Remover páginas antigas
rm -rf src/pages/Contracts
rm -rf src/pages/ContractDetails
rm -rf src/pages/TabsContractDetails
rm -rf src/pages/FinancialMoviment
rm -rf src/pages/FinancialStatement
rm -rf src/pages/CashFlow
rm -rf src/pages/Logistics
rm -rf src/pages/LogisticsDetails
rm -rf src/pages/NewWithdrawal
rm -rf src/pages/TrackWithdrawal
rm -rf src/pages/WithdrawalCart
rm -rf src/pages/Notificacoes
rm -rf src/pages/PageNotificationAssayResult
rm -rf src/pages/PageNotificationNews
rm -rf src/pages/PageNotificationNotification
rm -rf src/pages/PageNotificationWithdrawal
rm -rf src/pages/Stock

# Remover componentes antigos (após verificação)
# ... (listar comandos específicos após verificação)

# Remover DTOs antigos
rm -f src/dtos/contract.ts
rm -f src/dtos/resumoContract.ts
rm -f src/dtos/financialMoviment.ts
rm -f src/dtos/financialStatement.ts
rm -f src/dtos/cash-flow.ts
rm -f src/dtos/logistics.ts
rm -f src/dtos/withdrawal.ts
rm -f src/dtos/delivery-order.ts
rm -f src/dtos/ISaveWithdrawalDto.ts
rm -f src/dtos/notification.ts
rm -f src/dtos/notification-news.ts
rm -f src/dtos/stock.ts
rm -f src/dtos/resumoStock.ts
```

