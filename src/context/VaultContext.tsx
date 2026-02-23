import React, { createContext, useState, useEffect, useContext, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedConnection } from '../types/vault';

const VAULT_STORAGE_KEY = 'vault_connections';

interface VaultContextType {
    connections: SavedConnection[];
    isLoading: boolean;
    addConnection: (connection: Omit<SavedConnection, 'id'>) => Promise<void>;
    removeConnection: (id: string) => Promise<void>;
    updateConnection: (id: string, partial: Partial<SavedConnection>) => Promise<void>;
    getConnectionById: (id: string) => SavedConnection | undefined;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const useVault = () => {
    const context = useContext(VaultContext);
    if (!context) {
        throw new Error('useVault must be used within a VaultProvider');
    }
    return context;
};

interface VaultProviderProps {
    children: ReactNode;
}

export const VaultProvider: React.FC<VaultProviderProps> = ({ children }) => {
    const [connections, setConnections] = useState<SavedConnection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const raw = await AsyncStorage.getItem(VAULT_STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        setConnections(parsed);
                    }
                }
            } catch (e) {
                console.error('Vault load error:', e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const persist = useCallback(async (next: SavedConnection[]) => {
        setConnections(next);
        await AsyncStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(next));
    }, []);

    const addConnection = useCallback(async (input: Omit<SavedConnection, 'id'>) => {
        const id = `vault_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const connection: SavedConnection = { ...input, id };
        const next = [...connections, connection];
        await persist(next);
    }, [connections, persist]);

    const removeConnection = useCallback(async (id: string) => {
        const next = connections.filter((c) => c.id !== id);
        await persist(next);
    }, [connections, persist]);

    const updateConnection = useCallback(async (id: string, partial: Partial<SavedConnection>) => {
        const next = connections.map((c) => (c.id === id ? { ...c, ...partial } : c));
        await persist(next);
    }, [connections, persist]);

    const getConnectionById = useCallback((id: string) => connections.find((c) => c.id === id), [connections]);

    const value = useMemo(() => ({
        connections,
        isLoading,
        addConnection,
        removeConnection,
        updateConnection,
        getConnectionById,
    }), [connections, isLoading, addConnection, removeConnection, updateConnection, getConnectionById]);

    return (
        <VaultContext.Provider value={value}>
            {children}
        </VaultContext.Provider>
    );
};
