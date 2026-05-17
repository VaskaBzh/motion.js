[← API Reference](api.md) · [Back to README](../README.md) · [Contributing →](contributing.md)

# Архитектура

## Обзор

`@motionlab/motionkit` использует **модульную архитектуру библиотеки**: фреймворк-нейтральный `core` и независимые биндинги для каждого фреймворка.

```
src/
├── core/   ← Web APIs только, нулевые зависимости
└── vue/    ← зависит от core + vue
```

Зависимости всегда направлены к `core`. Биндинги не зависят друг от друга.

## Структура файлов

```
src/
├── core/
│   ├── index.ts                         # Публичный API: реэкспорт из src/
│   └── src/
│       ├── index.ts                     # Публичный API core
│       ├── base/
│       │   └── BaseAnimation.ts         # Абстрактный контракт: play() / reverse()
│       ├── animations/
│       │   ├── AnimationRunner.ts       # Оркестратор параллельного запуска
│       │   └── CardMoveAnimation.ts     # FLIP через Web Animations API
│       ├── builders/
│       │   └── AnimationBuilder.ts      # Fluent builder (точка входа)
│       ├── calculators/
│       │   └── TrajectoryCalculator.ts  # FLIP-расчёт: before() → calculate()
│       └── types/
│           ├── index.ts                 # Реэкспорт всех типов
│           ├── animation.ts             # CardMoveOptions, BuilderConfig, AnimationConstructor
│           └── trajectory.ts            # Trajectory
└── vue/
    ├── index.ts                         # Публичный API Vue-биндинга
    └── composables/
        └── useCardAnimation.ts          # Composable с ref(isAnimating)
```

## FLIP pipeline

```
builder.snapshot(cards)
  ↓  TrajectoryCalculator.before(cards)     ← First: запомнить позиции
──── изменение DOM ────
builder.buildAnimation(cards)
  ↓  TrajectoryCalculator.calculate(cards)  ← Last + Invert: вычислить дельты
  ↓  для каждой сдвинувшейся карточки:
  ↓  new AnimationClass(el, trajectory, options)   ← CardMoveAnimation или use()
     AnimationRunner.add(animation)
runner.play()
  ↓  animation.play()                       ← Play: Web Animations API
```

## Правила зависимостей

```
          core/
         (только Web APIs)
              ↑
            vue/
```

- ✅ `vue/` → `core/`
- ❌ `core/` → `vue/`

## Добавить новый тип анимации

### Вариант 1: через use() (без изменения библиотеки)

```typescript
import { AnimationBuilder, BaseAnimation } from '@motionlab/motionkit/core';
import type { Trajectory, CardMoveOptions } from '@motionlab/motionkit/core';

class CardFadeAnimation extends BaseAnimation {
  readonly #element: HTMLElement;
  readonly #duration: number;
  #animation: Animation | null = null;

  constructor(element: HTMLElement, _trajectory: Trajectory, options: CardMoveOptions = {}) {
    super();
    this.#element = element;
    this.#duration = options.duration ?? 300;
  }

  override play(): Promise<void> {
    this.#animation = this.#element.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: this.#duration, fill: 'backwards' }
    );
    return this.#animation.finished.then(() => undefined);
  }

  override reverse(): Promise<void> {
    this.#animation = this.#element.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: this.#duration }
    );
    return this.#animation.finished.then(() => undefined);
  }
}

await new AnimationBuilder()
  .use(CardFadeAnimation)
  .withDuration(250)
  .buildAnimation(cards)
  .play();
```

### Вариант 2: новый класс внутри библиотеки

#### 1. Создай класс в `src/core/src/animations/`

```typescript
// src/core/src/animations/CardFadeAnimation.ts
import { BaseAnimation } from '../base/BaseAnimation.ts';
import type { Trajectory, CardMoveOptions } from '../types';

export class CardFadeAnimation extends BaseAnimation {
  // ...реализация как выше
}
```

#### 2. Экспортируй из `src/core/src/index.ts`

```typescript
export { CardFadeAnimation } from './animations/CardFadeAnimation.ts';
```

#### 3. Используй напрямую через AnimationRunner

```typescript
const runner = new AnimationRunner();
cards.forEach(el => runner.add(new CardFadeAnimation(el, { element: el, deltaX: 0, deltaY: 0 })));
await runner.play();
```

## Ключевые соглашения

| Соглашение | Правило |
|-----------|---------|
| Импорты файлов | С расширением `.ts` (ESM-only) |
| Импорты директорий | Путь к папке без `index.ts` (`'../types'`, не `'../types/index.ts'`) |
| Приватные поля | Нативные `#field`, не TypeScript `private` |
| Fluent методы | Возвращают `this` |
| Переопределение | Ключевое слово `override` обязательно |
| Новые анимации | Наследуют `BaseAnimation` из `base/` |

## See Also

- [API Reference](api.md) — подробная документация по всем классам
- [Contributing](contributing.md) — как запустить и протестировать проект
