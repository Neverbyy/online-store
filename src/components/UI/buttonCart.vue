<template>
    <button class="cartbtn" :disabled="$attrs.disabled"><slot></slot></button>
</template>

<style lang="scss" scoped>
.cartbtn{
    background-color: #750DC5;
    padding: 12px 40px;
    color: var(--color-white);
    margin-top: auto;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover:not(:disabled){
        background-color: #5a0a9a;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(117, 13, 197, 0.3);
    }

    &:active:not(:disabled){
        transform: translateY(0);
        box-shadow: 0 4px 15px rgba(117, 13, 197, 0.2);
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
}
</style>
