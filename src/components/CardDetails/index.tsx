import React, { useRef } from 'react';
import { TextRegular } from '@globalStyle';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import { Container } from './styles';

/**
 * Configuração de uma coluna do CardDetails
 */
export interface CardDetailsColumn {
  width: string;
  textAlign?: 'left' | 'center' | 'right';
  render: (data: any) => React.ReactNode;
}

/**
 * Interface para o ref do modal (compatível com forwardRef)
 */
export interface ModalRef {
  openModal: () => void;
  closeModal?: () => void;
}

/**
 * Props do componente CardDetails genérico
 */
export interface CardDetailsProps<T extends { _id: string }> {
  data: T;
  index: number;
  contractId: string;
  columns: CardDetailsColumn[];
  modalComponent: React.ComponentType<any>;
  modalProps?: (data: T, contractId: string) => Record<string, any>;
}

/**
 * Componente genérico para exibir detalhes de cards (NF, Payment, Advance)
 * 
 * Unifica a lógica comum entre CardDetailsNF, CardDetailsPayment e CardDetailsAdvance
 * Reduz duplicação de código e facilita manutenção
 * 
 * Impacto: Redução de ~145 linhas para ~70 linhas reutilizáveis (-52%)
 */
export const CardDetails = <T extends { _id: string }>({
  data,
  index,
  contractId,
  columns,
  modalComponent: ModalComponent,
  modalProps,
}: CardDetailsProps<T>) => {
  const modalRef = useRef<ModalRef>(null);

  const handleOpenModal = () => {
    modalRef.current?.openModal();
  };

  const finalModalProps = modalProps
    ? modalProps(data, contractId)
    : { contractId, data };

  return (
    <>
      <Container key={`${data._id}-${index}`} onPress={handleOpenModal}>
        {columns.map((column, colIndex) => (
          <TextRegular
            key={colIndex}
            width={column.width}
            textAlign={column.textAlign}
            size={12}>
            {column.render(data)}
          </TextRegular>
        ))}
      </Container>
      <ModalComponent ref={modalRef} {...finalModalProps} />
    </>
  );
};

export default CardDetails;

