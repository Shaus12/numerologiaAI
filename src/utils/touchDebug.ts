/**
 * Minimal touch instrumentation for debugging interaction issues.
 * Only logs in __DEV__ mode.
 */
export const touchDebug = (label: string, data?: any) => {
    if (__DEV__) {
        console.log(`[TouchDebug] ${label}`, data ? data : '');
    }
};
