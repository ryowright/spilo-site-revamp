type Props = {
  id?: string;
  shape?: string;
  fit?: string;
  placeholder?: string;
  src?: string;
  alt?: string;
};

export function ImagePlaceholder({
  id,
  shape,
  fit,
  placeholder,
  src,
  alt,
}: Props) {
  return (
    <image-slot id={id} shape={shape} fit={fit} placeholder={placeholder}>
      {src ? <img src={src} alt={alt ?? ""} /> : null}
    </image-slot>
  );
}
