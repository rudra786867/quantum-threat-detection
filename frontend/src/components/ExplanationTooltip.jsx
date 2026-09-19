import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info } from './Icons';

export default function ExplanationTooltip({ term, explanation }) {
  const id = useId();
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const timerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 12, top: 12 });

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const show = () => {
    clearTimer();
    setOpen(true);
  };

  const hide = () => {
    clearTimer();
    setOpen(false);
  };

  const scheduleHide = () => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const calculatePosition = () => {
      if (!triggerRef.current || !popoverRef.current) return;
      const anchor = triggerRef.current.getBoundingClientRect();
      const bounds = popoverRef.current.getBoundingClientRect();
      const gap = 8;
      const left = Math.max(12, Math.min(anchor.left, window.innerWidth - bounds.width - 12));
      const below = anchor.bottom + gap;
      const top = below + bounds.height <= window.innerHeight - 12
        ? below
        : Math.max(12, anchor.top - bounds.height - gap);
      setPosition({ left, top });
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [open, term, explanation]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event) => {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target) &&
        popoverRef.current && !popoverRef.current.contains(event.target)
      ) {
        hide();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        hide();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <span className="term-explain">
      <span>{term}</span>
      <button
        ref={triggerRef}
        type="button"
        className="term-trigger"
        aria-label={`Explain term: ${term}`}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onFocus={show}
        onBlur={scheduleHide}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') show();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') scheduleHide();
        }}
        onClick={(e) => {
          e.preventDefault();
          clearTimer();
          setOpen((prev) => !prev);
        }}
      >
        <Info aria-hidden="true" className="app-icon" size={13} />
      </button>
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            id={id}
            role="region"
            aria-label={`${term} explanation`}
            className="explanation-popover"
            style={position}
            onPointerEnter={clearTimer}
            onPointerLeave={scheduleHide}
          >
            <strong style={{ color: 'var(--brand)', display: 'block', marginBottom: '0.25rem' }}>
              {term}
            </strong>
            <div style={{ color: 'var(--text-body)', fontSize: '0.825rem', lineHeight: '1.5' }}>
              {explanation}
            </div>
          </div>,
          document.body
        )}
    </span>
  );
}
