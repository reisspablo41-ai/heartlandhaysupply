const DEFAULT_ITEMS = [
  "Baled this season",
  "Moisture tested",
  "Stored under cover",
  "Direct from the farm",
  "Freight across 48 states",
];

/** Slow edge-to-edge ticker, the band that sits under the hero. */
export function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-paper-line bg-paper py-4">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-14 motion-reduce:animate-none">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="eyebrow flex items-center gap-14 whitespace-nowrap text-muted-dark"
          >
            {item}
            <span aria-hidden className="size-1 rounded-full bg-hay" />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
