import { useSelector as $useSelector } from 'react-redux';
import { IRootState } from '../store';

export function useSelector<T>(
    fn: (state: IRootState) => T,
    equalityFn?: (left: T, right: T) => boolean,
) {
    return $useSelector<IRootState, T>(fn, equalityFn);
}
