import { Card } from "@/app/page";

export interface LeitnerCard extends Card {
    priority: number; // 1-5, where 1 is most frequent, 5 is least frequent
}

export interface LeitnerDictionary {
    dictionary: LeitnerCard[];
    repeatCount: number;
}

/**
 * Implements the Leitner system for spaced repetition
 * Priority 1: appears every examination
 * Priority 2: appears every 2nd examination
 * Priority 3: appears every 3rd examination
 * Priority 4: appears every 4th examination
 * Priority 5: appears every 5th examination
 */
export function selectCardsForExamination(
    dictionary: LeitnerCard[],
    repeatCount: number
): LeitnerCard[] {
    if (dictionary.length === 0) {
        return [];
    }

    // Calculate which cards should appear in this examination
    const selectedCards: LeitnerCard[] = [];
    
    // Priority 1 cards always appear
    const priority1Cards = dictionary.filter(card => card.priority === 1);
    selectedCards.push(...priority1Cards);
    
    // Higher priority cards appear based on repeatCount
    for (let priority = 2; priority <= 5; priority++) {
        if (repeatCount % priority === 0) {
            const priorityCards = dictionary.filter(card => card.priority === priority);
            selectedCards.push(...priorityCards);
        }
    }
    
    // Ensure at least 1 card is selected
    if (selectedCards.length === 0) {
        // If no cards were selected by the algorithm, select the first card
        selectedCards.push(dictionary[0]);
    }
    
    // Shuffle the selected cards for better learning experience
    return shuffleArray(selectedCards);
}

/**
 * Updates card priority based on whether it was remembered or not
 * @param card - The card to update
 * @param wasRemembered - Whether the card was correctly remembered
 * @returns Updated card with new priority
 */
export function updateCardPriority(
    card: LeitnerCard,
    wasRemembered: boolean
): LeitnerCard {
    let newPriority: number;
    
    if (wasRemembered) {
        // If remembered, increase priority (less frequent)
        newPriority = Math.min(card.priority + 1, 5);
    } else {
        // If forgotten, decrease priority (more frequent)
        newPriority = Math.max(card.priority - 1, 1);
    }
    
    return {
        ...card,
        priority: newPriority
    };
}

/**
 * Fisher-Yates shuffle algorithm to randomize card order
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Calculates the next repeatCount value
 * This ensures we cycle through all priority levels
 */
export function calculateNextRepeatCount(currentRepeatCount: number): number {
    // Increment repeatCount to cycle through different priority combinations
    return currentRepeatCount + 1;
}

/**
 * Gets statistics about the dictionary for display purposes
 */
export function getDictionaryStats(dictionary: LeitnerCard[]) {
    const stats = {
        total: dictionary.length,
        byPriority: {
            1: 0, // Every examination
            2: 0, // Every 2nd examination
            3: 0, // Every 3rd examination
            4: 0, // Every 4th examination
            5: 0  // Every 5th examination
        }
    };
    
    dictionary.forEach(card => {
        if (card.priority >= 1 && card.priority <= 5) {
            stats.byPriority[card.priority as keyof typeof stats.byPriority]++;
        }
    });
    
    return stats;
}
