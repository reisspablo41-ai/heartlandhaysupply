import { LeafIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";

const ITEMS = [
  {
    icon: LeafIcon,
    title: "Cut at the right stage",
    body: "Cut pre-bloom, before the stem goes woody and the seed head takes over. Leaf retained, stem fine, colour green all the way to the core of the bale.",
  },
  {
    icon: ShieldIcon,
    title: "Tested, not guessed",
    body: "Every lot is probe-sampled for protein and moisture before it leaves the barn. The numbers on the listing are the numbers you get.",
  },
  {
    icon: TruckIcon,
    title: "Freight across 48 states",
    body: "Small squares go LTL on pallets, large squares and rounds move by flatbed. Delivery windows confirmed within one business day.",
  },
];

export function ValueProps() {
  return (
    <div className="grid gap-px bg-paper-line md:grid-cols-3">
      {ITEMS.map(({ icon: Icon, title, body }) => (
        <div key={title} className="bg-paper p-8 md:p-10">
          <Icon className="size-6 text-hay" />
          <h3 className="mt-6 text-base font-medium">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-dark">{body}</p>
        </div>
      ))}
    </div>
  );
}
