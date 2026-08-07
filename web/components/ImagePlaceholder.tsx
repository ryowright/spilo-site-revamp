import Image from "next/image";
import type { CSSProperties } from "react";

type Props = {
  id?: string;
  shape?: string;
  fit?: string;
  placeholder?: string;
  src?: string;
  alt?: string;
  /** Roughly how wide the image renders, for next/image srcset selection
   *  (e.g. "(max-width: 560px) 200px, 340px"). Falls back to full-width. */
  sizes?: string;
  /** Above-the-fold images should pass `priority` to preload eagerly. Everything
   *  through this component is below the fold today, so the default is lazy. */
  priority?: boolean;
};

export function ImagePlaceholder({
  id,
  shape,
  fit,
  placeholder,
  src,
  alt,
  sizes,
  priority,
}: Props) {
  return (
    // image-slot is position:relative (globals.css) so next/image `fill` anchors
    // to it; it already has a definite size via aspect-ratio / height per use.
    <image-slot id={id} shape={shape} fit={fit} placeholder={placeholder}>
      {src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          style={{ objectFit: (fit as CSSProperties["objectFit"]) ?? "cover" }}
        />
      ) : null}
    </image-slot>
  );
}
