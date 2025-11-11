'use client';

export default function Numpad({ onNumberClick, onDelete }) {
  const numbers = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  return (
    <div className="w-full">
      {/* Numbers Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {numbers.flat().map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className="aspect-square bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-3xl font-bold rounded-3xl transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Bottom Row: Empty, 0, Delete */}
      <div className="grid grid-cols-3 gap-4">
        {/* Empty space */}
        <div></div>
        
        {/* Number 0 */}
        <button
          onClick={() => onNumberClick(0)}
          className="aspect-square bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-3xl font-bold rounded-3xl transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          0
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="aspect-square bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-3xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
