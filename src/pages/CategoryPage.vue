<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter  } from 'vue-router';
import {useStore} from 'vuex';
import CategoryList from '../components/CategoryList.vue';
import CategorySide from '../components/CategorySide.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();

const categoryExists = ref(false);

const category = computed(() => route.params.category);
const items = computed(() => store.getters.getItems)
const filteredProducts = computed(() => items.value.filter(item => item.category === category.value));
const categoryName = computed(() => store.getters.getCategoryNameById(category.value));

onMounted(async () => {
  await store.dispatch('fetchItems');
  categoryExists.value = items.value.some(item => item.category === category.value);
  if (!categoryExists.value) {
    router.push({ name: 'NotFound' });
  }
});


const props = defineProps({
  products: Array
})

</script>

<template>
    <div class="main container">
      <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link :to="{ name: 'Catalog' }">Каталог</router-link></li>
        <li class="breadcrumb-item"><router-link :to="{ name: 'Category', params: { category } }">{{ categoryName }}</router-link></li>
      </ol>
    </nav>
        <h1>{{ categoryName }}</h1>
        <div class="category-page">

        <CategorySide />

        <CategoryList 
        :products="filteredProducts"
        />
        </div>
    </div>
</template>


<style lang="scss" scoped>

</style>