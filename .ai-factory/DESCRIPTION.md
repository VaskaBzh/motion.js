# motion.js — Библиотека анимаций карточек

## Обзор

`motion.js` — TypeScript-библиотека для плавной анимации движения HTML-карточек на основе техники **FLIP** (First → Last → Invert → Play). Использует нативный Web Animations API без внешних зависимостей. Предоставляет фреймворк-нейтральный core и готовые интеграции для Vue 3 и React.

## Ключевые возможности

- FLIP-анимации: плавное движение карточек при изменении порядка в DOM
- `AnimationBuilder` — fluent-builder для настройки параметров анимации
- `AnimationRunner` — оркестратор параллельного/последовательного запуска
- `TrajectoryCalculator` — вычисление дельт смещения (First/Last шаги)
- `CardMoveAnimation` — Web Animations API исполнитель с поддержкой reverse()
- Stagger-анимация: задержки между карточками для волнового эффекта
- Vue 3 composable `useCardAnimation` с реактивным флагом `isAnimating`
- React hook `useCardAnimation` (планируется)
- Vanilla JS / framework-agnostic core API

## Стек технологий

- **Язык:** TypeScript 6, strict mode, нативные `#` private fields
- **Сборщик:** Vite 8
- **Анимации:** Web Animations API (нативный браузерный API)
- **Интеграции:** Vue 3, React (планируется)
- **Тестирование:** Vitest (планируется)
- **Линтинг:** ESLint 10 + typescript-eslint

## Архитектурные заметки

- **Монорепо-структура в `src/`:** `core/` (фреймворк-нейтральный движок) + `vue/` (Vue-интеграция) + `react/` (React-интеграция, планируется)
- **Паттерн builder:** `AnimationBuilder` — точка входа, настраивается fluent-цепочкой
- **Паттерн стратегия:** `BaseAnimation` — абстрактный контракт, `CardMoveAnimation` — конкретная реализация
- **FLIP-pipeline:** `TrajectoryCalculator.before()` → (изменение DOM) → `TrajectoryCalculator.calculate()` → `AnimationRunner.play()`
- **ESM-only:** `"type": "module"`, импорты с расширением `.js`

## Архитектура

Подробные архитектурные решения, структура папок и правила зависимостей описаны в `.ai-factory/ARCHITECTURE.md`.
**Паттерн:** Модульная архитектура библиотеки (core + framework bindings)

## Нефункциональные требования

- **Тестирование:** Vitest для unit-тестов core-движка и composables
- **Строгость типов:** exactOptionalPropertyTypes, noImplicitOverride, noUnusedLocals
- **Совместимость:** Современные браузеры с поддержкой Web Animations API
- **Bundle size:** Нулевые runtime-зависимости (только devDependencies)
