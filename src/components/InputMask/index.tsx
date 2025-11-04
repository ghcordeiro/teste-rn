import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {TextInputProps} from 'react-native';

import {TextRegular} from '@globalStyle';
import {normalize} from '@size';
import validateCPF from '@utils/validateCPF';
import {darken} from 'polished';
import {MaskedTextInput} from 'react-native-mask-text';
import Colors from '../../assets/colors';
import {isNotNullAndUndefined} from '../../utils/validation';
import {Container, Icon, InputText} from './styles';

// Tipos de máscara suportados
type MaskType =
  | 'cpf'
  | 'phone'
  | 'date'
  | 'datetime'
  | 'zip-code'
  | 'credit-card'
  | 'money'
  | 'text'
  | 'password';

interface InputProps extends TextInputProps {
  icon?: string;
  type: MaskType;
  options?: any; // Mantido para compatibilidade, mas não será usado com nova biblioteca
  isError?: boolean;
  isEnable?: boolean;
  savedValue?: string;
  observable?: boolean;
}

// Mapeamento de tipos para máscaras do react-native-mask-text
const getMaskForType = (type: MaskType): string | undefined => {
  switch (type) {
    case 'cpf':
      return '999.999.999-99';
    case 'phone':
      return '(99) 99999-9999';
    case 'date':
      return '99/99/9999';
    case 'datetime':
      return '99/99/9999 99:99';
    case 'zip-code':
      return '99999-999';
    case 'credit-card':
      return '9999 9999 9999 9999';
    case 'money':
      // Para valores monetários, pode precisar de lógica adicional
      return undefined;
    default:
      return undefined;
  }
};

interface InputValueReference {
  value: string;
}

export interface InputRef {
  focus(): void;
  isFocused(): boolean;
  isError(state: boolean): void;
  value(): string;
  setValue(value: any): void;
  isValid(): boolean;
  setIsValid(state: boolean): void;
}

