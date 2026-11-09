import Link from "next/link";

const ROWS = [
  {
    animal: "Horse at maintenance",
    hay: "Timothy, orchard, meadow mix",
    protein: "8–11%",
    note: "Free choice or 1.5–2% of bodyweight daily.",
    href: "/categories/grass-hay",
  },
  {
    animal: "Horse in hard work",
    hay: "Timothy with alfalfa topper",
    protein: "11–14%",
    note: "Add legume rather than grain where you can.",
    href: "/categories/alfalfa",
  },
  {
    animal: "Laminitic or insulin-resistant",
    hay: "Teff",
    protein: "9–11%",
    note: "Low NSC is what matters here, not protein.",
    href: "/products/teff-hay-low-sugar",
  },
  {
    animal: "Broodmare, in foal",
    hay: "Endophyte-free fescue, alfalfa",
    protein: "12–18%",
    note: "Never feed endophyte-infected fescue to in-foal mares.",
    href: "/products/tall-fescue-endophyte-free",
  },
  {
    animal: "Beef cattle, wintering",
    hay: "Bermuda rounds, meadow mix",
    protein: "8–11%",
    note: "Round bales in a ring feeder cut waste sharply.",
    href: "/products/coastal-bermuda-round-bale",
  },
  {
    animal: "Dairy cattle & goats in milk",
    hay: "Alfalfa",
    protein: "16–20%",
    note: "Protein and calcium drive yield.",
    href: "/categories/alfalfa",
  },
  {
    animal: "Rabbits, guinea pigs, chinchillas",
    hay: "Small-animal timothy",
    protein: "8–10%",
    note: "Unlimited grass hay. Alfalfa only for growing young.",
    href: "/categories/small-animal",
  },
  {
    animal: "Alpaca & llama",
    hay: "First-cut grass hay",
    protein: "9–11%",
    note: "Too much protein shows up in the fleece.",
    href: "/categories/grass-hay",
  },
];

export function FeedingGuide() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-175 border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink">
            <th className="eyebrow pb-4 pr-6 font-medium text-muted">Animal</th>
            <th className="eyebrow pb-4 pr-6 font-medium text-muted">Start with</th>
            <th className="eyebrow pb-4 pr-6 font-medium text-muted">Target protein</th>
            <th className="eyebrow pb-4 font-medium text-muted">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-paper-line">
          {ROWS.map((row) => (
            <tr key={row.animal} className="group transition-colors hover:bg-paper-soft">
              <th scope="row" className="py-5 pr-6 font-medium">
                {row.animal}
              </th>
              <td className="py-5 pr-6">
                <Link
                  href={row.href}
                  className="underline-offset-4 transition-colors hover:text-ink group-hover:underline"
                >
                  {row.hay}
                </Link>
              </td>
              <td className="py-5 pr-6 tabular-nums text-muted-dark">{row.protein}</td>
              <td className="py-5 text-muted-dark">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
