import { TrajectoryCalculator } from '../trajectory/TrajectoryCalculator.js';
import { CardMoveAnimation } from '../animations/CardMoveAnimation.js';
import { AnimationRunner } from '../animations/AnimationRunner.js';
import type { BuilderConfig } from '../types.js';

/**
 * Fluent builder для создания анимаций карточек.
 *
 * @example
 * ```ts
 * const builder = new AnimationBuilder()
 *   .withDuration(350)
 *   .withEasing('cubic-bezier(0.4, 0, 0.2, 1)')
 *   .withStagger(30);
 *
 * builder.snapshot(cards);          // до изменения DOM
 * // ... изменяем DOM ...
 * await builder.buildMoveAnimation(cards).play(); // после
 * ```
 */
export class AnimationBuilder {
	#config: BuilderConfig = {
		duration: 300,
		easing: 'ease',
		stagger: 0,
	};
	readonly #calculator: TrajectoryCalculator;

	/**
	 * @param calculator - Реализация TrajectoryCalculator (по умолчанию создаётся автоматически)
	 */
	constructor(calculator: TrajectoryCalculator = new TrajectoryCalculator()) {
		this.#calculator = calculator;
	}

	/**
	 * Устанавливает длительность анимации.
	 * @param ms - Длительность в миллисекундах
	 */
	withDuration(ms: number): this {
		this.#config.duration = ms;
		return this;
	}

	/**
	 * Устанавливает CSS-функцию плавности.
	 * @param easing - Например `'ease'`, `'linear'`, `'cubic-bezier(0.4, 0, 0.2, 1)'`
	 */
	withEasing(easing: string): this {
		this.#config.easing = easing;
		return this;
	}

	/**
	 * Устанавливает задержку между анимациями соседних карточек.
	 * @param ms - Задержка в миллисекундах
	 */
	withStagger(ms: number): this {
		this.#config.stagger = ms;
		return this;
	}

	/**
	 * Делает снимок позиций карточек до изменения DOM (шаг First).
	 * @param cards - Карточки, позиции которых нужно запомнить
	 */
	snapshot(cards: Iterable<HTMLElement>): this {
		this.#calculator.before(cards);
		return this;
	}

	/**
	 * Строит {@link AnimationRunner} с анимациями движения для всех сдвинувшихся карточек.
	 * Вызывать после изменения DOM.
	 * @param cards - Те же карточки, что и в `snapshot()`
	 */
	buildMoveAnimation(cards: Iterable<HTMLElement>): AnimationRunner {
		const trajectories = this.#calculator.calculate(cards);
		const runner = new AnimationRunner();

		trajectories.forEach((trajectory, index) => {
			runner.add(
				new CardMoveAnimation(trajectory.element, trajectory, {
					...this.#config,
					delay: index * this.#config.stagger,
				})
			);
		});

		return runner;
	}
}
