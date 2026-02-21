import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, ReactNode } from 'react';
import { InteractionManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { CustomerInfo, PurchasesPackage, LOG_LEVEL } from 'react-native-purchases';
import { RevenueCatConfig } from '../constants/RevenueCat';

const IS_PRO_CACHE_KEY = 'rc_is_pro_cached';

interface RevenueCatContextType {
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

function computeIsPro(info: CustomerInfo | null): boolean {
    if (!info?.entitlements) return false;

    const activeEntitlements = info.entitlements.active || {};
    const activeIds = Object.keys(activeEntitlements);

    let hasEntitlement = activeEntitlements[RevenueCatConfig.entitlementId] !== undefined;

    if (!hasEntitlement && RevenueCatConfig.alternativeIds) {
        hasEntitlement = RevenueCatConfig.alternativeIds.some(id => activeEntitlements[id] !== undefined);
    }

    const hasAnyActiveSub = (info.activeSubscriptions || []).length > 0;

    return hasEntitlement || activeIds.length > 0 || hasAnyActiveSub;
}

async function ensureConfigured(): Promise<boolean> {
    try {
        if (Platform.OS !== 'android' && Platform.OS !== 'ios') return false;
        const isConfigured = await Purchases.isConfigured();
        if (!isConfigured) {
            Purchases.configure({ apiKey: RevenueCatConfig.apiKey });
        }
        return true;
    } catch (e) {
        console.error('RevenueCat configure error:', e);
        return false;
    }
}

export const RevenueCatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPro, setIsPro] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const configuredRef = useRef(false);

    const updateIsPro = useCallback((newPro: boolean) => {
        setIsPro(prev => {
            if (prev === newPro) return prev;
            AsyncStorage.setItem(IS_PRO_CACHE_KEY, JSON.stringify(newPro)).catch(() => {});
            return newPro;
        });
    }, []);

    useEffect(() => {
        let cancelled = false;
        let listenerAdded = false;

        const updateListener = (info: CustomerInfo) => {
            if (!cancelled) updateIsPro(computeIsPro(info));
        };

        const loadCachedState = async () => {
            try {
                const cached = await AsyncStorage.getItem(IS_PRO_CACHE_KEY);
                if (cached !== null && !cancelled) {
                    updateIsPro(JSON.parse(cached));
                }
            } catch (_) {}
            if (!cancelled) setIsLoading(false);
        };

        const initRC = async () => {
            try {
                Purchases.setLogLevel(LOG_LEVEL.ERROR);
                const ok = await ensureConfigured();
                if (!ok || cancelled) return;
                configuredRef.current = true;

                const info = await Purchases.getCustomerInfo();
                if (info && !cancelled) {
                    updateIsPro(computeIsPro(info));
                }

                try {
                    Purchases.addCustomerInfoUpdateListener(updateListener);
                    listenerAdded = true;
                } catch (_) {}
            } catch (e) {
                console.error('RevenueCat init error:', e);
            }
        };

        loadCachedState();

        const handle = InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
                if (!cancelled) initRC();
            }, 5000);
        });

        return () => {
            cancelled = true;
            handle.cancel();
            if (listenerAdded) {
                try { Purchases.removeCustomerInfoUpdateListener(updateListener); } catch (_) {}
            }
        };
    }, [updateIsPro]);

    const purchasePackage = useCallback(async (pack: PurchasesPackage) => {
        if (!configuredRef.current) await ensureConfigured();
        try {
            const { customerInfo: info } = await Purchases.purchasePackage(pack);
            if (info) updateIsPro(computeIsPro(info));
        } catch (e: any) {
            console.error('Purchase error:', e);
            throw e;
        }
    }, [updateIsPro]);

    const restorePurchases = useCallback(async () => {
        if (!configuredRef.current) await ensureConfigured();
        try {
            const info = await Purchases.restorePurchases();
            if (info) updateIsPro(computeIsPro(info));
            return info;
        } catch (e) {
            console.error('Restore error:', e);
            return null;
        }
    }, [updateIsPro]);

    const presentPaywall = useCallback(async (): Promise<boolean> => {
        if (!configuredRef.current) await ensureConfigured();
        try {
            const RCUI = require('react-native-purchases-ui').default;
            await RCUI.presentPaywall();
        } catch (e) {
            console.error('Paywall presentation error:', e);
        }

        try {
            const info = await Purchases.getCustomerInfo();
            if (info) {
                const pro = computeIsPro(info);
                updateIsPro(pro);
                return pro;
            }
            return false;
        } catch (e) {
            console.error('Error refreshing customer info after paywall:', e);
            return false;
        }
    }, [updateIsPro]);

    const presentCustomerCenter = useCallback(async () => {
        if (!configuredRef.current) await ensureConfigured();
        try {
            const RCUI = require('react-native-purchases-ui').default;
            await RCUI.presentCustomerCenter();
        } catch (e) {
            console.error('Customer Center error:', e);
        }
    }, []);

    const contextValue = useMemo(() => ({
        isPro,
        isLoading,
        purchasePackage,
        restorePurchases,
        presentPaywall,
        presentCustomerCenter,
    }), [isPro, isLoading, purchasePackage, restorePurchases, presentPaywall, presentCustomerCenter]);

    return (
        <RevenueCatContext.Provider value={contextValue}>
            {children}
        </RevenueCatContext.Provider>
    );
};
