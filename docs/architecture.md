[← API Reference](api.md) · [Back to README](../README.md) · [Contributing →](contributing.md)

# Архитектура

## Обзор

`motion.js` использует **модульную архитектуру библиотеки**: фреймворк-нейтральный `core` и независимые биндинги для каждого фреймворка.

```
src/
├── core/   ← Web APIs только, нулевые зависимости
├── vue/    ← зависит от core + vue
└── react/  ← зависит от core + react (планируется)
```

Зависимости всегда направлены к `core`. Биндинги не зависят друг от друга.

## Структура файлов

```
src/
├── core/
│   ├── index.ts                    # Публичный API: реэкспорт из src/
│   └── src/
│       ├── types.ts                # Trajectory, CardMoveOptions, BuilderConfig
│       ├── animations/
│       │   ├── BaseAnimation.ts    # Абстрактный контракт: play() / reverse()
│       │   ├── AnimationRunner.ts  # Оркестратор параллельного запуска
│       │   └── CardMoveAnimation.ts # FLIP через Web Animations API
│       ├── builders/
│       │   └── AnimationBuilder.ts # Fluent builder (точка входа)
│       └── trajectory/
│           └── TrajectoryCalculator.ts # FLIP-расчёт: before() → calculate()
└── vue/
    ├── index.ts                    # Публичный API Vue-биндинга
    └── composables/
        └── useCardAnimation.ts     # Composable с ref(isAnimating)
```

## FLIP pipeline

```
builder.snapshot(cards)
  ↓  TrajectoryCalculator.before(cards)   ← First: запомнить позиции
──── изменение DOM ────
builder.buildMoveAnimation(cards)
  ↓  TrajectoryCalculator.calculate(cards)  ← Last + Invert: вычислить дельты
  ↓  для каждой сдвинувшейся карточки:
  ↓  new CardMoveAnimation(el, trajectory, options)
     AnimationRunner.add(animation)
runner.play()
  ↓  CardMoveAnimation.play()             ← Play: Web Animations API
```

## Правила зависимостей

```
          core/
         (только Web APIs)
          ↑          ↑
        vue/       react/
```

- ✅ `vue/` → `core/`
- ✅ `react/` → `core/`
- ❌ `core/` → `vue/` или `react/`
- ❌ `vue/` → `react/`

## Добавить новый тип анимации

### 1. Создай класс в `src/core/src/animations/`

```typescript
// src/core/src/animations/CardFadeAnimation.ts
import { BaseAnimation } from './BaseAnimation.js';

export class CardFadeAnimation extends BaseAnimation {
  readonly #element: HTMLElement;
  readonly #duration: number;
  #animation: Animation | null = null;

  constructor(element: HTMLElement, duration = 300) {
    super();
    this.#element = element;
    this.#duration = duration;
  }

  override play(): Promise<void> {
    this.#animation = this.#element.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: this.#duration, fill: 'none' }
    );
    return this.#animation.finished.then(() => undefined);
  }

  override reverse(): Promise<void> {
    this.#animation = this.#element.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: this.#duration, fill: 'none' }
    );
    return this.#animation.finished.then(() => undefined);
  }
}
```

### 2. Экспортируй из `src/core/src/index.ts`

```typescript
export { CardFadeAnimation } from './animations/CardFadeAnimation.js';
```

### 3. Используй через AnimationRunner

```typescript
const runner = new AnimationRunner();
cards.forEach(el => runner.add(new CardFadeAnimation(el, 250)));
await runner.play();
```

## Добавить новый фреймворк-биндинг (React)

```
src/react/
├── index.ts
└── hooks/
    └── useCardAnimation.ts
```

```typescript
// src/react/hooks/useCardAnimation.ts
import { useRef, useState, useCallback } from 'react';
import { AnimationBuilder } from '../../core/src/index.js'; // ← только core

export function useCardAnimation(options = {}) {
  const builderRef = useRef(new AnimationBuilder());
  const [isAnimating, setIsAnimating] = useState(false);

  const snapshot = useCallback((cards) => {
    builderRef.current.snapshot(cards);
  }, []);

  const animateMove = useCallback(async (cards) => {
    setIsAnimating(true);
    try {
      await builderRef.current.buildMoveAnimation(cards).play();
    } finally {
      setIsAnimating(false);
    }
  }, []);

  return { snapshot, animateMove, isAnimating };
}
```

## Ключевые соглашения

| Соглашение | Правило |
|-----------|---------|
| Импорты | Всегда с `.js` расширением (ESM-only) |
| Приватные поля | Нативные `#field`, не TypeScript `private` |
| Fluent методы | Возвращают `this` |
| Переопределение | Ключевое слово `override` обязательно |
| Новые анимации | Наследуют `BaseAnimation` |

## See Also

- [API Reference](api.md) — подробная документация по всем классам
- [Contributing](contributing.md) — как запустить и протестировать проект
