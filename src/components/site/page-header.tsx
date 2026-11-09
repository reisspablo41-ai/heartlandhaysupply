import { HeaderSpacer } from "@/components/site/header";

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <>
      <HeaderSpacer />
      <header className="gutter border-b border-paper-line pt-16 pb-12">
        {eyebrow && <p className="eyebrow text-muted">{eyebrow}</p>}
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] text-balance">
          {title}
        </h1>
        {lede && (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-dark">{lede}</p>
        )}
      </header>
    </>
  );
}

/** Simple long-form body column for policy / info pages. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="gutter py-16">
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-muted-dark [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:display [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}
