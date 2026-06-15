import { RAW_PAGES } from "@/lib/generated-pages";

export type SeoPage = (typeof RAW_PAGES)[number];

export const SITE_NAME = "Mobile Home Rescue";
export const DEFAULT_SITE_URL = "https://mobilehomerescue.com";
export const PHONE_DISPLAY = "1-888-609-7298";
export const PHONE_E164 = "+18886097298";

export const SEO_PAGES: SeoPage[] = [...RAW_PAGES];
export const SERVICE_PILLARS = SEO_PAGES.filter((page) => page.pageType === "Service Pillar");
export const CITY_PAGES = SEO_PAGES.filter((page) => isCityPage(page));
export const SUPPORT_PAGES = SEO_PAGES.filter((page) => !isCityPage(page) && page.pageType !== "Service Pillar");

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export function toPath(slug: string) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function absoluteUrl(path: string) {
  return `${getSiteUrl()}${toPath(path)}`;
}

export function bySlug(slug: string) {
  const clean = toPath(slug).replace(/\/+$/, "");
  return SEO_PAGES.find((page) => page.pageSlug === clean);
}

export function isCityPage(page: SeoPage) {
  return page.pageType === "City Service Page" && !page.targetArea.includes("National");
}

export function cityFromTargetArea(targetArea: string) {
  return targetArea.replace(/\s*\([^)]*\)/, "").split(",")[0].trim();
}

export function provinceFromTargetArea(targetArea: string) {
  return targetArea.includes(",") ? targetArea.split(",")[1].trim() : "Canada";
}

