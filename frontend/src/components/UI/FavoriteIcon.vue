<template>
  <svg
    :width="width" 
    :height="height" 
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
  >
    <g filter="url(#filter0_d_518_90)">
      <rect x="19" y="19" width="40" height="40" rx="8" fill="#F6F6F6"/>
      <path
        d="M46.612 32.8261C46.1722 32.4057 45.65 32.0722 45.0752 31.8447C44.5005 31.6171 43.8844 31.5 43.2623 31.5C42.6401 31.5 42.0241 31.6171 41.4493 31.8447C40.8746 32.0722 40.3524 32.4057 39.9126 32.8261L38.9998 33.6982L38.087 32.8261C37.1986 31.9773 35.9936 31.5004 34.7372 31.5004C33.4809 31.5004 32.2759 31.9773 31.3875 32.8261C30.4991 33.6749 30 34.8262 30 36.0266C30 37.227 30.4991 38.3782 31.3875 39.227L32.3003 40.0991L38.9998 46.5L45.6992 40.0991L46.612 39.227C47.0521 38.8068 47.4011 38.3079 47.6393 37.7587C47.8774 37.2096 48 36.621 48 36.0266C48 35.4321 47.8774 34.8435 47.6393 34.2944C47.4011 33.7453 47.0521 33.2463 46.612 32.8261Z"
        :fill="active ? '#750DC5' : 'none'"
        stroke="#0C0C0C"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <filter id="filter0_d_518_90" x="0" y="0" width="80" height="80" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="1" dy="1"/>
        <feGaussianBlur stdDeviation="10"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_518_90"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_518_90" result="shape"/>
      </filter>
    </defs>
  </svg>
</template>

<script setup>
const props = defineProps({
  width: {
    type: [String, Number],
    default: 32
  },
  height: {
    type: [String, Number],
    default: 32
  },
  active: {
    type: Boolean,
    default: false
  }
});
</script> 