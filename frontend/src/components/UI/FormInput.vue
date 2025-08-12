<script setup>
import { ref, watch, computed } from 'vue';

// Props
const props = defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: '',
  },
  mask: {
    type: String,
    default: '',  // Проп для маски
  }
});

// Emit
const emit = defineEmits(['update:modelValue']);

// Internal value and state
const internalValue = ref(props.modelValue || '');
const hasInteracted = ref(false); // Отслеживает взаимодействие пользователя

// Watch for external updates to modelValue
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue || ''; // Убедитесь, что это строка
});

// Watch for internal value changes and emit them
watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
});

const isInvalid = computed(() => {
  const value = internalValue.value || '';
  if (hasInteracted.value) {
    if (props.type === 'tel') {
      if (!value) {
        return 'Укажите номер телефона';
      } else if (value.replace(/\D/g, '').length !== 11) {
        return 'Номер телефона должен состоять из 11 цифр';
      }
    } else if (props.type === 'email') {
      if (!value && props.required) {
        return 'Укажите Email адрес';
      } else if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        return 'Неверный Email';
      }
    } else if (props.required && !value) {
      return 'Это поле обязательно для заполнения';
    }
  }
  return '';
});

// Computed property to determine if the input is valid
const isValid = computed(() => {
  const value = internalValue.value || '';
  if (props.type === 'email') {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  }
  if (props.type === 'tel') {
    // Проверка на 11 цифр (включая код страны)
    return value.replace(/\D/g, '').length === 11;
  }
  return !!value; // Для всех остальных полей
});

const handleBlur = () => {
  hasInteracted.value = true; // Пользователь убрал фокус
};

// Event handler for input event
const handleInput = () => {
  hasInteracted.value = true; // Пользователь начал вводить текст
};
</script>

<template>
  <div class="form-group">
    <div class="input-wrapper">
      <input
        v-model="internalValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        v-if="mask"
        v-mask="mask"
        :class="[inputClass, { 'input-error': isInvalid, 'input-valid': isValid }]"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-else
        v-model="internalValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :class="[inputClass, { 'input-error': isInvalid, 'input-valid': isValid }]"
        @blur="handleBlur"
        @input="handleInput"
      />
      <!-- Иконка галочки -->
      <svg v-if="isValid" class="input-icon" width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12.5" r="12" fill="#28a745"/>
        <path d="M9 12.5l2 2 4-4" stroke="#FFF" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
      <!-- Иконка ошибки -->
      <svg v-if="isInvalid" class="input-icon" width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12.5" r="12" fill="#FF0000"/>
        <circle cx="12" cy="18.5" r="1" fill="#F6F6F6"/>
        <rect x="11" y="4.5" width="2" height="11" rx="1" fill="#F6F6F6"/>
      </svg>
    </div>
    <span v-if="isInvalid" class="error-message">{{ isInvalid }}</span>
  </div>
</template>

<style lang="scss" scoped>
.form-group {
  margin-top: 15px;
  max-width: 400px;
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: inline-block; /* Обеспечивает, что обертка инпута не растягивается на всю ширину */
  width: 100%; /* Инпут будет занимать всю ширину обертки */
}

input {
  padding: 11px 40px 11px 16px; /* Увеличиваем padding-right для места под иконку */
  border-radius: 8px;
  border: 1px solid black;
  color: black;
  font-weight: 400;
  font-size: 16px;
  width: 100%;/* Убедитесь, что инпут занимает всю ширину родительского элемента */
  outline: none;
}

::placeholder {
  font-size: 16px;
  font-weight: 200;
  color: #454545;
}

.input-error {
  border: 1.5px solid red; /* Обводка красным цветом */
}

.input-valid {
  border: 1.8px solid #08a92c; /* Обводка зеленым цветом */
}

.input-icon {
  position: absolute;
  top: 50%;
  right: 8px; /* Расстояние от края инпута */
  transform: translateY(-50%);
  width: 20px; /* Размер иконки */
  height: 20px; /* Размер иконки */
  transition: opacity 0.3s; /* Плавный переход */
}

.error-message {
  color: red;
  font-size: 12px;
  margin: 4px 0 0 8px;
  text-align: left; /* Выравнивание по левому краю */
  display: block;
}
</style>
