// Calendly event URLs — one per tier × format. Replace the placeholders with
// the real URLs once Spilo creates the event types in his Calendly account
// (each one must have Stripe payment enabled and the correct price).
//
// Pattern: https://calendly.com/{username}/{event-type-slug}
export const CALENDLY_EVENTS = {
  inDepthYouTube:  "https://calendly.com/ryoanything/1-hour-coaching-private-clone",
  inDepthPrivate:  "https://calendly.com/ryoanything/1-hour-coaching",
  thirtyMinReview: "https://calendly.com/ryoanything/30-minute-coaching",
  teamYouTube:     "https://calendly.com/ryoanything/70-minute-team-coaching-private-clone",
  teamPrivate:     "https://calendly.com/ryoanything/70-minute-team-coaching",
} as const;
