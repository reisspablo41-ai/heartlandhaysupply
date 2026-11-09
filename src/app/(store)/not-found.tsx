import Link from "next/link";
import { HeaderSpacer } from "@/components/site/header";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <HeaderSpacer />
      <div className="gutter grid min-h-[60vh] place-items-center py-24 text-center">
        <div>
          <p className="eyebrow text-muted">404</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,7vw,5rem)]">
            That page isn’t in the barn
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-sm text-muted-dark">
            The link may be old, or the lot may have sold out and been removed.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/products" className={buttonClass("solid", "lg")}>
              Shop the catalogue
            </Link>
            <Link href="/" className={buttonClass("outline", "lg")}>
              Back home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
