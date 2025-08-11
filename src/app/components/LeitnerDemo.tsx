import { selectCardsForExamination, getDictionaryStats } from "@/lib/leitner";
import { Card } from "../page";

export default function LeitnerDemo() {
    // Example dictionary with different priority cards
    const exampleDictionary: Card[] = [
        { front: "apple", back: "яблоко", priority: 1 },
        { front: "banana", back: "банан", priority: 1 },
        { front: "cat", back: "кот", priority: 2 },
        { front: "dog", back: "собака", priority: 2 },
        { front: "elephant", back: "слон", priority: 3 },
        { front: "fish", back: "рыба", priority: 3 },
        { front: "giraffe", back: "жираф", priority: 4 },
        { front: "house", back: "дом", priority: 4 },
        { front: "ice", back: "лед", priority: 5 },
        { front: "jacket", back: "куртка", priority: 5 },
    ];

    const stats = getDictionaryStats(exampleDictionary);

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Leitner System Demo</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* System Explanation */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">How It Works</h3>
                    <div className="space-y-2 text-sm">
                        <p>• <strong>Priority 1:</strong> Cards appear in every examination</p>
                        <p>• <strong>Priority 2:</strong> Cards appear every 2nd examination</p>
                        <p>• <strong>Priority 3:</strong> Cards appear every 3rd examination</p>
                        <p>• <strong>Priority 4:</strong> Cards appear every 4th examination</p>
                        <p>• <strong>Priority 5:</strong> Cards appear every 5th examination</p>
                    </div>
                    
                    <div className="bg-blue-500/20 p-3 rounded border border-blue-400/30">
                        <p className="text-sm">
                            <strong>Remember:</strong> If you remember a card, its priority increases (less frequent). 
                            If you forget, priority decreases (more frequent).
                        </p>
                    </div>
                </div>

                {/* Example Cards */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Example Cards</h3>
                    <div className="space-y-2">
                        {exampleDictionary.map((card, index) => (
                            <div 
                                key={index}
                                className="bg-white/5 p-3 rounded border border-white/20"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{card.front} → {card.back}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        card.priority === 1 ? 'bg-red-500/30 text-red-200' :
                                        card.priority === 2 ? 'bg-orange-500/30 text-orange-200' :
                                        card.priority === 3 ? 'bg-yellow-500/30 text-yellow-200' :
                                        card.priority === 4 ? 'bg-blue-500/30 text-blue-200' :
                                        'bg-purple-500/30 text-purple-200'
                                    }`}>
                                        Priority {card.priority}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Examination Simulation */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Examination Simulation</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((examNumber) => {
                        const selectedCards = selectCardsForExamination(exampleDictionary, examNumber);
                        
                        return (
                            <div key={examNumber} className="bg-white/5 p-3 rounded border border-white/20">
                                <h4 className="font-medium text-center mb-2">Exam #{examNumber}</h4>
                                <div className="text-xs space-y-1">
                                    {selectedCards.map((card, index) => (
                                        <div key={index} className="text-gray-300">
                                            {card.front}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-400 text-center mt-2">
                                    {selectedCards.length} cards
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Statistics */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Current Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(stats.byPriority).map(([priority, count]) => (
                        <div key={priority} className="bg-white/5 p-3 rounded border border-white/20 text-center">
                            <div className="text-lg font-bold">{count}</div>
                            <div className="text-xs text-gray-400">Priority {priority}</div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4 text-gray-300">
                    Total cards: {stats.total}
                </div>
            </div>
        </div>
    );
}
