[Back to README](../README.md) · [API Reference →](api.md)

# Начало работы

## Требования

- Браузер с поддержкой [Web Animations API](https://caniuse.com/web-animations) (Chrome 84+, Firefox 75+, Safari 14+)
- TypeScript 5+ (опционально, библиотека поставляется с `.d.ts`)

## Установка

```bash
npm install motion.js
# или
yarn add motion.js
# или
pnpm add motion.js
```

## Vanilla TypeScript / JavaScript

Импортируй из core-модуля:

```typescript
import { AnimationBuilder } from 'motion.js/core';
```

### Базовый пример

```typescript
const cards = document.querySelectorAll<HTMLElement>('.card');

const builder = new AnimationBuilder()
  .withDuration(300)       // длительность в мс (по умолчанию 300)
  .withEasing('ease')      // CSS-функция плавности
  .withStagger(0);         // задержка между карточками в мс

// Шаг 1: сделай снимок ПЕРЕД изменением DOM
builder.snapshot(cards);

// Шаг 2: измени порядок карточек в DOM
shuffleCards();

// Шаг 3: запусти анимацию ПОСЛЕ изменения DOM
const runner = builder.buildMoveAnimation(cards);
await runner.play();
```

### С stagger-эффектом

```typescript
const builder = new AnimationBuilder()
  .withDuration(350)
  .withEasing('cubic-bezier(0.4, 0, 0.2, 1)')
  .withStagger(30);   // каждая следующая карточка стартует на 30мс позже

builder.snapshot(cards);
cards.sort(byNewOrder);  // изменяем порядок в DOM
await builder.buildMoveAnimation(cards).play();
```

## Vue 3

Установи тот же пакет и импортируй из Vue-интеграции:

```typescript
import { useCardAnimation } from 'motion.js/vue';
```

### Использование в компоненте

```vue
<script setup lang="ts">
import { nextTick, useTemplateRef } from 'vue';
import { useCardAnimation } from 'motion.js/vue';

const cardRefs = useTemplateRef<HTMLElement[]>('cards');
const { snapshot, animateMove, isAnimating } = useCardAnimation({
  duration: 350,
  stagger: 30,
});

async function onReorder() {
  snapshot(cardRefs.value ?? []);   // снимок ДО изменения
  items.value.reverse();            // меняем порядок реактивного массива
  await nextTick();                 // ждём обновления DOM
  await animateMove(cardRefs.value ?? []);  // анимируем
}
</script>

<template>
  <div>
    <div
      v-for="item in items"
      :key="item.id"
      ref="cards"
      class="card"
    >{{ item.label }}</div>
    <button :disabled="isAnimating" @click="onReorder">
      Перемешать
    </button>
  </div>
</template>
```

## Проверка работы

После запуска анимации карточки должны плавно переместиться на новые позиции. Если движения нет:

1. Убедись, что `snapshot()` вызван **до** изменения DOM
2. Убедись, что `buildMoveAnimation()` вызван **после** изменения DOM (и после `nextTick()` во Vue)
3. Проверь, что карточки действительно сдвинулись (библиотека анимирует только те, у которых `deltaX !== 0 || deltaY !== 0`)

## Следующие шаги

- [API Reference](api.md) — полная документация по классам и методам
- [Архитектура](architecture.md) — структура библиотеки и как её расширять

## See Also

- [API Reference](api.md) — все параметры AnimationBuilder
- [Архитектура](architecture.md) — как добавить новый тип анимации
