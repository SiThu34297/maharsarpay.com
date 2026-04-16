"use client";

import { useFormStatus } from "react-dom";

type AsyncSubmitButtonProps = Readonly<{
  label: string;
  pendingLabel?: string;
  className: string;
  disabled?: boolean;
}>;

export function AsyncSubmitButton({
  label,
  pendingLabel,
  className,
  disabled = false,
}: AsyncSubmitButtonProps) {
  const { pending } = useFormStatus();
  const resolvedLabel = pending ? (pendingLabel ?? `${label}...`) : label;

  return (
    <button type="submit" disabled={disabled || pending} aria-busy={pending} className={className}>
      {resolvedLabel}
    </button>
  );
}
