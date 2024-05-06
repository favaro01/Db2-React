export const normalizePhoneNumber = (value: String | undefined) => {
  if (!value) return ''
  
  return value.replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})(\d+?)/, '$1')
}

export const normalizeCnpjNumber = (value: String | undefined) => {
  if (!value) return ''
  
  return value.replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
}

export const normalizeCepNumber = (value: String | undefined) => {
  if (!value) return ''
  return value.replace(/\D/g, "")
  .replace(/^(\d{5})(\d{3})+?$/, "$1-$2")
  .replace(/(-\d{3})(\d+?)/, '$1')    
}

export const normalizeCelularNumber = (value: String | undefined) => {
  if (!value) return ''
  
  return value.replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})(\d+?)/, '$1');
}

export const normalizeCpfNumber = (value: String | undefined) => {
  if (!value) return ''
  
  return value.replace(/[\D]/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
}

export const normalizeBirthDate = (value: String | undefined) => {
  if (!value) return ''
  
  return value.replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
}

export const normalizeRgNumber = (value: String | undefined) => {
  if (!value) return ''
  
  return value.replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
}

export const normalizeCreditCardNumber = (value: String | undefined) => {
  if (!value) return ''
  
  return value.replace(/[\D]/g, '')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
}

export const normalizeCreditCardExpiry = (value: String | undefined) => {
  if (!value) return ''
  
  return value.replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{2})\d+?$/, '$1');
}

export const normalizeEmail = (value: String | undefined) => {
  // Não requer máscara, apenas valida o formato
  // Exemplo: usuario@dominio.com
  return value ? value.trim() : '';
}

export const normalizeInteger = (value: String | undefined) => {
  // Não requer máscara, apenas valida números
  // Exemplo: 12345
  return value ? value.replace(/\D/g, '') : '';
}

export const normalizeDecimal = (value: String | undefined) => {
  // Não requer máscara, apenas valida números com ponto decimal
  // Exemplo: 123.45
  return value ? value.replace(/[^\d.]/g, '') : '';
}

export const normalizeTelefoneFixo = (value: String | undefined) => {
  if (!value) return '';
  
  return value.replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
}

export const normalizeCurrency = (value: string | undefined) => {
  if (!value) return '';

  const numericValue = value.replace(/[^\d,]/g, '');

  if (!numericValue) return '';

  const parts = numericValue.split(',');
  const integerPart = parts[0].replace(/\D/g, '');
  const decimalPart = parts[1] ? parts[1].replace(/\D/g, '').slice(0, 2) : '';

  const formattedValue = Number(integerPart).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `R$ ${formattedValue},${decimalPart.padEnd(2, '0')}`;
}