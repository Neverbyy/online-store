import { computed } from 'vue';

export const useDiscount = (product) => {
  const discountPercentage = computed(() => {
    if (!product.value?.oldPrice || !product.value?.price || !product.value?.isSale) return 0;
    
    const oldPrice = parseInt(product.value.oldPrice.replace(/\s/g, ''));
    const currentPrice = parseInt(product.value.price.replace(/\s/g, ''));
    
    if (oldPrice <= currentPrice) return 0;
    
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  });

  const savingsAmount = computed(() => {
    if (!product.value?.oldPrice || !product.value?.price || !product.value?.isSale) return 0;
    
    const oldPrice = parseInt(product.value.oldPrice.replace(/\s/g, ''));
    const currentPrice = parseInt(product.value.price.replace(/\s/g, ''));
    
    if (oldPrice <= currentPrice) return 0;
    
    return oldPrice - currentPrice;
  });

  return {
    discountPercentage,
    savingsAmount
  };
}; 