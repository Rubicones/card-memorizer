# Leitner System Implementation

This document explains how the Leitner spaced repetition system is implemented in the Memento app.

## Overview

The Leitner system is a method of efficiently using flashcards that was proposed by the German science journalist Sebastian Leitner in the 1970s. It's a simple implementation of spaced repetition, where cards are reviewed at increasing intervals.

## How It Works

### Priority Levels (Boxes)

Each card has a priority level from 1 to 5:

- **Priority 1**: Cards appear in every examination
- **Priority 2**: Cards appear every 2nd examination  
- **Priority 3**: Cards appear every 3rd examination
- **Priority 4**: Cards appear every 4th examination
- **Priority 5**: Cards appear every 5th examination

### Card Selection Algorithm

The system uses the `selectCardsForExamination()` function to determine which cards should appear in a given examination:

```typescript
export function selectCardsForExamination(
    dictionary: LeitnerCard[],
    repeatCount: number
): LeitnerCard[] {
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
        selectedCards.push(dictionary[0]);
    }
    
    return shuffleArray(selectedCards);
}
```

### Priority Updates

After each examination, card priorities are updated based on performance:

- **If remembered correctly**: Priority increases by 1 (up to maximum of 5)
- **If forgotten**: Priority decreases by 1 (down to minimum of 1)

```typescript
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
```

## Example Examination Schedule

| Examination # | Priority 1 | Priority 2 | Priority 3 | Priority 4 | Priority 5 |
|---------------|------------|------------|------------|------------|------------|
| 1             | ✅         | ✅         | ✅         | ✅         | ✅         |
| 2             | ✅         | ❌         | ❌         | ✅         | ❌         |
| 3             | ✅         | ❌         | ✅         | ❌         | ❌         |
| 4             | ✅         | ✅         | ❌         | ❌         | ✅         |
| 5             | ✅         | ❌         | ❌         | ❌         | ❌         |
| 6             | ✅         | ✅         | ✅         | ❌         | ❌         |

## Implementation Details

### Core Functions

1. **`selectCardsForExamination()`**: Selects which cards appear in a given examination
2. **`updateCardPriority()`**: Updates card priority based on performance
3. **`calculateNextRepeatCount()`**: Increments the repeat count for the next examination
4. **`getDictionaryStats()`**: Provides statistics about the dictionary

### Data Flow

1. User starts an examination
2. System calls `selectCardsForExamination()` with current dictionary and repeatCount
3. Selected cards are presented to the user
4. After each card, `updateCardPriority()` is called based on user performance
5. When examination ends, `calculateNextRepeatCount()` determines the next repeatCount
6. Updated dictionary and repeatCount are saved

### Guarantees

- **Minimum cards**: Each examination will have at least 1 card
- **Frequency-based**: Card appearance frequency is directly tied to priority level
- **Progressive learning**: Well-known cards appear less frequently
- **Reinforcement**: Forgotten cards return to more frequent review

## Benefits

1. **Efficient learning**: Cards are reviewed at optimal intervals
2. **Adaptive**: System automatically adjusts to individual performance
3. **Predictable**: Users can see which cards will appear in upcoming examinations
4. **Scalable**: Works with dictionaries of any size

## Usage

The system is automatically integrated into the recall page. Users can:

- View current Leitner statistics via the `LeitnerStats` component
- See which cards will appear in the current examination
- Understand how their performance affects future card frequency

## Future Enhancements

Potential improvements could include:

- Customizable priority levels (beyond 5)
- Performance analytics and insights
- Adaptive intervals based on learning patterns
- Integration with other spaced repetition algorithms
