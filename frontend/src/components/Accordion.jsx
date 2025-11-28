/**
 * Componente Accordion reutilizable
 * Para FAQs y contenido expandible
 */
import { useState } from 'react';

export default function Accordion({ items = [], allowMultiple = false }) {
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleItem = (id) => {
    if (allowMultiple) {
      setExpandedItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setExpandedItems(prev => 
        prev.includes(id) ? [] : [id]
      );
    }
  };

  const isExpanded = (id) => expandedItems.includes(id);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <span className="font-semibold text-gray-900">{item.title || item.question}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 text-gray-600 transition-transform shrink-0 ml-2 ${
                isExpanded(item.id) ? 'rotate-180' : ''
              }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5m0 0l-7.5-7.5" />
            </svg>
          </button>

          {isExpanded(item.id) && (
            <div className="px-4 pb-4 pt-0 border-t border-gray-200">
              <div className="text-gray-600">
                {item.content || item.answer}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
