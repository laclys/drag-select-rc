
declare namespace JSX {
  interface IntrinsicElements {
    td: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
      disabled?: boolean;
    };
  }
}