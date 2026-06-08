// tweaks-app.jsx — Spilo landing page tweak controls.
// Applies hero layout, testimonial card style, and display-font swaps
// by writing data-* attributes onto <html>, which the CSS keys off of.

const SPILO_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "split",
  "cards": "framed",
  "display": "anton"
}/*EDITMODE-END*/;

function SpiloTweaks() {
  const [t, setTweak] = useTweaks(SPILO_TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement;
    r.dataset.hero = t.hero;
    r.dataset.cards = t.cards;
    r.dataset.display = t.display;
  }, [t.hero, t.cards, t.display]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Hero layout" />
      <TweakRadio
        label="Variant"
        value={t.hero}
        options={["split", "spotlight", "stacked"]}
        onChange={(v) => setTweak("hero", v)}
      />

      <TweakSection label="Testimonials" />
      <TweakRadio
        label="Card style"
        value={t.cards}
        options={["framed", "minimal", "bordered"]}
        onChange={(v) => setTweak("cards", v)}
      />

      <TweakSection label="Typography" />
      <TweakRadio
        label="Display font"
        value={t.display}
        options={["anton", "oswald", "bebas"]}
        onChange={(v) => setTweak("display", v)}
      />
    </TweaksPanel>
  );
}

(function mountSpiloTweaks() {
  const host = document.createElement("div");
  host.id = "spilo-tweaks-root";
  document.body.appendChild(host);
  ReactDOM.createRoot(host).render(<SpiloTweaks />);
})();
