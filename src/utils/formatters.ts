import { toWords } from 'number-to-words';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB');
};

export const amountToWords = (amount: number) => {
  if (!amount) return 'Zero Taka Only';
  // number-to-words outputs "one hundred", we need "One Hundred Taka Only"
  const words = toWords(amount);
  return `${words.charAt(0).toUpperCase() + words.slice(1)} Taka Only`;
};
