import type { BaseAnimation } from './BaseAnimation.js';

/**
 * Оркестратор: запускает набор анимаций параллельно и ждёт их завершения.
 */
export class AnimationRunner {
	readonly #animations: BaseAnimation[] = [];

	/**
	 * Добавляет анимацию в очередь запуска.
	 * @param animation - Экземпляр BaseAnimation
	 * @returns this (для цепочки вызовов)
	 */
	add(animation: BaseAnimation): this {
		this.#animations.push(animation);
		return this;
	}

	/** Запускает все анимации параллельно. */
	play(): Promise<void> {
		return Promise.all(this.#animations.map((anim) => anim.play())).then(() => undefined);
	}

	/** Воспроизводит все анимации в обратном порядке параллельно. */
	reverse(): Promise<void> {
		return Promise.all(this.#animations.map((anim) => anim.reverse())).then(() => undefined);
	}

	/** Очищает список анимаций. */
	clear(): this {
		this.#animations.length = 0;
		return this;
	}
}
