import React, { useState } from 'react';

export default function ExplanationTooltip({ term, explanation }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className="term-explain"
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen); }}
    >
      {term}
      <span className="term-bubble" style={isOpen ? { display: 'block' } : {}}>
        <strong>{term}:</strong> {explanation}
      </span>
    </span>
  );
}
