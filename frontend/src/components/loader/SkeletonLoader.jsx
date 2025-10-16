


import React from 'react';

const SkeletonLoader = () => {
  // Generate random widths for more realistic skeleton lines
  const getRandomWidth = (index, total) => {
    if (index === total - 1) return Math.random() * 40 + 30; // Last line shorter
    return Math.random() * 30 + 70; // Other lines longer
  };

  const lines = 8;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      {/* Header with AI indicator */}
      <div className="flex items-center mb-4 space-x-3">
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm animate-pulse"></div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
        </div>
      </div>

      {/* Main content area */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
        
        {/* Skeleton lines */}
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <div 
              className="h-4 bg-gray-200 rounded animate-pulse"
              style={{ 
                width: `${getRandomWidth(index, lines)}%`,
                animationDelay: `${index * 0.1}s`
              }}
            ></div>
            {index === lines - 1 && (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-blue-400 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Typing indicator dots */}
      <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-100">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className="text-sm text-gray-500 animate-pulse">AI is thinking deeply...</span>
      </div>
    </div>
  );
};

export default SkeletonLoader;