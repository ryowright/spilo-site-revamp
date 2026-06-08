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

// Side-effect CSS imports (e.g. `import "./globals.css"`) are handled by
// Next.js at build time, but newer TypeScript versions want an explicit
// module declaration for the IDE to stop warning.
declare module '*.css';
