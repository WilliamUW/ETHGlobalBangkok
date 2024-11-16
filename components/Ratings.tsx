import {Star} from "lucide-react";

export const Ratings = ({ratings}:{ratings: number}) => (
  <div className="flex justify-between items-center">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 ${
            star <= ratings
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
    <span className="text-sm font-medium">{ratings} out of 5</span>
  </div>
);
