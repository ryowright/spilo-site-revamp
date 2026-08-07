type Props = {
  id?: string;
  shape?: string;
  fit?: string;
  placeholder?: string;
  src?: string;
  alt?: string;
  /** Above-the-fold images should pass `eager` to load immediately. Everything
   *  through this component is below the fold today, so the default is lazy. */
  eager?: boolean;
};

export function ImagePlaceholder({
  id,
  shape,
  fit,
  placeholder,
  src,
  alt,
  eager,
}: Props) {
  return (
    <image-slot id={id} shape={shape} fit={fit} placeholder={placeholder}>
      {src ? (
        // Plain <img> is intentional here for now; a next/image conversion is
        // staged separately. All uses are below the fold, hence loading="lazy".
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          loading={eager ? undefined : "lazy"}
          decoding="async"
        />
      ) : null}
    </image-slot>
  );
}
