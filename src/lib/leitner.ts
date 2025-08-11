import { Card } from "@/app/page";

export interface LeitnerCard extends Card {
    priority: number;
}

export interface LeitnerDictionary {
    dictionary: LeitnerCard[];
    repeatCount: number;
}


export function selectCardsForExamination(
    dictionary: LeitnerCard[],
    repeatCount: number
): LeitnerCard[] {
    if (dictionary.length === 0) {
        return [];
    }

    const selectedCards: LeitnerCard[] = [];
    
    const priority1Cards = dictionary.filter(card => card.priority === 1);
    selectedCards.push(...priority1Cards);
    
    for (let priority = 2; priority <= 5; priority++) {
        if (repeatCount % priority === 0) {
            const priorityCards = dictionary.filter(card => card.priority === priority);
            selectedCards.push(...priorityCards);
        }
    }
    
    if (selectedCards.length === 0) {
        selectedCards.push(dictionary[0]);
    }
    
    return shuffleArray(selectedCards);
}


export function updateCardPriority(
    card: LeitnerCard,
    wasRemembered: boolean
): LeitnerCard {
    let newPriority: number;
    
    if (wasRemembered) {
        newPriority = Math.min(card.priority + 1, 5);
    } else {
        newPriority = 1;
    }
    
    return {
        ...card,
        priority: newPriority
    };
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function calculateNextRepeatCount(currentRepeatCount: number): number {
    return currentRepeatCount + 1;
}

export function getDictionaryStats(dictionary: LeitnerCard[]) {
    const stats = {
        total: dictionary.length,
        byPriority: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    };
    
    dictionary.forEach(card => {
        if (card.priority >= 1 && card.priority <= 5) {
            stats.byPriority[card.priority as keyof typeof stats.byPriority]++;
        }
    });
    
    return stats;
}
