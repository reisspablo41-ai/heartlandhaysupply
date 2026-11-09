/**
 * ⚠️  PLACEHOLDER CONTENT — REPLACE BEFORE LAUNCH
 *
 * These 50 testimonials are invented demo copy, written to fill the design
 * out. Publishing fabricated customer reviews as if they were genuine is
 * deceptive and, in the US, a violation of the FTC's rule on consumer
 * reviews (16 CFR Part 465). Swap every entry for a real, attributable
 * review — with the customer's permission — before the store goes live.
 */

export type Segment =
  | "horse"
  | "cattle"
  | "sheep-goat"
  | "small-animal"
  | "camelid"
  | "commercial";

export const SEGMENT_LABELS: Record<Segment, string> = {
  horse: "Horses",
  cattle: "Cattle & dairy",
  "sheep-goat": "Sheep & goats",
  "small-animal": "Small animals",
  camelid: "Alpaca & llama",
  commercial: "Trade & commercial",
};

export const SEGMENTS = Object.keys(SEGMENT_LABELS) as Segment[];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  segment: Segment;
  /** Product the reviewer mentions, for cross-linking. */
  product?: string;
  /** Shown in the homepage slideshow. */
  featured?: boolean;
  date: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // ── Horses ────────────────────────────────────────────────
  {
    id: "marguerite-dressage",
    quote:
      "I have bought timothy from four suppliers in six years and this is the first time the second cut has actually looked like second cut. Fine stem, leaf still on it, and green right through the middle of the bale rather than just on the outside.",
    name: "Marguerite Okonkwo",
    role: "Dressage yard, 14 horses",
    location: "Wellington, FL",
    rating: 5,
    segment: "horse",
    product: "Premium Timothy — 2nd Cut",
    featured: true,
    date: "2025-09-14",
  },
  {
    id: "dev-eventing",
    quote:
      "My event horses were dropping weight through the autumn season no matter what hard feed I threw at them. Switched the forage base to the alfalfa and the condition came back in about five weeks without me adding a single scoop of grain.",
    name: "Dev Ramanathan",
    role: "Eventing rider",
    location: "Aiken, SC",
    rating: 5,
    segment: "horse",
    product: "Alfalfa — Premium 3rd Cut",
    featured: true,
    date: "2025-10-02",
  },
  {
    id: "hollis-laminitis",
    quote:
      "My mare foundered in 2023 and finding hay I trusted became the whole problem. The teff comes with an actual NSC number on the lot, not a shrug. My vet asked where I was getting it.",
    name: "Hollis Bergmann",
    role: "Owner, one laminitic mare",
    location: "Bend, OR",
    rating: 5,
    segment: "horse",
    product: "Teff Hay — Low Sugar",
    featured: true,
    date: "2025-08-21",
  },
  {
    id: "saoirse-broodmare",
    quote:
      "Nobody else would give me paperwork on endophyte status. These people sent the lab result before I had even asked. With in-foal mares that is the only answer I will accept.",
    name: "Saoirse Flanagan",
    role: "Broodmare band, 9 mares",
    location: "Lexington, KY",
    rating: 5,
    segment: "horse",
    product: "Tall Fescue — Endophyte-Free",
    date: "2025-07-30",
  },
  {
    id: "walter-senior",
    quote:
      "My gelding is 29 and has four teeth that still work. The orchard grass is soft enough that he can actually manage it, and he finishes his pile now instead of leaving half of it in quids on the floor.",
    name: "Walter Nkemdirim",
    role: "Retired, one very old horse",
    location: "Athens, GA",
    rating: 5,
    segment: "horse",
    product: "Orchard Grass — 1st Cut",
    date: "2025-06-11",
  },
  {
    id: "priya-trail",
    quote:
      "Honest hay at an honest price. Not the cheapest on the page but the meadow mix has no mould, no dust and no surprises, and that is what I am actually paying for.",
    name: "Priya Venkataraman",
    role: "Trail rider, two horses",
    location: "Prescott, AZ",
    rating: 4,
    segment: "horse",
    product: "Meadow Mix — Mixed Grass",
    date: "2025-05-19",
  },
  {
    id: "colm-racing",
    quote:
      "We go through a lot of forage and the consistency lot to lot is what keeps me here. Twelve deliveries this year and the analysis has barely moved half a point.",
    name: "Colm Varadkar",
    role: "Thoroughbred training yard",
    location: "Saratoga Springs, NY",
    rating: 5,
    segment: "horse",
    product: "Alfalfa — Premium 3rd Cut",
    date: "2025-10-28",
  },
  {
    id: "nadia-ponyclub",
    quote:
      "Ordered for our pony club camp with about nine days' notice and it arrived two days early, stacked on pallets and shrink-wrapped. Forty children, zero hay drama.",
    name: "Nadia Al-Mansouri",
    role: "Pony club district commissioner",
    location: "Loveland, CO",
    rating: 5,
    segment: "horse",
    date: "2025-07-08",
  },
  {
    id: "bo-reining",
    quote:
      "Reining horses are fussy and mine will leave anything stemmy. The brome goes down to the floor of the stall every night. That is the whole review.",
    name: "Bo Cresswell",
    role: "Reining trainer",
    location: "Weatherford, TX",
    rating: 5,
    segment: "horse",
    product: "Smooth Brome — 2nd Cut",
    featured: true,
    date: "2025-09-02",
  },
  {
    id: "imani-boarding",
    quote:
      "Running a 40-stall boarding barn means I am buying hay the way other people buy fuel. Having the protein and moisture published up front means I can set my feed charges honestly and not get caught out mid-winter.",
    name: "Imani Brathwaite",
    role: "Boarding barn manager",
    location: "Chagrin Falls, OH",
    rating: 5,
    segment: "horse",
    date: "2025-11-04",
  },
  {
    id: "freddie-hunter",
    quote:
      "Took a star off because the first pallet turned up a day later than the window I was given. The hay itself was faultless and they called me before I called them, which counts for something.",
    name: "Freddie Oyelaran",
    role: "Hunter/jumper barn",
    location: "Middleburg, VA",
    rating: 4,
    segment: "horse",
    date: "2025-04-22",
  },
  {
    id: "tamsin-rescue",
    quote:
      "We take in horses that arrive at a body score of two and have to be brought back slowly. Clean, low-sugar forage is the entire programme and the teff has let us do it without colic in two years.",
    name: "Tamsin Achebe",
    role: "Equine rescue, 23 residents",
    location: "Sherwood, OR",
    rating: 5,
    segment: "horse",
    product: "Teff Hay — Low Sugar",
    date: "2025-08-05",
  },
  {
    id: "jonas-driving",
    quote:
      "Four Welsh cobs in harness work. The orchard grass keeps them fit without the fizz I get off anything richer.",
    name: "Jonas Lindqvist",
    role: "Combined driving",
    location: "Lancaster, PA",
    rating: 5,
    segment: "horse",
    product: "Orchard Grass — 1st Cut",
    date: "2025-03-17",
  },
  {
    id: "rhiannon-endurance",
    quote:
      "Endurance horses live on forage and electrolytes. I want fibre, not sugar, and I want to know what I am feeding. Both boxes ticked, every lot.",
    name: "Rhiannon Pryce",
    role: "100-mile endurance competitor",
    location: "Moab, UT",
    rating: 5,
    segment: "horse",
    date: "2025-06-29",
  },
  {
    id: "marcus-therapy",
    quote:
      "Our riders are children with disabilities and the ponies have to be calm and sound. Switching to a consistent grass hay took the week-to-week behaviour swings out of the herd almost immediately.",
    name: "Marcus Delacroix-Hall",
    role: "Therapeutic riding centre",
    location: "Burlington, VT",
    rating: 5,
    segment: "horse",
    featured: true,
    date: "2025-05-07",
  },
  {
    id: "eileen-minis",
    quote:
      "Miniature horses get fat looking at a field. The low-sugar teff in small squares means I can weigh out exactly what they get and nothing more.",
    name: "Eileen Søndergaard",
    role: "Miniature horse breeder",
    location: "Stillwater, MN",
    rating: 4,
    segment: "horse",
    product: "Teff Hay — Low Sugar",
    date: "2025-09-23",
  },
  {
    id: "kwame-first-horse",
    quote:
      "First horse, and I had no idea what I was buying. I emailed asking a fairly stupid question about cuts and got a proper two-paragraph answer back the same day. Nobody tried to upsell me.",
    name: "Kwame Asante-Boateng",
    role: "First-time owner",
    location: "Franklin, TN",
    rating: 5,
    segment: "horse",
    date: "2025-10-15",
  },
  {
    id: "lucia-donkeys",
    quote:
      "Donkeys need poor forage, which sounds easy until you try to buy it deliberately. The first-cut fescue is exactly the low-energy, high-fibre feed they are built for.",
    name: "Lucía Mendoza-Ferrer",
    role: "Donkey sanctuary, 31 donkeys",
    location: "Sonoita, AZ",
    rating: 5,
    segment: "horse",
    product: "Tall Fescue — Endophyte-Free",
    date: "2025-07-19",
  },

  // ── Cattle & dairy ────────────────────────────────────────
  {
    id: "garrett-cowcalf",
    quote:
      "Hundred and ten pairs to carry through winter. The round bales hold together in the feeder instead of collapsing into a wet heap, and the waste is noticeably down on last year.",
    name: "Garrett Mbeki-Shaw",
    role: "Cow-calf operation",
    location: "Valentine, NE",
    rating: 5,
    segment: "cattle",
    product: "Coastal Bermuda Round Bale",
    date: "2025-11-01",
  },
  {
    id: "hana-stocker",
    quote:
      "Oat hay at the soft dough stage is hard to find done properly. Most of what I get offered has shattered and the grain is on the field. This had the heads still in it.",
    name: "Hana Takahashi-Reed",
    role: "Stocker cattle",
    location: "Garden City, KS",
    rating: 5,
    segment: "cattle",
    product: "Oat Hay — Soft Dough Stage",
    featured: true,
    date: "2025-09-30",
  },
  {
    id: "pieter-dairy",
    quote:
      "Milk is made out of forage quality. We tested the alfalfa on arrival against the published figure and it came back within two tenths of a point. That is better than our last supplier managed in three years.",
    name: "Pieter van Rensburg",
    role: "Dairy, 240 head",
    location: "Tulare, CA",
    rating: 5,
    segment: "cattle",
    product: "Alfalfa — Premium 3rd Cut",
    date: "2025-08-12",
  },
  {
    id: "shelby-show",
    quote:
      "Show steers get fussed over more than most children. Clean bright hay with no dust matters when you are clipping and hauling all summer.",
    name: "Shelby Ironcloud",
    role: "Junior livestock exhibitor",
    location: "Hastings, NE",
    rating: 5,
    segment: "cattle",
    date: "2025-06-18",
  },
  {
    id: "rory-winter",
    quote:
      "Bought forty rounds in September for winter. Stacked them outside under tarp and opened the last one in March with no spoilage past the first two inches. That tells you it went up dry.",
    name: "Rory MacGillivray",
    role: "Beef finisher",
    location: "Spearfish, SD",
    rating: 5,
    segment: "cattle",
    product: "Coastal Bermuda Round Bale",
    date: "2025-03-28",
  },
  {
    id: "adaeze-grassfed",
    quote:
      "We sell grass-fed direct to customers who ask real questions about what the animals eat. Being able to show them an actual forage analysis instead of waving vaguely at a field has been worth more than I expected.",
    name: "Adaeze Okorie-Lamb",
    role: "Grass-fed beef, direct to consumer",
    location: "Viroqua, WI",
    rating: 5,
    segment: "cattle",
    featured: true,
    date: "2025-10-09",
  },
  {
    id: "duncan-heifers",
    quote:
      "Good value on the meadow mix for growing heifers that do not need anything rich. Delivery was straightforward and the driver knew how to get a flatbed up a farm track, which is rarer than it should be.",
    name: "Duncan Oyelowo",
    role: "Replacement heifers",
    location: "Burns, OR",
    rating: 4,
    segment: "cattle",
    product: "Meadow Mix — Mixed Grass",
    date: "2025-05-26",
  },

  // ── Sheep & goats ─────────────────────────────────────────
  {
    id: "yusuf-dairygoats",
    quote:
      "Forty-two dairy does. Alfalfa through lactation, grass hay when they are dry. The split works and I have stopped buying two different things from two different people.",
    name: "Yusuf Demirci",
    role: "Dairy goat herd",
    location: "Petaluma, CA",
    rating: 5,
    segment: "sheep-goat",
    date: "2025-07-02",
  },
  {
    id: "briony-meatgoats",
    quote:
      "Boer goats will waste anything they can pull out of a rack and tread on. Finer stem means less of it ends up as bedding, and over a winter that difference pays for the price gap.",
    name: "Briony Castellanos",
    role: "Meat goats",
    location: "Fredericksburg, TX",
    rating: 4,
    segment: "sheep-goat",
    product: "Smooth Brome — 2nd Cut",
    date: "2025-04-14",
  },
  {
    id: "angus-flock",
    quote:
      "Two hundred ewes. I buy on fibre and price, not romance, and the meadow mix does the job at a number I can live with.",
    name: "Angus Thistlewood",
    role: "Commercial sheep flock",
    location: "Dillon, MT",
    rating: 4,
    segment: "sheep-goat",
    product: "Meadow Mix — Mixed Grass",
    date: "2025-10-21",
  },
  {
    id: "noor-lambing",
    quote:
      "Lambing shed bedding is not glamorous but it is the difference between healthy lambs and a watery mouth outbreak. This straw is bright, hollow and properly dry.",
    name: "Noor Haddadi",
    role: "Lambing 180 ewes",
    location: "Moscow, ID",
    rating: 5,
    segment: "sheep-goat",
    product: "Wheat Straw Bedding",
    date: "2025-02-11",
  },
  {
    id: "ravi-weaners",
    quote:
      "Weaned lambs need to keep growing through their first winter and cheap hay is a false economy at that stage. The brome has kept the weight on them without creeper feed, which I did not expect.",
    name: "Ravi Chakrabarti-Lowe",
    role: "Sheep, 300 weaned lambs",
    location: "Lewistown, MT",
    rating: 5,
    segment: "sheep-goat",
    product: "Smooth Brome — 2nd Cut",
    date: "2025-11-08",
  },
  {
    id: "elspeth-angora",
    quote:
      "Angora goats and loose hay chaff are natural enemies. Feeding from a rack with this cut, I am picking far less vegetable matter out of the mohair at shearing.",
    name: "Elspeth Nakagawa",
    role: "Angora goats, fibre flock",
    location: "Corvallis, OR",
    rating: 5,
    segment: "sheep-goat",
    date: "2025-06-03",
  },

  // ── Small animals ─────────────────────────────────────────
  {
    id: "coralie-rabbitry",
    quote:
      "I breed and show Netherland Dwarfs and the 2 kg bundles are perfect. Hand-sorted actually means hand-sorted here — I have yet to pull a coarse stem out of one.",
    name: "Coralie Fontaine-Mbaye",
    role: "Show rabbitry",
    location: "Ann Arbor, MI",
    rating: 5,
    segment: "small-animal",
    product: "Western Timothy — Small Animal",
    featured: true,
    date: "2025-09-08",
  },
  {
    id: "tobias-guineapigs",
    quote:
      "Four guinea pigs, one of them asthmatic. The dust extraction is not marketing, you can smell the difference when you open the bag. His wheezing settled within a fortnight.",
    name: "Tobias Wrenfield",
    role: "Guinea pig owner",
    location: "Portland, ME",
    rating: 5,
    segment: "small-animal",
    product: "Western Timothy — Small Animal",
    date: "2025-08-27",
  },
  {
    id: "anjali-chinchilla",
    quote:
      "Chinchillas are impossible. Mine rejected three brands before this one. Resealable bag keeps it fresh, which matters when one small animal takes two months to get through 2 kg.",
    name: "Anjali Raghunathan",
    role: "Chinchilla owner",
    location: "Cambridge, MA",
    rating: 5,
    segment: "small-animal",
    date: "2025-05-30",
  },
  {
    id: "stefan-tortoise",
    quote:
      "Sulcata tortoise, and the vet wanted high fibre and low protein. Works out cheaper than the pet shop pouches and there is no comparison on quality.",
    name: "Stefan Oduya-Price",
    role: "Tortoise keeper",
    location: "Tucson, AZ",
    rating: 4,
    segment: "small-animal",
    date: "2025-07-25",
  },
  {
    id: "margot-bunnyrescue",
    quote:
      "We foster around sixty rabbits at any one time and hay is our single biggest cost. Buying the small squares and splitting them ourselves cut that bill by about a third.",
    name: "Margot Villanueva-Stern",
    role: "Rabbit rescue",
    location: "Olympia, WA",
    rating: 5,
    segment: "small-animal",
    featured: true,
    date: "2025-10-18",
  },
  {
    id: "henrik-petshop",
    quote:
      "I stock it in my shop and it sells itself. Customers come back and ask for it by name, which has never happened with hay before.",
    name: "Henrik Oyinlola",
    role: "Independent pet shop",
    location: "Boulder, CO",
    rating: 5,
    segment: "small-animal",
    date: "2025-09-16",
  },

  // ── Alpaca & llama ────────────────────────────────────────
  {
    id: "camille-alpaca",
    quote:
      "Alpacas need low protein or they get fat and the fleece suffers. The first-cut grass hay sits right where my vet wants it and the histogram results this year were the best we have had.",
    name: "Camille Beauchêne",
    role: "Alpaca fibre farm, 28 animals",
    location: "Woodstock, VT",
    rating: 5,
    segment: "camelid",
    date: "2025-06-24",
  },
  {
    id: "desmond-llama",
    quote:
      "Pack llamas, worked hard in the summer and rested in winter. Easy to adjust between the meadow mix and the brome depending on the season without changing supplier.",
    name: "Desmond Fairweather",
    role: "Pack llamas",
    location: "Durango, CO",
    rating: 5,
    segment: "camelid",
    date: "2025-08-02",
  },
  {
    id: "ingrid-huacaya",
    quote:
      "Second-cut anything is usually too rich for huacayas, so I appreciate that the listings are honest enough about protein for me to buy the right thing first time rather than guessing.",
    name: "Ingrid Mbatha-Olsen",
    role: "Huacaya alpaca breeder",
    location: "Hood River, OR",
    rating: 4,
    segment: "camelid",
    date: "2025-04-30",
  },

  // ── Trade & commercial ────────────────────────────────────
  {
    id: "owen-feedstore",
    quote:
      "We resell about two hundred ton a year. Pricing is transparent, the pallets arrive strapped properly, and I have never had to argue about a damaged load. That is the entire basis of a wholesale relationship.",
    name: "Owen Castellano-Birch",
    role: "Independent feed store",
    location: "Ellensburg, WA",
    rating: 5,
    segment: "commercial",
    featured: true,
    date: "2025-11-06",
  },
  {
    id: "yolanda-zoo",
    quote:
      "We feed everything from Przewalski's horses to giant tortoises and our nutritionist signs off on every forage lot. Being able to supply documentation without a three-week wait made the approval painless.",
    name: "Yolanda Nkosi-Grant",
    role: "Zoological park, curator of nutrition",
    location: "Colorado Springs, CO",
    rating: 5,
    segment: "commercial",
    date: "2025-07-14",
  },
  {
    id: "jock-pettingfarm",
    quote:
      "Open to the public six days a week, which means the hay has to look good as well as feed well. Bright green bales in the racks genuinely do change how visitors see the place.",
    name: "Jock Abernathy-Reyes",
    role: "Petting farm and visitor centre",
    location: "Lancaster, PA",
    rating: 4,
    segment: "commercial",
    date: "2025-05-12",
  },
  {
    id: "susanna-homestead",
    quote:
      "Two cows, six sheep, a dozen hens and a very opinionated donkey. Being able to get a single mixed pallet rather than committing to a full load is the only reason this works for a place our size.",
    name: "Susanna Olufemi-Clarke",
    role: "Smallholding",
    location: "Floyd, VA",
    rating: 5,
    segment: "commercial",
    date: "2025-09-20",
  },
  {
    id: "harald-equestriancentre",
    quote:
      "Ninety stables and three arenas. Contract tonnage locked in at a fixed rate last spring saved us roughly eleven percent against the open market by February. Worth doing.",
    name: "Harald Vasquez-Lindeman",
    role: "Equestrian centre",
    location: "Temecula, CA",
    rating: 5,
    segment: "commercial",
    featured: true,
    date: "2025-10-25",
  },
  {
    id: "bethan-vetclinic",
    quote:
      "Equine hospital. Our inpatients are often colicking or post-surgical, so consistency of forage is a clinical matter, not a preference. We have had no reason to change supplier in two years.",
    name: "Bethan Chukwuemeka",
    role: "Equine veterinary hospital",
    location: "Ocala, FL",
    rating: 5,
    segment: "commercial",
    date: "2025-08-18",
  },
  {
    id: "mikhail-poultry",
    quote:
      "Straw for 3,000 laying hens on deep litter. Hollow stem, low dust, and it composts down properly afterwards. Ordered monthly since March.",
    name: "Mikhail Barrington-Osei",
    role: "Pasture poultry",
    location: "Hutchinson, KS",
    rating: 5,
    segment: "commercial",
    product: "Wheat Straw Bedding",
    date: "2025-10-04",
  },
  {
    id: "fiona-market-garden",
    quote:
      "I buy the straw for mulch rather than bedding — two acres of market garden. Clean, weed-seed free and it has not introduced anything I then had to weed out. Four stars only because it is not cheap for mulch.",
    name: "Fiona Adeyemi-Whitlock",
    role: "Market garden",
    location: "Carnation, WA",
    rating: 4,
    segment: "commercial",
    product: "Wheat Straw Bedding",
    date: "2025-06-07",
  },
  {
    id: "terrence-remote",
    quote:
      "I am four hours from the nearest town of any size and most suppliers quote me a freight price designed to make me go away. This lot actually delivered, on time, for what they said.",
    name: "Terrence Kalani-Okoye",
    role: "Remote ranch",
    location: "Ely, NV",
    rating: 5,
    segment: "commercial",
    featured: true,
    date: "2025-09-11",
  },
  {
    id: "astrid-threeyears",
    quote:
      "Third season ordering. In that time there has been one bad pallet, reported with photographs on a Tuesday and replaced by the Friday with no argument and no paperwork. That is why I am still here.",
    name: "Astrid Ferreira-Haugen",
    role: "Mixed livestock farm",
    location: "Baraboo, WI",
    rating: 5,
    segment: "commercial",
    featured: true,
    date: "2025-11-02",
  },
];

// ── Helpers ─────────────────────────────────────────────────

export const FEATURED_TESTIMONIALS = TESTIMONIALS.filter((t) => t.featured);

export function testimonialsBySegment(segment?: Segment): Testimonial[] {
  const list = segment ? TESTIMONIALS.filter((t) => t.segment === segment) : TESTIMONIALS;
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

export function segmentCounts(): Record<Segment, number> {
  const counts = Object.fromEntries(SEGMENTS.map((s) => [s, 0])) as Record<Segment, number>;
  for (const t of TESTIMONIALS) counts[t.segment] += 1;
  return counts;
}

export function averageRating(): number {
  const total = TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0);
  return Math.round((total / TESTIMONIALS.length) * 10) / 10;
}

export function ratingBreakdown(): Array<{ stars: number; count: number; percent: number }> {
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = TESTIMONIALS.filter((t) => t.rating === stars).length;
    return {
      stars,
      count,
      percent: Math.round((count / TESTIMONIALS.length) * 100),
    };
  });
}
