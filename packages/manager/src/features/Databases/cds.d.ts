/**
 * Delete once Tab is explicitly exported from @akamai/cds-components
 */
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'cds-tab': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          active?: boolean;
          disabled?: boolean;
          label?: string;
        },
        HTMLElement
      >;
    }
  }
}
