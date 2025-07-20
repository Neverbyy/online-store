<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ProfileSection from '../components/ProfileSection.vue';

const store = useStore();

// Получаем текущее активное состояние из Vuex Store
const activeItem = computed(() => store.state.profile.activeItem);

// Массив пунктов меню
const menuItems = [
    'Настройка профиля',
    'Заказы',
    'Мои адреса',
    'Обратная связь'
];

// Метод для установки активного элемента
const setActiveItem = (index) => {
    store.dispatch('profile/setActiveItem', index);
};

</script>

<template>
    <div class="main container">
        <h1>Личный кабинет</h1>
        <div class="profile__page">
            <div class="sidebar profile-block">
                <aside>
                    <ul class="sidebar-menu">
                        <li 
                            v-for="(item, index) in menuItems" 
                            :key="index" 
                            :class="{'sidebar-item': true, 'active': activeItem === index}" 
                            @click="setActiveItem(index)"
                        >
                            <span>{{ item }}</span>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class="main__content profile-block">
                <ProfileSection/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profile__page {
    display: flex;
    justify-content: space-between;
    gap: 90px;
}

.main__content {
    width: 100%;
}

.sidebar {
    width: 400px;

    &-menu {
        display: flex;
        flex-direction: column;
        font-size: 18px;
    }

    &-item {
        cursor: pointer;
        padding: 18px;
        &:hover {
            background-color: rgb(184, 178, 178);
            transition: 0.4s;
        }
    }

    .active {
        background-color: rgb(150, 150, 150);
        font-weight: bold;
    }
}

.profile-block {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 3px 10px 2px rgba(0, 0, 0, 0.16);
    padding-top: 12px;
    padding: 20px; /* Добавлено для лучшего отображения текста */
}
</style>
