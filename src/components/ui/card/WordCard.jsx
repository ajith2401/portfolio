// src/components/ui/WordCard.jsx
import { Star } from 'lucide-react';

const WordCard = ({ author, content, rating = 5, date }) => (
  <div className="p-4 sm:p-6 rounded-lg bg-[#1A1A1A] hover:bg-[#242424] transition-colors">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
    <p className="text-xs sm:text-sm text-gray-300 mb-4">{content}</p>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
      <p className="text-xs sm:text-sm text-gray-400">{author}</p>
      {date && <p className="text-xs text-gray-500">{date}</p>}
    </div>
  </div>
);

export default WordCard;