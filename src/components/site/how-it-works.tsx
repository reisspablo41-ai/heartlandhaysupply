const STEPS = [
  {
    title: "Pick your lot",
    body: "Every listing shows the cut, harvest year, protein and moisture, so you are choosing a known quantity rather than a photograph.",
  },
  {
    title: "Order without an account",
    body: "No sign-up, no password. Give us a delivery address and a number to reach you on, and the cart does the rest.",
  },
  {
    title: "We confirm the freight",
    body: "Within one business day we come back with a delivery window and the invoice. Nothing is charged on the site.",
  },
  {
    title: "It arrives dry",
    body: "Strapped and wrapped on pallets, or flatbed for large squares and rounds. Wet or mouldy on arrival, we replace it.",
  },
];

export function HowItWorks() {
  return (
    <ol className="grid gap-px bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, index) => (
        <li key={step.title} className="bg-paper p-8 md:p-10">
          <span className="eyebrow text-hay tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-5 text-base font-medium">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-dark">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