const InputForm: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  {
    icon,
    savedValue,
    type,
    isEnable = true,
    options: _options,
    observable = false,
    ...rest
  },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const inputValueRef = useRef<InputValueReference>({value: ''});

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const [fieldError, setFieldError] = useState<boolean>(false);
  const [fieldValue, setFieldValue] = useState(savedValue || '');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleInputFocus = useCallback(() => {
    setFieldError(false);
    setIsFocused(true);

    // Limpa o campo se contém apenas a máscara padrão (sem números)
    const currentValue = fieldValue || '';
    const hasOnlyMaskChars =
      currentValue.length > 0 && !/\d/.test(currentValue);

    if (hasOnlyMaskChars || currentValue.includes('999')) {
      // Limpa o campo
      setFieldValue('');
      inputValueRef.current.value = '';
    }
  }, [fieldValue]);

  const handleInputBlur = useCallback(() => {
    setIsFilled(!!inputValueRef.current.value);
    setIsFocused(false);
  }, []);

  // envia uma informação de um componente filho para o componente pai
  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
    isFocused() {
      return isFocused;
    },
    isError(state: boolean) {
      setFieldError(state);
    },
    value() {
      return inputValueRef.current.value;
    },
    setValue(value: any) {
      inputValueRef.current.value = value;
      setFieldValue(value);
    },
    isValid() {
      return isValid;
    },
    setIsValid(state: boolean) {
      setIsValid(state);
    },
  }));

  const setValue = (_ref: any, value: any) => {
    inputValueRef.current.value = value;
    setFieldValue(value);
  };

  useEffect(() => {
    if (isNotNullAndUndefined(savedValue)) {
      setValue(null, savedValue);
    } else {
      // Garante que o campo inicia vazio
      setFieldValue('');
      inputValueRef.current.value = '';
    }
  }, [savedValue]);

  // Limpa o valor se detectar que está mostrando apenas a máscara
  useEffect(() => {
    if (
      fieldValue &&
      fieldValue.includes('999') &&
      !/\d[0-9]/.test(fieldValue.replace(/[^0-9]/g, ''))
    ) {
      // Se o valor contém o padrão da máscara mas não tem números reais, limpa
      const onlyNines = fieldValue.replace(/[^9]/g, '');
      if (onlyNines.length >= 11) {
        setFieldValue('');
        inputValueRef.current.value = '';
      }
    }
  }, [fieldValue]);

  // Limpa o campo ao montar se não tem savedValue
  useEffect(() => {
    if (!savedValue) {
      // Garante que o campo inicia vazio
      setFieldValue('');
      inputValueRef.current.value = '';
    }
  }, [savedValue]);

  function retornaColor(enabled: boolean, error: boolean) {
    if (enabled) {
      if (error) {
        return Colors.danger.danger_1;
      }
      return darken(0.15, Colors.ecoop.primary);
    }
    return Colors.ecoop.darkGray;
  }

  return (
    <>
      <Container
        isFocused={isFocused}
        error={fieldError}
        isEnable={isEnable}
        observable={observable}>
        {type === 'password' || type === 'text' ? (
          <InputText
            ref={inputElementRef}
            placeholderTextColor={Colors.ecoop.gray}
            placeholder={observable ? 'Pesquisar' : ''}
            defaultValue={fieldValue}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            error={fieldError}
            editable={isEnable}
            secureTextEntry={type === 'password'}
            onChangeText={(value: any) => {
              setFieldError(false);
              inputValueRef.current.value = value;
              setFieldValue(value);
              if (observable) {
                return value;
              }
            }}
            style={{
              color: retornaColor(isEnable, fieldError),
              fontFamily: 'Lato-Regular',
              height: '100%',
              width: '100%',
            }}
            {...rest}
          />
        ) : (
          <MaskedTextInput
            style={{
              flex: 10,
              fontSize: normalize(16),
              height: '100%',
              width: '100%',
              color: retornaColor(isEnable, fieldError),
              fontFamily: 'Lato-Regular',
              // borderRightWidth: 1,
              // borderRightColor: Colors.ecoop.gray
            }}
            ref={inputElementRef}
            placeholderTextColor={Colors.ecoop.gray}
            mask={getMaskForType(type)}
            editable={isEnable}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChangeText={(formatted: string, extracted: string) => {
              setFieldError(false);
              setErrorMessage(undefined);

              // extracted contém apenas os números digitados (sem máscara)
              // Se extracted está vazio, o campo está vazio
              const isEmpty = !extracted || extracted.length === 0;

              if (isEmpty) {
                // Campo vazio - limpa o valor
                inputValueRef.current.value = '';
                setFieldValue('');
                setIsValid(false);
              } else {
                // Tem números digitados - atualiza com valor formatado
                inputValueRef.current.value = formatted;
                setFieldValue(formatted);

                // Validação de CPF (ajustada para o formato com máscara: 999.999.999-99 = 14 caracteres)
                if (type === 'cpf' && formatted.length === 14) {
                  const cpfWithoutMask =
                    extracted || formatted.replace(/[.-]/g, '');
                  if (!validateCPF(cpfWithoutMask)) {
                    setFieldError(true);
                    setIsValid(false);
                    setErrorMessage('CPF inválido!');
                  } else {
                    setIsValid(true);
                  }
                } else {
                  setIsValid(true);
                }
              }
            }}
            {...rest}
            {...(fieldValue && fieldValue.length > 0
              ? {value: fieldValue}
              : {})}
          />
        )}
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={
              isEnable && !observable
                ? fieldError
                  ? Colors.danger.danger_0
                  : isFocused || isFilled
                  ? darken(0.15, Colors.ecoop.primary)
                  : Colors.secondary.color_1
                : Colors.ecoop.darkGray
            }
          />
        )}
      </Container>
      {errorMessage && (
        <TextRegular size={12} color={Colors.white}>
          {errorMessage}
        </TextRegular>
      )}
    </>
  );
};

export default forwardRef(InputForm);
