"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBooking } from "./store";
import { TIER_META, type Discount, type Format } from "./CalendlyEvents";
import { useBookingSession } from "./hooks/useBookingSession";
import { FormatStep } from "./steps/FormatStep";
import { DiscountStep } from "./steps/DiscountStep";
import { ScheduleStep } from "./steps/ScheduleStep";

type Step = "format" | "discount" | "schedule";

export function BookingModal() {
  const { isOpen, tier, format: initialFormat, jumpToSchedule, close } = useBooking();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { session, clear } = useBookingSession();

  // Per-flow state (resets each time a modal opens).
  const [step, setStep] = useState<Step>("format");
  const [format, setFormat] = useState<Format>("youtube");
  const [discount, setDiscount] = useState<Discount>("full");

  // When the modal opens, sync local state from the open() args and decide
  // which step to start on based on tier shape.
  useEffect(() => {
    if (!isOpen || !tier) return;

    const meta = TIER_META[tier];
    const startFormat = initialFormat ?? meta.formats[0];
    setFormat(startFormat);

    if (jumpToSchedule) {
      // Returning from OAuth — discount was set server-side and is read
      // from the session payload below.
      setStep("schedule");
    } else if (meta.formats.length > 1) {
      setStep("format");
    } else if (meta.discountsApply) {
      setStep("discount");
    } else {
      setStep("schedule");
    }
  }, [isOpen, tier, initialFormat, jumpToSchedule]);

  // Mirror session.discount → local discount when we resume from OAuth.
  useEffect(() => {
    if (!isOpen) return;
    if (jumpToSchedule && session?.discount) {
      setDiscount(session.discount);
    }
  }, [isOpen, jumpToSchedule, session]);

  // Drive the native <dialog>'s open state from our store.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  if (!tier) return null;

  const meta = TIER_META[tier];

  function advance() {
    if (step === "format") {
      // Skip discount step entirely for tiers that don't offer them (Team).
      setStep(meta.discountsApply ? "discount" : "schedule");
    } else if (step === "discount") {
      setStep("schedule");
    }
  }

  function back() {
    if (step === "discount" && meta.formats.length > 1) setStep("format");
    else if (step === "schedule") {
      if (meta.discountsApply) setStep("discount");
      else if (meta.formats.length > 1) setStep("format");
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="booking-modal"
      onClose={close}
      onClick={(e) => {
        // Backdrop click closes (target === the dialog itself, not children).
        if (e.target === dialogRef.current) close();
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="booking-inner"
            className="booking-modal-inner"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <header className="booking-modal-head">
              <div>
                <div className="booking-modal-eyebrow">{stepLabel(step)}</div>
                <h2 className="booking-modal-title">{meta.label}</h2>
              </div>
              <button
                type="button"
                className="booking-modal-close"
                onClick={close}
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <div className="booking-modal-body">
              {step === "format" && (
                <FormatStep
                  tier={tier}
                  selected={format}
                  onSelect={setFormat}
                  onContinue={advance}
                />
              )}
              {step === "discount" && (
                <DiscountStep
                  tier={tier}
                  format={format}
                  appliedDiscount={session?.discount ?? null}
                  onSkip={() => {
                    setDiscount("full");
                    advance();
                  }}
                  onUseApplied={() => {
                    if (session?.discount) setDiscount(session.discount);
                    advance();
                  }}
                  onClearApplied={clear}
                  onBack={meta.formats.length > 1 ? back : undefined}
                />
              )}
              {step === "schedule" && (
                <ScheduleStep
                  tier={tier}
                  format={format}
                  discount={discount}
                  onBack={back}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}

function stepLabel(step: Step): string {
  switch (step) {
    case "format":
      return "Step 1 · Format";
    case "discount":
      return "Discount";
    case "schedule":
      return "Pick a time";
  }
}
