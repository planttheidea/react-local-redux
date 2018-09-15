// external dependencies
import {shallowEqual} from 'fast-equals';

// utils
import {getMergedProps} from './utils';

/**
 * @constant {Object} DEFAULT_OPTIONS
 */
export const DEFAULT_OPTIONS = {
  areMergedPropsEqual: shallowEqual,
  areOwnPropsEqual: shallowEqual,
  areStatesEqual: shallowEqual,
  mergeProps: getMergedProps,
  pure: true,
};
