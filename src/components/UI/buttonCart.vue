<template>
    <button class="cartbtn"><slot></slot></button>
</template>

<style lang="scss" scoped>
.cartbtn{
            background-color: var(--color-btn);
            padding: 12px 40px;
            color: var(--color-white);
            margin-top: auto;

                    &:hover{
                        opacity: 75%;
                    }
                }
</style>
