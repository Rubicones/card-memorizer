
# Memento – Memorize things the most pure way

Memento is the minimal flashcard app that utilizes the Leitner spaced-repetition system. Create cards and 
review them to memorize faster. Nothing will disturb you from the main point.

## How the Leitner system works here

- You study in short "examinations" numbered 1, 2, 3, ...
- Every card has a level from 1 to 5. Higher level means you see the card less often.
- For each examination:
  - Priority 1 cards are always included.
  - Priority N cards are included when `examination % N === 0` (every N‑th exam).
- When you mark a card as remembered, its priority increases by 1 (up to 5). When you forget a card, it drops back to priority 1. This keeps difficult cards in frequent rotation and moves mastered cards to rarer reviews.


## How to use it:

<img width="1280" height="832" alt="Step 1" src="https://github.com/user-attachments/assets/20f364bb-02e3-448b-9ba1-d7a6fc63533a" />
<img width="1280" height="832" alt="Step 2" src="https://github.com/user-attachments/assets/3e5e65d2-4beb-41f0-9fb1-1ac3091f952f" />
<img width="1280" height="832" alt="Step 3" src="https://github.com/user-attachments/assets/28428693-ddf0-40f0-a537-636d52e1d4c1" />
<img width="1280" height="832" alt="Step 4" src="https://github.com/user-attachments/assets/6ce66ae0-f979-490c-aa86-d42ea4a01632" />
<img width="1280" height="832" alt="Step 5" src="https://github.com/user-attachments/assets/41d8a744-c038-4e41-86e7-a028986a8ce2" />
