[← Архитектура](architecture.md) · [Back to README](../README.md)

# Contributing

## Настройка среды разработки

### Требования

- Node.js 20+
- npm 10+

### Установка зависимостей

```bash
npm install
```

### Команды

| Команда | Описание |
|---------|---------|
| `npm run dev` | Запускает dev-сервер Vite (для sandbox/demo) |
| `npm run build` | Сборка: `tsc && vite build` |
| `npm run preview` | Предпросмотр собранного приложения |
| `npm run lint` | ESLint проверка `src/` |
| `npm run typecheck` | TypeScript проверка без emit (`tsc --noEmit`) |

## Структура проекта

Перед тем как вносить изменения, изучи [Архитектуру](architecture.md).

Ключевые правила:
- `src/core/` — только Web APIs, никаких фреймворк-импортов
- Импорты с расширением `.js` (даже для `.ts` файлов)
- Нативные `#` private fields (не TypeScript `private`)
- `override` ключевое слово при переопределении методов

## Добавление фич

1. **Новый тип анимации** → создай в `src/core/src/animations/`, наследуй `BaseAnimation`
2. **Новый фреймворк-биндинг** → создай `src/<framework>/`, импортируй только из `core/`
3. **Изменение builder API** → обнови `AnimationBuilder.ts` и типы в `types.ts`

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

Планируется Vitest для unit-тестов. Структура тестов:

```
src/
├── core/src/animations/__tests__/
├── core/src/builders/__tests__/
└── vue/composables/__tests__/
```

## See Also

- [Архитектура](architecture.md) — паттерны и правила зависимостей
- [API Reference](api.md) — документация по публичному API
