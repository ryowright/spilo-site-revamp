"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBooking, type BookingStep } from "./store";
import { TIER_META, type Discount, type Format } from "./SchedulingEvents";
import { useBookingSession } from "./hooks/useBookingSession";
import { CoachStep } from "./steps/CoachStep";
import { DiscountStep } from "./steps/DiscountStep";
import { ScheduleStep } from "./steps/ScheduleStep";

export function BookingModal() {
  const {
    isOpen,
    tier,
    format: initialFormat,
    verifyError,
    step: initialStep,
    close,
  } = useBooking();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { session, clear } = useBookingSession();

  // Per-flow state (resets each time a modal opens).
  const [step, setStep] = useState<BookingStep>("coach");
  const [format, setFormat] = useState<Format>("youtube");
  const [discount, setDiscount] = useState<Discount>("full");

  // When the modal opens, sync the format from the open() args and land on the
  // requested step. The landing step is an explicit open() argument rather than
  // a derived condition: the card CTAs want the coach chooser, but the OAuth
  // return passes "discount" so verifying doesn't discard the coach and format
  // already picked. This component never unmounts (it returns null), so this
  // effect is the only thing that resets `step`.
  useEffect(() => {
    if (!isOpen || !tier) return;
    const meta = TIER_META[tier];
    setFormat(initialFormat ?? meta.formats[0]);
    setStep(initialStep ?? "coach");
  }, [isOpen, tier, initialFormat, initialStep]);

  // Mirror the verified discount from the session cookie into local state.
  useEffect(() => {
    if (!isOpen) return;
    setDiscount(session?.discount ?? "full");
  }, [isOpen, session]);

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
              {step === "coach" && (
                <CoachStep
                  tier={tier}
                  onChoose={(f) => {
                    setFormat(f);
                    // Tiers without discounts (Team) would land on an empty
                    // step, so they go straight to the scheduler.
                    setStep(meta.discountsApply ? "discount" : "schedule");
                  }}
                  onClose={close}
                />
              )}
              {step === "discount" && (
                <DiscountStep
                  tier={tier}
                  selectedFormat={format}
                  appliedDiscount={session?.discount ?? null}
                  verifyError={verifyError}
                  onClearApplied={clear}
                  onBack={() => setStep("coach")}
                  onContinue={() => {
                    setDiscount(session?.discount ?? "full");
                    setStep("schedule");
                  }}
                />
              )}
              {step === "schedule" && (
                <ScheduleStep
                  tier={tier}
                  format={format}
                  discount={discount}
                  // Back to whichever step they actually came from.
                  onBack={() =>
                    setStep(meta.discountsApply ? "discount" : "coach")
                  }
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
