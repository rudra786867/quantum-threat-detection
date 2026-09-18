import React from 'react';
import { Info } from './Icons';

export default function ExplanationTooltip({ term, explanation }) {
  return (
    <span className="term-explain">
      {term}
      <span className="term-bubble">
        <strong>{term}:</strong> {explanation}
      </span>
    </span>
  );
}
