import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, ReactNode } from 'react';
import Purchases, { CustomerInfo, PurchasesPackage, LOG_LEVEL } from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';
import { RevenueCatConfig } from '../constants/RevenueCat';
import { Platform } from 'react-native';

interface RevenueCatContextType {
    customerInfo: CustomerInfo | null;
    isPro: boolean;
    isLoading: boolean;
    purchasePackage: (pack: PurchasesPackage) => Promise<void>;
    restorePurchases: () => Promise<CustomerInfo | null>;
    presentPaywall: () => Promise<boolean>;
    presentCustomerCenter: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export const useRevenueCat = () => {
    const context = useContext(RevenueCatContext);
    if (!context) {
        throw new Error('useRevenueCat must be used within a RevenueCatProvider');
    }
    return context;
};

interface RevenueCatProviderProps {
    children: ReactNode;
}

export const RevenueCatProvider: React.FC<RevenueCatProviderProps> = ({ children }) => {
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const prevEntitlementKeysRef = useRef<string>('');

    const isPro = useMemo(() => {
        if (!customerInfo || !customerInfo.entitlements) {
            return false;
        }

        const activeEntitlements = customerInfo.entitlements.active || {};
        const activeIds = Object.keys(activeEntitlements);

        // 1. Check primary ID
        let hasEntitlement = activeEntitlements[RevenueCatConfig.entitlementId] !== undefined;

        // 2. Check alternative IDs
        if (!hasEntitlement && RevenueCatConfig.alternativeIds) {
            hasEntitlement = RevenueCatConfig.alternativeIds.some(id => activeEntitlements[id] !== undefined);
        }

        // 3. Fallback: If they have ANY active subscription but entitlement mapping is broken,
        // we might want to allow access anyway during debugging/soft launch.
        const hasAnyActiveSub = (customerInfo.activeSubscriptions || []).length > 0;

        return hasEntitlement || activeIds.length > 0 || hasAnyActiveSub;
    }, [customerInfo]);

    const smartSetCustomerInfo = useCallback((info: CustomerInfo) => {
        try {
            if (!info || !info.entitlements) return;

            // Deep-ish check: check active entitlement keys and expiration dates if available
            // This prevents the re-render loop when RevenueCat spams progress updates
            const newKeys = Object.keys(info.entitlements.active || {}).sort().join(',');
            const expirationDates = Object.values(info.entitlements.active || {})
                .map(e => e.expirationDate)
                .sort()
                .join(',');

            const stateString = `${newKeys}|${expirationDates}`;

            setCustomerInfo(prev => {
                const prevKeys = Object.keys(prev?.entitlements?.active || {}).sort().join(',');
                const prevExp = Object.values(prev?.entitlements?.active || {})
                    .map(e => e.expirationDate)
                    .sort()
                    .join(',');
                const prevStateString = `${prevKeys}|${prevExp}`;

                if (stateString !== prevStateString || !prev) {
                    prevEntitlementKeysRef.current = newKeys;
                    return info;
                }
                return prev;
            });
        } catch (e) {
            console.error('Error in smartSetCustomerInfo:', e);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                if (Platform.OS === 'android' || Platform.OS === 'ios') {
                    Purchases.setLogLevel(LOG_LEVEL.WARN);
                    const isConfigured = await Purchases.isConfigured();
                    if (!isConfigured) {
                        try {
                            Purchases.configure({ apiKey: RevenueCatConfig.apiKey });
                        } catch (confError) {
                            console.error('RevenueCat configure error:', confError);
                        }
                    }

                    const info = await Purchases.getCustomerInfo();
                    if (info) {
                        console.log('[RevenueCat] Initial CustomerInfo loaded, active:', Object.keys(info.entitlements.active || {}).join(',') || 'none');
                        prevEntitlementKeysRef.current = Object.keys(info.entitlements.active || {}).sort().join(',');
                        setCustomerInfo(info);
                    }
                }
            } catch (e) {
                console.error('RevenueCat init error:', e);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(init, 500); // Slight delay to ensure bridge is ready

        const updateListener = (info: CustomerInfo) => {
            smartSetCustomerInfo(info);
        };

        try {
            Purchases.addCustomerInfoUpdateListener(updateListener);
        } catch (le) {
            console.error('Failed to add RevenueCat listener:', le);
        }

        return () => {
            clearTimeout(timer);
            try {
                Purchases.removeCustomerInfoUpdateListener(updateListener);
            } catch (le) {
                console.error('Failed to remove RevenueCat listener:', le);
            }
        };
    }, [smartSetCustomerInfo]);

    const purchasePackage = useCallback(async (pack: PurchasesPackage) => {
        try {
            const { customerInfo: info } = await Purchases.purchasePackage(pack);
            if (info && info.entitlements && info.entitlements.active) {
                prevEntitlementKeysRef.current = Object.keys(info.entitlements.active).sort().join(',');
                setCustomerInfo(info);
            }
        } catch (e: any) {
            console.error('Purchase error:', e);
            throw e;
        }
    }, []);

    const restorePurchases = useCallback(async () => {
        try {
            const info = await Purchases.restorePurchases();
            if (info && info.entitlements && info.entitlements.active) {
                prevEntitlementKeysRef.current = Object.keys(info.entitlements.active).sort().join(',');
                setCustomerInfo(info);
            }
            return info;
        } catch (e) {
            console.error('Restore error:', e);
            return null;
        }
    }, []);

    const presentPaywall = useCallback(async (): Promise<boolean> => {
        try {
            await RevenueCatUI.presentPaywall();
        } catch (e) {
            console.error('Paywall presentation error:', e);
        }

        try {
            const info = await Purchases.getCustomerInfo();
            if (info && info.entitlements && info.entitlements.active) {
                prevEntitlementKeysRef.current = Object.keys(info.entitlements.active).sort().join(',');
                setCustomerInfo(info);
                return Object.keys(info.entitlements.active).length > 0;
            }
            return false;
        } catch (e) {
            console.error('Error refreshing customer info after paywall:', e);
            return false;
        }
    }, []);

    const presentCustomerCenter = useCallback(async () => {
        try {
            await RevenueCatUI.presentCustomerCenter();
        } catch (e) {
            console.error('Customer Center not supported or error:', e);
        }
    }, []);

    const contextValue = useMemo(() => ({
        customerInfo,
        isPro,
        isLoading,
        purchasePackage,
        restorePurchases,
        presentPaywall,
        presentCustomerCenter,
    }), [customerInfo, isPro, isLoading, purchasePackage, restorePurchases, presentPaywall, presentCustomerCenter]);

    return (
        <RevenueCatContext.Provider value={contextValue}>
            {children}
        </RevenueCatContext.Provider>
    );
};
