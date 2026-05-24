import { useRef, useState, useCallback } from 'react';
import { AnimationBuilder } from '../../core/src';
import type { CardAnimationHookOptions, UseCardAnimationReturn } from '../types';

export function useCardAnimation(options: CardAnimationHookOptions = {}): UseCardAnimationReturn {
	const builderRef = useRef(new AnimationBuilder());
	const [isAnimating, setIsAnimating] = useState(false);

	if (options.duration !== undefined) builderRef.current.withDuration(options.duration);
	if (options.easing !== undefined) builderRef.current.withEasing(options.easing);
	if (options.stagger !== undefined) builderRef.current.withStagger(options.stagger);

	const snapshot = useCallback((cards: Iterable<HTMLElement>): void => {
		console.debug('[react/useCardAnimation] snapshot called');
		builderRef.current.snapshot(cards);
	}, []);

	const animateMove = useCallback(async (cards: Iterable<HTMLElement>): Promise<void> => {
		console.debug('[react/animateMove] start');
		setIsAnimating(true);
		try {
			await builderRef.current.buildAnimation(cards).play();
			console.debug('[react/animateMove] complete');
		} finally {
			setIsAnimating(false);
		}
	}, []);

	return { snapshot, animateMove, isAnimating };
}
