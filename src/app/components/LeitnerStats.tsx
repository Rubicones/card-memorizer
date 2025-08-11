import { getDictionaryStats } from "@/lib/leitner";
import { Card } from "../page";

interface LeitnerStatsProps {
    dictionary: Card[];
    repeatCount: number;
}

export default function LeitnerStats({ dictionary, repeatCount }: LeitnerStatsProps) {
    const stats = getDictionaryStats(dictionary);
    
    const getPriorityDescription = (priority: number) => {
        switch (priority) {
            case 1: return "Every examination";
            case 2: return "Every 2nd examination";
            case 3: return "Every 3rd examination";
            case 4: return "Every 4th examination";
            case 5: return "Every 5th examination";
            default: return "Unknown";
        }
    };
    
    const willAppearInCurrentExam = (priority: number) => {
        if (priority === 1) return true;
        return repeatCount % priority === 0;
    };

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
            <h3 className="text-lg font-semibold mb-3">Leitner System Stats</h3>
            
            <div className="space-y-3">
                <div className="text-sm text-gray-300">
                    Current examination: #{repeatCount}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(stats.byPriority).map(([priority, count]) => {
                        const priorityNum = parseInt(priority);
                        const willAppear = willAppearInCurrentExam(priorityNum);
                        
                        return (
                            <div 
                                key={priority} 
                                className={`p-2 rounded ${
                                    willAppear 
                                        ? 'bg-green-500/20 border border-green-400/30' 
                                        : 'bg-gray-500/20 border border-gray-400/30'
                                }`}
                            >
                                <div className="font-medium">
                                    Priority {priority}: {count} cards
                                </div>
                                <div className="text-xs text-gray-400">
                                    {getPriorityDescription(priorityNum)}
                                </div>
                                <div className={`text-xs ${willAppear ? 'text-green-400' : 'text-gray-500'}`}>
                                    {willAppear ? 'Will appear' : 'Won\'t appear'}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="text-sm text-gray-300 pt-2 border-t border-white/20">
                    Total cards: {stats.total}
                </div>
            </div>
        </div>
    );
}