export function titleCase(value: string) {
  return value
    .split(/(\s|-|\/)/)
    .map((part) => {
      if (/^\s|-|\/$/.test(part)) return part;
      if (part === "rv") return "RV";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bIn\b/g, "in")
    .replace(/\bNear Me\b/g, "Near Me");
}

export function humanTopic(page: SeoPage) {
  return page.pageTitle.replace(/\s*\|.*/, "").replace(/\s+in Canada/i, "").trim();
}

export function pageLocation(page: SeoPage) {
  return isCityPage(page) ? cityFromTargetArea(page.targetArea) : "Canada";
}

export function serviceFamily(page: SeoPage) {
  const slug = page.pageSlug;
  const keyword = page.primaryKeyword;
  if (slug.includes("water-damage-restoration") || keyword.includes("flood")) return "/water-damage-restoration";
  if (slug.includes("emergency-plumber") || slug.includes("24-7-emergency")) return "/emergency-plumber";
  if (slug.includes("rv-water") || slug.includes("trailer-water") || slug.includes("camper")) return "/rv-water-damage-repair";
  if (slug.includes("rv-plumber")) return "/rv-plumber";
  if (slug.includes("manufactured-home")) return "/manufactured-home-plumber";
  if (slug.includes("burst-pipe")) return "/burst-pipe-repair";
  if (slug.includes("winterize") || slug.includes("plumbing-problems") || slug.includes("mobile-home-plumbing")) {
    return "/mobile-home-plumbing";
  }
  if (slug.includes("mobile-home-plumber")) return "/mobile-home-plumber";
  if (slug.includes("mobile-home-water-damage")) return "/mobile-home-water-damage-restoration";
  return "/mobile-home-plumbing";
}

export function pillarFor(page: SeoPage) {
  return bySlug(serviceFamily(page)) || SERVICE_PILLARS[0];
}

export function cityPagesForPillar(pillar: SeoPage) {
  const direct = CITY_PAGES.filter((page) => serviceFamily(page) === pillar.pageSlug);
  if (direct.length > 0) return direct;
  if (pillar.pageSlug === "/mobile-home-plumbing") {
    return CITY_PAGES.filter((page) => serviceFamily(page) === "/mobile-home-plumber");
  }
  if (pillar.pageSlug === "/mobile-home-water-damage-restoration") {
    return CITY_PAGES.filter((page) => serviceFamily(page) === "/water-damage-restoration");
  }
  return direct;
}

export function sameCityPages(page: SeoPage) {
  if (!isCityPage(page)) return [];
  const city = cityFromTargetArea(page.targetArea);
  return CITY_PAGES.filter((item) => item.pageSlug !== page.pageSlug && cityFromTargetArea(item.targetArea) === city);
}

export function supportCityLinks(page: SeoPage, limit = 5) {
  const familyMatches = CITY_PAGES.filter((item) => serviceFamily(item) === serviceFamily(page)).slice(0, limit);
  if (familyMatches.length >= 2) return familyMatches;
  return [...familyMatches, ...CITY_PAGES.filter((item) => !familyMatches.includes(item)).slice(0, limit - familyMatches.length)];
}

export function linkLabel(page: SeoPage) {
  return titleCase(page.primaryKeyword);
}

export function buildH1(page: SeoPage) {
  const location = pageLocation(page);
  const key = titleCase(page.primaryKeyword);
  return key.toLowerCase().includes(location.toLowerCase()) ? key : `${key} ${location}`;
}

export function buildMetaTitle(page: SeoPage) {
  const location = pageLocation(page);
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const needsLocation = !normalize(page.primaryKeyword).includes(normalize(location));
  let lead = `${titleCase(page.primaryKeyword)}${needsLocation ? ` ${location}` : ""}`;
  lead = lead
    .replace("RV Plumber Canada", "RV Plumber Repair Canada")
    .replace("Emergency Water Damage Restoration Company", "Emergency Water Damage Restoration")
    .replace("Does Trailer Insurance Cover Water Damage", "Trailer Insurance Water Damage")
    .replace("Dollard-Des Ormeaux", "Dollard-des-Ormeaux")
    .replace("Dollard-des Ormeaux", "Dollard-des-Ormeaux");

  let title = `${lead} | ${SITE_NAME}`;
  if (title.length < 50) title = `${lead} Service | ${SITE_NAME}`;
  if (title.length > 60) title = `${lead.replace(/\s+(Service|Company|Restoration|Plumbing)$/i, "")} | ${SITE_NAME}`;
  if (title.length > 60) title = title.replace(" Canada |", " |");
  return title;
}

export function buildMetaDescription(page: SeoPage) {
  const location = pageLocation(page);
  const opener = `${titleCase(page.primaryKeyword)} help for ${location}`;
  let description = `${opener} with focused triage, clear repair options, and direct phone intake. Call ${PHONE_DISPLAY} for mobile home, RV, leak, or flood support.`;
  if (description.length > 160) {
    description = description.slice(0, 157);
    description = `${description.slice(0, description.lastIndexOf(" ")).replace(/[,. ]+$/, "")}.`;
  }
  while (description.length < 150) {
    const addition = description.length < 132 ? " Fast dispatch guidance." : " Call now.";
    description = `${description.replace(/\.$/, "")}.${addition}`;
  }
  if (description.length > 160) description = `${description.slice(0, 156).replace(/[,. ]+$/, "")}.`;
  return description;
}

export type CityFact = {
  neighborhoods: string[];
  landmarks: string[];
  climate: string;
};

export const CITY_FACTS: Record<string, CityFact> = {
  Ajax: { neighborhoods: ["Pickering Village", "Southwood"], landmarks: ["Ajax Waterfront Park", "Carruthers Creek"], climate: "humid summers and freeze-thaw winters near Lake Ontario" },
  Barrie: { neighborhoods: ["Allandale", "Painswick"], landmarks: ["Kempenfelt Bay", "Barrie waterfront"], climate: "snowy winters shaped by Georgian Bay weather" },
  Beaconsfield: { neighborhoods: ["Beacon Hill", "Sherwood"], landmarks: ["Lac Saint-Louis", "Centennial Park"], climate: "cold Montreal-area winters and humid summers" },
  Bowmanville: { neighborhoods: ["Historic Downtown", "Soper Creek"], landmarks: ["Bowmanville Creek", "Lake Ontario shoreline"], climate: "lake-influenced winters and damp spring thaws" },
  Brampton: { neighborhoods: ["Springdale", "Heart Lake"], landmarks: ["Etobicoke Creek", "Gage Park"], climate: "humid summers and icy winter swings" },
  Burlington: { neighborhoods: ["Aldershot", "Millcroft"], landmarks: ["Spencer Smith Park", "Niagara Escarpment"], climate: "Lake Ontario humidity and winter freeze-thaw cycles" },
  Burnaby: { neighborhoods: ["Metrotown", "Brentwood"], landmarks: ["Burnaby Mountain", "Deer Lake"], climate: "wet coastal winters and mild summers" },
  Calgary: { neighborhoods: ["Bowness", "Forest Lawn"], landmarks: ["Bow River", "Nose Hill Park"], climate: "dry prairie weather with sudden Chinook temperature changes" },
  "Dollard-des-Ormeaux": { neighborhoods: ["Westpark", "Sunnybrooke"], landmarks: ["Centennial Park", "Marché de l'Ouest"], climate: "cold West Island winters and wet spring melts" },
  Edmonton: { neighborhoods: ["Mill Woods", "Westmount"], landmarks: ["North Saskatchewan River", "Hawrelak Park"], climate: "long cold winters and dry prairie summers" },
  Etobicoke: { neighborhoods: ["The Kingsway", "Mimico"], landmarks: ["Humber Bay Park", "Etobicoke Creek"], climate: "lake-effect moisture and winter thaw cycles" },
  Guelph: { neighborhoods: ["Exhibition Park", "Kortright Hills"], landmarks: ["Speed River", "University of Guelph"], climate: "humid summers and cold, wet shoulder seasons" },
  Halifax: { neighborhoods: ["Hydrostone", "Fairview"], landmarks: ["Halifax Harbour", "Point Pleasant Park"], climate: "coastal rain, fog, and winter storms" },
  Hamilton: { neighborhoods: ["Stoney Creek", "Westdale"], landmarks: ["Hamilton Harbour", "Niagara Escarpment"], climate: "lake humidity plus escarpment-driven runoff" },
  Kamloops: { neighborhoods: ["Sahali", "Brocklehurst"], landmarks: ["Thompson Rivers", "Riverside Park"], climate: "hot dry summers and cold interior winters" },
  Kelowna: { neighborhoods: ["Rutland", "Glenmore"], landmarks: ["Okanagan Lake", "Knox Mountain"], climate: "dry summers and damp winter valleys" },
  Kingston: { neighborhoods: ["Portsmouth", "Cataraqui North"], landmarks: ["Lake Ontario", "Fort Henry"], climate: "windy lakefront winters and humid summers" },
  Kirkland: { neighborhoods: ["Timberlea", "Lacey Green"], landmarks: ["Kirkland Sports Complex", "Lac Saint-Louis nearby"], climate: "Montreal freeze-thaw winters and humid summers" },
  Kitchener: { neighborhoods: ["Doon", "Forest Heights"], landmarks: ["Victoria Park", "Grand River corridor"], climate: "snowy winters and humid Waterloo Region summers" },
  Langley: { neighborhoods: ["Willoughby", "Murrayville"], landmarks: ["Fort Langley", "Nicomekl River"], climate: "wet Fraser Valley winters and mild summers" },
  London: { neighborhoods: ["Old North", "Byron"], landmarks: ["Thames River", "Victoria Park"], climate: "humid summers with snowy Southwestern Ontario winters" },
  Markham: { neighborhoods: ["Unionville", "Milliken"], landmarks: ["Rouge River", "Main Street Unionville"], climate: "humid summers and icy York Region winters" },
  Milton: { neighborhoods: ["Dempsey", "Bronte Meadows"], landmarks: ["Rattlesnake Point", "Sixteen Mile Creek"], climate: "escarpment weather with winter freeze-thaw movement" },
  Mississauga: { neighborhoods: ["Port Credit", "Streetsville"], landmarks: ["Credit River", "Lake Ontario shoreline"], climate: "lake humidity and sharp winter temperature swings" },
  "North Vancouver": { neighborhoods: ["Lonsdale", "Lynn Valley"], landmarks: ["Capilano River", "Grouse Mountain"], climate: "heavy coastal rain and mild winters" },
  Oshawa: { neighborhoods: ["Kedron", "Lakeview"], landmarks: ["Oshawa Creek", "Lakeview Park"], climate: "Lake Ontario moisture and cold winter snaps" },
  Ottawa: { neighborhoods: ["Glebe", "Orléans"], landmarks: ["Rideau Canal", "Ottawa River"], climate: "very cold winters and humid summers" },
  Pierrefonds: { neighborhoods: ["Roxboro", "Cap-Saint-Jacques"], landmarks: ["Rivière des Prairies", "Bois-de-Liesse"], climate: "cold island winters and spring flood awareness" },
  "Red Deer": { neighborhoods: ["Bower", "Clearview Ridge"], landmarks: ["Red Deer River", "Waskasoo Park"], climate: "cold central Alberta winters and dry summers" },
  Regina: { neighborhoods: ["Cathedral", "Lakeview"], landmarks: ["Wascana Centre", "Saskatchewan Legislative Building"], climate: "windy prairie weather with deep winter freezes" },
  Saskatoon: { neighborhoods: ["Nutana", "Riversdale"], landmarks: ["South Saskatchewan River", "Meewasin Valley"], climate: "dry cold winters and warm prairie summers" },
  Sudbury: { neighborhoods: ["New Sudbury", "Minnow Lake"], landmarks: ["Ramsey Lake", "Science North"], climate: "long snowy winters and rocky Shield drainage" },
  Surrey: { neighborhoods: ["Newton", "Guildford"], landmarks: ["Serpentine River", "Crescent Beach"], climate: "wet coastal winters and mild growing seasons" },
  Toronto: { neighborhoods: ["Leslieville", "The Junction"], landmarks: ["Don Valley", "Lake Ontario"], climate: "humid summers and lake-influenced winter weather" },
  Vancouver: { neighborhoods: ["Kitsilano", "Mount Pleasant"], landmarks: ["False Creek", "Stanley Park"], climate: "rainy coastal winters and mild summers" },
  Vaughan: { neighborhoods: ["Woodbridge", "Maple"], landmarks: ["Humber River", "Canada's Wonderland"], climate: "humid GTA summers and cold winter cycles" },
  Victoria: { neighborhoods: ["James Bay", "Fernwood"], landmarks: ["Inner Harbour", "Beacon Hill Park"], climate: "mild coastal winters with frequent rain" },
  Windsor: { neighborhoods: ["Walkerville", "Riverside"], landmarks: ["Detroit River", "Jackson Park"], climate: "hot humid summers and damp winter thaws" },
  Winnipeg: { neighborhoods: ["St. Boniface", "River Heights"], landmarks: ["Red River", "The Forks"], climate: "extreme winter cold and spring melt pressure" },
};

export function cityFactsFor(page: SeoPage) {
  return CITY_FACTS[cityFromTargetArea(page.targetArea)];
}

const faqOpeners = [
  "What should I do before a technician arrives",
  "How is the first visit handled",
  "Can this be coordinated for older homes or trailers",
];

export function faqsFor(page: SeoPage) {
  const topic = humanTopic(page);
  const location = pageLocation(page);
  return [
    {
      q: `${faqOpeners[0]} in ${location}?`,
      a: `Start by limiting water use if a leak is active, keeping people away from soft flooring, and taking photos when it is safe. During intake, describe the home type, visible moisture, shutoff access, and any recent freezing, travel, or renovation history so the visit can be matched to the likely repair path.`,
    },
    {
      q: `How do you evaluate ${topic.toLowerCase()} requests?`,
      a: `The technician checks the reported symptom, confirms access points, tests the affected fixtures or materials, and explains whether the priority is stopping water, restoring function, drying the structure, or planning a replacement. You receive a practical sequence instead of a vague list of possibilities.`,
    },
    {
      q: `Is documentation available after service in ${location}?`,
      a: `Yes. Notes can summarize findings, moisture observations, visible damage, recommended next steps, and completed work. That record is useful for landlords, park managers, warranty questions, and insurance conversations when a leak or flood has affected flooring, walls, cabinets, or utility areas.`,
    },
  ];
}
