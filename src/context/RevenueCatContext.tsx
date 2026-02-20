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

    const isPro = customerInfo?.entitlements.active[RevenueCatConfig.entitlementId] !== undefined ||
        Object.keys(customerInfo?.entitlements.active || {}).length > 0;

    useEffect(() => {
        const init = async () => {
            try {
                if (Platform.OS === 'android' || Platform.OS === 'ios') {
                    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
                    const isConfigured = await Purchases.isConfigured();
                    if (!isConfigured) {
                        Purchases.configure({ apiKey: RevenueCatConfig.apiKey });
                    }

                    const info = await Purchases.getCustomerInfo();
                    console.log('RevenueCat Init - CustomerInfo:', JSON.stringify(info, null, 2));
                    console.log('RevenueCat Init - Active Entitlements:', info.entitlements.active);
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
            console.log('RevenueCat Update Listener - Info:', JSON.stringify(info, null, 2));
            console.log('RevenueCat Update Listener - IsPro:', info.entitlements.active[RevenueCatConfig.entitlementId] !== undefined);
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
            console.log('Purchase Successful - CustomerInfo:', JSON.stringify(customerInfo, null, 2));
            setCustomerInfo(customerInfo);
        } catch (e: any) {
            console.error('Purchase error:', e);
            throw e;
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

    const presentPaywall = async (): Promise<boolean> => {
        try {
            const result = await RevenueCatUI.presentPaywallIfNeeded({
                requiredEntitlementIdentifier: RevenueCatConfig.entitlementId,
            });

            const success =
                result === RevenueCatUI.PAYWALL_RESULT.PURCHASED ||
                result === RevenueCatUI.PAYWALL_RESULT.RESTORED ||
                result === RevenueCatUI.PAYWALL_RESULT.NOT_PRESENTED; // NOT_PRESENTED = already subscribed

            if (success) {
                // Immediately refresh and update global state
                const info = await Purchases.getCustomerInfo();
                setCustomerInfo(info);
            }
            return success;
        } catch (e) {
            console.error('Paywall presentation error:', e);
            return false;
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
