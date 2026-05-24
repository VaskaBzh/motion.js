<template>
  <div class="demo-layout">
    <header class="demo-header">
      <h1>motion<span>.js</span> Vue demo</h1>
      <nav class="tabs">
        <button
          :class="['tab-btn', { 'tab-btn--active': tab === 'shuffle' }]"
          @click="tab = 'shuffle'"
        >Shuffle</button>
        <button
          :class="['tab-btn', { 'tab-btn--active': tab === 'dynamic' }]"
          @click="tab = 'dynamic'"
        >Dynamic</button>
      </nav>
    </header>

    <ShuffleDemo v-if="tab === 'shuffle'" />
    <DynamicDemo v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ShuffleDemo from './components/ShuffleDemo.vue';
import DynamicDemo from './components/DynamicDemo.vue';

type Tab = 'shuffle' | 'dynamic';
const tab = ref<Tab>('shuffle');
</script>
