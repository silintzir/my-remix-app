import { noop } from "lodash-es";
import useDeepCompareEffect from "use-deep-compare-effect";

export const useDeepCompare = typeof window === 'undefined' ? noop : useDeepCompareEffect;

