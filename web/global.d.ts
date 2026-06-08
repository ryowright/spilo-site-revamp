import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'image-slot': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          shape?: string;
          fit?: string;
          placeholder?: string;
        },
        HTMLElement
      >;
    }
  }
}
