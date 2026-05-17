# motion.js

> Плавные FLIP-анимации карточек на TypeScript. Нулевые зависимости.

TypeScript-библиотека для анимации перестановки HTML-карточек на основе техники **FLIP** (First → Last → Invert → Play). Использует нативный Web Animations API — никаких runtime-зависимостей.

## Быстрый старт

```bash
npm install motion.js
```

```typescript
import { AnimationBuilder } from 'motion.js/core';

const builder = new AnimationBuilder()
  .withDuration(350)
  .withEasing('cubic-bezier(0.4, 0, 0.2, 1)')
  .withStagger(30);

// До изменения DOM
builder.snapshot(cards);

// Изменяем порядок элементов...
reorderCards();

// После изменения DOM — запускаем анимацию
await builder.buildMoveAnimation(cards).play();
```

## Ключевые возможности

- **FLIP-техника** — плавное движение карточек без layout thrashing
- **Web Animations API** — нативный браузерный API, никаких зависимостей
- **Fluent builder** — читаемый DSL для настройки анимаций
- **Stagger** — волновой эффект задержек между карточками
- **Vue 3** — готовый composable `useCardAnimation`
- **TypeScript** — полная типизация из коробки

## Vue 3

```typescript
import { useCardAnimation } from 'motion.js/vue';

const { snapshot, animateMove, isAnimating } = useCardAnimation({
  duration: 350,
  stagger: 30,
});

async function onReorder() {
  snapshot(cards.value);
  reorderCards();
  await nextTick();
  await animateMove(cards.value);
}
```

---

## Документация

| Раздел | Описание |
|--------|---------|
| [Начало работы](docs/getting-started.md) | Установка, настройка, первые шаги |
| [API Reference](docs/api.md) | Классы, методы, типы |
| [Архитектура](docs/architecture.md) | Структура проекта, расширение библиотеки |
| [Contributing](docs/contributing.md) | Как участвовать в разработке |

## Лицензия

MIT
