
import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, interactive = false }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (star: number, e: React.MouseEvent) => {
    if (!interactive || !onRatingChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const value = x < rect.width / 2 ? star - 0.5 : star;
    onRatingChange(value);
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const fill = rating >= star ? '100%' : (rating >= star - 0.5 ? '50%' : '0%');
        return (
          <div
            key={star}
            onClick={(e) => handleClick(star, e)}
            className={`relative w-6 h-6 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          >
            {/* Empty Star */}
            <svg className="w-6 h-6 text-gray-300 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {/* Filled Star with clip-path for half-stars */}
            <div 
              className="absolute top-0 left-0 overflow-hidden h-6" 
              style={{ width: fill }}
            >
              <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </div>
        );
      })}
      <span className="ml-2 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
