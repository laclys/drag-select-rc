
declare namespace JSX {
  interface IntrinsicElements {
    td: React.DetailedHTMLProps<React.AllHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
      disabled?: boolean;
    };
  }
}