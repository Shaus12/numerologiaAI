import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
    presentPaywall: () => Promise<void>;
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

    const isPro = customerInfo?.entitlements.active[RevenueCatConfig.entitlementId] !== undefined;

    useEffect(() => {
        const init = async () => {
            try {
                if (Platform.OS === 'android' || Platform.OS === 'ios') {
                    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
                    Purchases.configure({ apiKey: RevenueCatConfig.apiKey });

                    const info = await Purchases.getCustomerInfo();
                    setCustomerInfo(info);
                }
            } catch (e) {
                console.error('RevenueCat init error:', e);
            } finally {
                setIsLoading(false);
            }
        };

        init();

        const updateListener = (info: CustomerInfo) => {
            setCustomerInfo(info);
        };

        Purchases.addCustomerInfoUpdateListener(updateListener);

        return () => {
            Purchases.removeCustomerInfoUpdateListener(updateListener);
        };
    }, []);

    const purchasePackage = async (pack: PurchasesPackage) => {
        try {
            const { customerInfo } = await Purchases.purchasePackage(pack);
            setCustomerInfo(customerInfo);
        } catch (e: any) {
            if (!e.userCancelled) {
                console.error('Purchase error:', e);
                throw e;
            }
        }
    };

    const restorePurchases = async () => {
        try {
            const info = await Purchases.restorePurchases();
            setCustomerInfo(info);
            return info;
        } catch (e) {
            console.error('Restore error:', e);
            return null;
        }
    };

    const presentPaywall = async () => {
        try {
            // Using RevenueCatUI to present the paywall as a modal
            // This leverages the native-like experience provided by the UI library
            const result = await RevenueCatUI.presentPaywallIfNeeded({
                requiredEntitlementIdentifier: RevenueCatConfig.entitlementId
            });

            switch (result) {
                case RevenueCatUI.PAYWALL_RESULT.PURCHASED:
                case RevenueCatUI.PAYWALL_RESULT.RESTORED:
                    // Refresh customer info just in case, though the listener should catch it
                    const info = await Purchases.getCustomerInfo();
                    setCustomerInfo(info);
                    break;
                case RevenueCatUI.PAYWALL_RESULT.CANCELLED:
                    // User closed paywall
                    break;
                default:
                    break;
            }

        } catch (e) {
            console.error('Paywall presentation error:', e);
        }
    };

    const presentCustomerCenter = async () => {
        try {
            if (Platform.OS === 'ios') {
                // Customer Center is currently iOS only in some versions of the SDK, 
                // but checking docs, react-native-purchases-ui supports it if available.
                // If not available, we can fallback to managing subscription via linking.
                await RevenueCatUI.presentCustomerCenter();
            } else {
                // Fallback for Android or if Customer Center isn't fully supported yet on Android in this version
                // RevenueCatUI might handle this gracefully or we might need to link to Play Store.
                // For now, let's try the UI method.
                await RevenueCatUI.presentCustomerCenter();
            }
        } catch (e) {
            console.error("Customer Center not supported or error:", e);
        }
    };

    return (
        <RevenueCatContext.Provider
            value={{
                customerInfo,
                isPro,
                isLoading,
                purchasePackage,
                restorePurchases,
                presentPaywall,
                presentCustomerCenter,
            }}
        >
            {children}
        </RevenueCatContext.Provider>
    );
};
