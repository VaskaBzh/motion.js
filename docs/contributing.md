[← Архитектура](architecture.md) · [Back to README](../README.md)

# Contributing

## Настройка среды разработки

### Требования

- Node.js 22+
- npm 10+

### Установка зависимостей

```bash
npm install
```

### Команды

| Команда | Описание |
|---------|---------|
| `npm run dev` | Запускает dev-сервер Vite (для sandbox/demo) |
| `npm run build` | Сборка библиотеки в `dist/` |
| `npm run preview` | Предпросмотр собранного приложения |
| `npm run lint` | ESLint проверка `src/` |
| `npm run typecheck` | TypeScript проверка без emit (`tsc --noEmit`) |
| `npm test` | Запускает все unit-тесты (Vitest) |
| `npm run test:coverage` | Тесты с отчётом о покрытии |

## Структура проекта

Перед тем как вносить изменения, изучи [Архитектуру](architecture.md).

Ключевые правила:
- `src/core/` — только Web APIs, никаких фреймворк-импортов
- Импорты файлов с расширением `.ts` (не `.js`)
- При импорте из директории — только путь к папке (`'../types'`, не `'../types/index.ts'`)
- Нативные `#` private fields (не TypeScript `private`)
- `override` ключевое слово при переопределении методов

## Добавление фич

1. **Новый тип анимации** → создай в `src/core/src/animations/`, наследуй `BaseAnimation` из `base/`
2. **Новый фреймворк-биндинг** → создай `src/<framework>/`, импортируй только из `core/`
3. **Изменение builder API** → обнови `AnimationBuilder.ts` и типы в `types/`

## TypeScript

Проект использует строгий режим TypeScript:

```json
"strict": true,
"exactOptionalPropertyTypes": true,
"noImplicitOverride": true,
"noUnusedLocals": true,
"noUnusedParameters": true
```

## Проверка кода

```bash
# Тип-проверка
npm run typecheck

# Линтинг
npm run lint
```

## Тестирование

Проект использует [Vitest](https://vitest.dev/). Тесты расположены рядом с исходниками:

```
src/
├── core/src/animations/__tests__/AnimationRunner.test.ts
├── core/src/builders/__tests__/AnimationBuilder.test.ts
├── core/src/calculators/__tests__/TrajectoryCalculator.test.ts
└── vue/composables/__tests__/useCardAnimation.test.ts
```

```bash
# Запустить все тесты
npm test

# Запустить с покрытием
npm run test:coverage

# Watch-режим при разработке
npm run test:watch
```

## See Also

- [Архитектура](architecture.md) — паттерны и правила зависимостей
- [API Reference](api.md) — документация по публичному API
