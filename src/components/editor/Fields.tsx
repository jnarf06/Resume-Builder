"use client";

import { useState } from "react";

const base =
  "w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100";

export function Text({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input
        type={type}
        className={base}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-xs font-medium text-slate-600">
        <span>{label}</span>
        {hint && <span className="font-normal text-slate-400">{hint}</span>}
      </span>
      <textarea
        className={`${base} resize-y leading-relaxed`}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <select className={base} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-slate-700"
      />
      <span className="text-sm text-slate-700">
        {label}
        {hint && <span className="block text-xs text-slate-400">{hint}</span>}
      </span>
    </label>
  );
}

export function Button({
  children,
  onClick,
  variant = "ghost",
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  title?: string;
}) {
  const styles = {
    primary: "bg-slate-800 text-white hover:bg-slate-700",
    ghost: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    danger: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
  }[variant];
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${styles}`}
    >
      {children}
    </button>
  );
}

export function Accordion({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
      >
        <span className="text-sm font-semibold text-slate-800">
          {title}
          {count !== undefined && <span className="ml-2 font-normal text-slate-400">{count}</span>}
        </span>
        <span className={`text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}>›</span>
      </button>
      {open && <div className="space-y-3 px-4 pb-5">{children}</div>}
    </section>
  );
}

/** Reorder / delete controls shared by every repeatable list item. */
export function ItemControls({
  onUp,
  onDown,
  onRemove,
  isFirst,
  isLast,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-1">
      {!isFirst && (
        <Button onClick={onUp} title="Move up">
          ↑
        </Button>
      )}
      {!isLast && (
        <Button onClick={onDown} title="Move down">
          ↓
        </Button>
      )}
      <Button onClick={onRemove} variant="danger" title="Remove">
        ✕
      </Button>
    </div>
  );
}
