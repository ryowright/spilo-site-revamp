"use client";

import { useEffect, useState } from "react";
import { PopupModal } from "react-calendly";

type Props = {
  url: string;
  variant?: "red" | "ghost";
  children: React.ReactNode;
};

export function SchedulingButton({ url, variant = "red", children }: Props) {
  const [open, setOpen] = useState(false);
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  // PopupModal needs a real DOM node for its focus trap. Defer to after
  // hydration so SSR doesn't see a document reference.
  useEffect(() => {
    setRootEl(document.body);
  }, []);

  return (
    <>
      <button
        type="button"
        className={`btn btn-${variant}`}
        onClick={() => setOpen(true)}
      >
        {children} <span className="arrow">→</span>
      </button>
      {rootEl && (
        <PopupModal
          url={url}
          open={open}
          onModalClose={() => setOpen(false)}
          rootElement={rootEl}
        />
      )}
    </>
  );
}
