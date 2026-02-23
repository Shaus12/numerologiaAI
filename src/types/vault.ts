export type RelationshipType = 'Romantic' | 'Colleague' | 'Family' | 'Friend';

/** Structured compatibility result from AI (getConnectionCompatibility). */
export interface ConnectionCompatibility {
    score: number;
    title: string;
    strengths: string[];
    challenges: string[];
    summary: string;
}

export interface SavedConnection {
    id: string;
    name: string;
    birthdate: string;
    relationshipType: RelationshipType;
    cachedReading?: string;
}
