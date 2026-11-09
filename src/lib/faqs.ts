export interface Faq {
  q: string;
  a: string;
}

/** Shared by /faq and the homepage preview. */
export const FAQS: Faq[] = [
  {
    q: "What's the difference between first, second and third cut?",
    a: "First cut is coarser and stemmier with more seed head — good value, higher fibre. Second cut is finer and leafier with more protein. Third cut is the softest and richest, and is usually fed as part of a ration rather than free choice.",
  },
  {
    q: "Timothy, orchard or bermuda — which do I need?",
    a: "All three are grass hay in the 8–12% protein range, so the choice is mostly about stem and palatability. Timothy is the standard for horses in light to moderate work. Orchard grass is softer and a little higher in protein, which helps with picky eaters. Bermuda is finer-stemmed and the most economical per ton for pasture feeding.",
  },
  {
    q: "How much does a bale weigh?",
    a: "Small squares are typically 20–27 kg, large squares 300–350 kg and 4x5 rounds around 450–500 kg. The exact weight for each lot is on its product page.",
  },
  {
    q: "How should I store it?",
    a: "Off the ground on pallets, under cover, with air moving around the stack. Hay baled dry will hold its colour and feed value for well over a year stored that way. Stacked on bare concrete in a damp shed it will mould from the bottom up.",
  },
  {
    q: "Do I need an account to order?",
    a: "No. Checkout is guest-only. You give us a delivery address and a contact number, and we email you a private link to your order that you can reopen any time.",
  },
  {
    q: "When am I charged?",
    a: "Placing an order reserves your lots — nothing is charged on the site. We confirm the freight window and invoice from there.",
  },
  {
    q: "Can I return hay?",
    a: "We don't take returns on opened or fed hay for biosecurity reasons. If a load arrives wet, mouldy or not as described, photograph it on the truck and contact us the same day and we'll replace or refund it.",
  },
  {
    q: "Do you deliver outside the US?",
    a: "Not through the website. Send a bulk enquiry with your port or destination and we'll quote it.",
  },
];
