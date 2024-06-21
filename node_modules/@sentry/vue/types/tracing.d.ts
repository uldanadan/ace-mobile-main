import type { Transaction } from '@sentry/types';
import type { Hook, TracingOptions } from './types';
/** Grabs active transaction off scope, if any */
export declare function getActiveTransaction(): Transaction | undefined;
export declare const createTracingMixins: (options: TracingOptions) => Partial<Record<Hook, any>>;
//# sourceMappingURL=tracing.d.ts.map