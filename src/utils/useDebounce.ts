/**
 * https://github.com/facebook/lexical/blob/dcff8ae5afb7c0c2f4c157d209f3a1f2f108fe73/packages/lexical-playground/src/plugins/CodeActionMenuPlugin/utils.ts#L11-L32
 * Unfortunately, it's not exported by lexical.
 */
import { debounce } from 'lodash-es';
import { useMemo, useRef } from 'react';

export function useDebounce<T extends (...args: never[]) => void>(
	fn: T,
	ms: number,
	maxWait?: number
) {
	const funcRef = useRef<T | null>(null);
	funcRef.current = fn;

	return useMemo(
		() =>
			debounce(
				(...args: Parameters<T>) => {
					if (funcRef.current) {
						funcRef.current(...args);
					}
				},
				ms,
				{ maxWait }
			),
		[ms, maxWait]
	);
}
