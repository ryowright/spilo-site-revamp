"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBooking } from "./store";
import { TIER_META, type Discount, type Format } from "./SchedulingEvents";
import { useBookingSession } from "./hooks/useBookingSession";
import { OptionsStep } from "./steps/OptionsStep";
import { ScheduleStep } from "./steps/ScheduleStep";

type Step = "options" | "schedule";

export function BookingModal() {
  const { isOpen, tier, format: initialFormat, verifyError, close } =
    useBooking();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { session, clear } = useBookingSession();

  // Per-flow state (resets each time a modal opens).
  const [step, setStep] = useState<Step>("options");
  const [format, setFormat] = useState<Format>("youtube");
  const [discount, setDiscount] = useState<Discount>("full");

  // When the modal opens, sync the format from the open() args and always land
  // on the combined options step.
  useEffect(() => {
    if (!isOpen || !tier) return;
    const meta = TIER_META[tier];
    setFormat(initialFormat ?? meta.formats[0]);
    setStep("options");
  }, [isOpen, tier, initialFormat]);

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
              {step === "options" && (
                <OptionsStep
                  tier={tier}
                  selectedFormat={format}
                  onSelectFormat={setFormat}
                  appliedDiscount={session?.discount ?? null}
                  verifyError={verifyError}
                  onClearApplied={clear}
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
                  onBack={() => setStep("options")}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
