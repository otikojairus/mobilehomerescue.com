import { RAW_PAGES } from "@/lib/generated-pages";

export type SeoPage = (typeof RAW_PAGES)[number];

export const SITE_NAME = "Sump & Septic Co.";
export const SITE_TAGLINE = "Septic, sump pump, and drainage help across Canada.";
export const DEFAULT_SITE_URL = "https://sumpandseptic.com";
export const PHONE_DISPLAY = "1-888-793-2080";
export const PHONE_E164 = "+18887932080";

export const SEO_PAGES: SeoPage[] = [...RAW_PAGES];
export const PILLAR_PAGES = SEO_PAGES.filter((page) => page.pageType === "Service Pillar");
export const CITY_PAGES = SEO_PAGES.filter((page) => page.pageType === "City Service");
export const EMERGENCY_PAGES = SEO_PAGES.filter((page) => page.pageType === "Emergency");
export const NEAR_ME_PAGES = SEO_PAGES.filter((page) => page.pageType === "Near Me");
export const SYMPTOM_PAGES = SEO_PAGES.filter((page) => page.pageType === "Symptom");
export const COST_PAGES = SEO_PAGES.filter((page) => page.pageType === "Cost Guide");

const SEPARATOR_RE = /(\s+|[-/])/;

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
  return page.pageType === "City Service";
}

export function isEmergencyPage(page: SeoPage) {
  return page.pageType === "Emergency";
}

export function isUtilityPage(page: SeoPage) {
  return page.pageType === "Near Me" || page.pageType === "Symptom" || page.pageType === "Cost Guide";
}

export function titleCase(value: string) {
  return value
    .split(SEPARATOR_RE)
    .map((part) => {
      if (SEPARATOR_RE.test(part)) return part;
      if (/^\d+$/.test(part)) return part;
      if (part.toLowerCase() === "rv") return "RV";
      if (part.toLowerCase() === "qc") return "QC";
      if (part.toLowerCase() === "bc") return "BC";
      if (part.toLowerCase() === "ab") return "AB";
      if (part.toLowerCase() === "sk") return "SK";
      if (part.toLowerCase() === "mb") return "MB";
      if (part.toLowerCase() === "on") return "ON";
      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join("")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOf\b/g, "of")
    .replace(/\bIn\b/g, "in")
    .replace(/\bNear Me\b/g, "Near Me");
}

export function cityFromTargetArea(targetArea: string) {
  return targetArea.replace(/\s*\([^)]*\)/, "").split(",")[0].trim();
}

export function provinceFromTargetArea(targetArea: string) {
  return targetArea.includes(",") ? targetArea.split(",")[1].trim() : "CA";
}

export function pageLocation(page: SeoPage) {
  return isCityPage(page) ? cityFromTargetArea(page.targetArea) : "Canada";
}

export function pageProvince(page: SeoPage) {
  return isCityPage(page) ? provinceFromTargetArea(page.targetArea) : "CA";
}

export function shortPageTitle(page: SeoPage) {
  return page.pageTitle.replace(/\s*\|.*/, "").trim();
}

function familyFromSlugOrKeyword(page: SeoPage) {
  const key = `${page.pageSlug} ${page.primaryKeyword}`.toLowerCase();
  if (key.includes("septic-tank-pumping")) return "/septic-tank-pumping";
  if (key.includes("septic-tank-cleaning")) return "/septic-tank-cleaning";
  if (key.includes("septic-tank-repair")) return "/septic-tank-repair";
  if (key.includes("septic-services")) return "/septic-services";
  if (key.includes("septic-pump-replacement")) return "/septic-pump-replacement";
  if (key.includes("rv-holding-tank-pumping")) return "/rv-holding-tank-pumping";
  if (key.includes("sump-pump-installation")) return "/sump-pump-installation";
  if (key.includes("sump-pump-repair")) return "/sump-pump-repair";
  if (key.includes("sump-pump-replacement")) return "/sump-pump-replacement";
  if (key.includes("sump-pump-service")) return "/sump-pump-service";
  if (key.includes("commercial-sump-pump-repair")) return "/commercial-sump-pump-repair";
  if (key.includes("sump pump")) return "/sump-pump-service";
  return "/septic-services";
}

export function pillarFor(page: SeoPage) {
  return bySlug(familyFromSlugOrKeyword(page)) || PILLAR_PAGES[0];
}

export function serviceFamilyFor(page: SeoPage) {
  return familyFromSlugOrKeyword(page);
}

export function serviceTopicLabel(page: SeoPage) {
  const topic = isCityPage(page) ? pillarFor(page).pageTitle : page.pageTitle;
  return topic.replace(/\s*\|.*/, "").replace(/\s+in Canada$/i, "").trim();
}

export function linkLabel(page: SeoPage) {
  if (isCityPage(page)) return cityFromTargetArea(page.targetArea);
  return shortPageTitle(page);
}

export function pageListLabel(page: SeoPage) {
  if (isCityPage(page)) return `${cityFromTargetArea(page.targetArea)} • ${serviceTopicLabel(page)}`;
  return shortPageTitle(page);
}

export function buildH1(page: SeoPage) {
  const location = pageLocation(page);
  const base = titleCase(page.primaryKeyword);
  if (!isCityPage(page)) return base;
  return base.toLowerCase().includes(location.toLowerCase()) ? base : `${base} ${location}`;
}

function trimWords(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const chopped = value.slice(0, maxLength - 1).replace(/\s+\S*$/, "");
  return `${chopped.replace(/[,:;-]+$/, "")}`;
}

export function buildMetaTitle(page: SeoPage) {
  const location = pageLocation(page);
  const lead = isCityPage(page)
    ? `${titleCase(page.primaryKeyword)} ${location}`
    : titleCase(page.primaryKeyword);
  let title = `${lead} | ${SITE_NAME}`;
  if (title.length > 60) {
    title = `${trimWords(lead, 38)} | ${SITE_NAME}`;
  }
  if (title.length < 50) {
    const expanded = `${lead} Service | ${SITE_NAME}`;
    if (expanded.length <= 60) return expanded;
  }
  return title;
}

function fitMetaDescription(description: string) {
  if (description.length > 160) {
    const shortened = trimWords(description, 159);
    return `${shortened.replace(/[,. ]+$/, "")}.`;
  }
  if (description.length < 150) {
    const padding = description.includes("Call") ? " Fast phone support." : " Tap to call now.";
    const next = `${description.replace(/[,. ]+$/, "")}.${padding}`;
    return fitMetaDescription(next);
  }
  return description;
}

export function buildMetaDescription(page: SeoPage) {
  const city = pageLocation(page);
  const topic = shortPageTitle(page).replace(/\s*\|.*/, "");
  const facts = cityFactsFor(page);
  const opener = isCityPage(page)
    ? `${topic} in ${city}`
    : `${topic} across Canada`;
  const support = isCityPage(page)
    ? `${facts.neighborhoods[0]} and ${facts.landmarks[0]} can shape access and drainage timing.`
    : `${facts.climate} can change how quickly water moves, pools, or drains.`;
  return fitMetaDescription(`${opener} with clear next steps, tap-to-call help, and practical scheduling. ${support}`);
}

export type CityFact = {
  "neighborhoods": [string, string];
  "landmarks": [string, string];
  "climate": string;
  "population": string;
};

const MAJOR_METROS = new Set([
  "Toronto",
  "Montreal",
  "Calgary",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
  "Vancouver",
  "Hamilton",
  "London",
  "Quebec City",
  "Halifax",
  "Victoria",
]);

const LARGE_CITIES = new Set([
  "Mississauga",
  "Brampton",
  "Surrey",
  "Burnaby",
  "Richmond",
  "Laval",
  "Markham",
  "Vaughan",
  "Kitchener",
  "Windsor",
  "Guelph",
  "Barrie",
  "Oshawa",
  "Saskatoon",
  "Regina",
  "St Catharines",
  "St Johns",
  "Kelowna",
  "Nanaimo",
]);

const CITY_FACT_OVERRIDES: Record<string, CityFact> = {
  "Ajax": { neighborhoods: ["Pickering Village", "Southwood"], landmarks: ["Ajax Waterfront Park", "Carruthers Creek"], climate: "humid Lake Ontario summers and freeze-thaw winters", population: "roughly 125,000 residents" },
  "Abbotsford": { neighborhoods: ["Clearbrook", "Matsqui"], landmarks: ["Matsqui Trail", "Fraser River flats"], climate: "wet Fraser Valley winters and mild summers", population: "about 160,000 residents" },
  "Airdrie": { neighborhoods: ["Cooper's Crossing", "Kings Heights"], landmarks: ["Clyde Park", "downtown Airdrie"], climate: "dry prairie air with fast winter temperature swings", population: "about 80,000 residents" },
  "Aurora": { neighborhoods: ["Aurora Heights", "Bayview Wellington"], landmarks: ["Sheppard's Bush", "St. Andrew's College grounds"], climate: "York Region snow, rain, and freeze-thaw cycles", population: "around 65,000 residents" },
  "Barrie": { neighborhoods: ["Allandale", "Painswick"], landmarks: ["Kempenfelt Bay", "Barrie waterfront"], climate: "snowy winters shaped by Georgian Bay weather", population: "about 150,000 residents" },
  "Brampton": { neighborhoods: ["Springdale", "Heart Lake"], landmarks: ["Etobicoke Creek", "Gage Park"], climate: "humid summers and icy winter swings", population: "over 650,000 residents" },
  "Burlington": { neighborhoods: ["Aldershot", "Millcroft"], landmarks: ["Spencer Smith Park", "Niagara Escarpment"], climate: "Lake Ontario humidity and winter freeze-thaw cycles", population: "around 190,000 residents" },
  "Burnaby": { neighborhoods: ["Metrotown", "Brentwood"], landmarks: ["Burnaby Mountain", "Deer Lake"], climate: "wet coastal winters and mild summers", population: "about 250,000 residents" },
  "Calgary": { neighborhoods: ["Bowness", "Forest Lawn"], landmarks: ["Bow River", "Nose Hill Park"], climate: "dry prairie weather with Chinook temperature swings", population: "over 1.3 million residents" },
  "Cambridge": { neighborhoods: ["Galt", "Hespeler"], landmarks: ["Grand River", "Doon Heritage Village"], climate: "humid summers and cold Southwestern Ontario winters", population: "about 140,000 residents" },
  "Charlottetown": { neighborhoods: ["East Royalty", "Sherwood"], landmarks: ["Confederation Centre", "Victoria Park"], climate: "salt-air coastal weather and snowy winters", population: "around 40,000 residents" },
  "Chilliwack": { neighborhoods: ["Sardis", "Vedder Crossing"], landmarks: ["Vedder River", "Cultus Lake"], climate: "wet valley winters and warm summer afternoons", population: "about 100,000 residents" },
  "Coquitlam": { neighborhoods: ["Burke Mountain", "Maillardville"], landmarks: ["Coquitlam River", "Lafarge Lake"], climate: "mild coastal rain with short dry windows", population: "about 150,000 residents" },
  "Cornwall": { neighborhoods: ["Riverdale", "Central Cornwall"], landmarks: ["St. Lawrence River", "Cornwall Civic Complex"], climate: "cold eastern winters and humid summers", population: "about 47,000 residents" },
  "Courtenay": { neighborhoods: ["East Courtenay", "Ravensong"], landmarks: ["Comox Valley", "Courtenay River"], climate: "ocean-influenced rain and mild winters", population: "around 30,000 residents" },
  "Duncan": { neighborhoods: ["Downtown Duncan", "Quamichan"], landmarks: ["Cowichan Valley", "Mosaic cultural district"], climate: "mild island winters and steady rain", population: "about 5,000 residents" },
  "Edmonton": { neighborhoods: ["Mill Woods", "Westmount"], landmarks: ["North Saskatchewan River", "Hawrelak Park"], climate: "long cold winters and dry prairie summers", population: "over 1 million residents" },
  "Fredericton": { neighborhoods: ["Downtown", "Northside"], landmarks: ["St. John River", "Government House"], climate: "humid summers and snowy river-valley winters", population: "around 60,000 residents" },
  "Guelph": { neighborhoods: ["Exhibition Park", "Kortright Hills"], landmarks: ["Speed River", "University of Guelph"], climate: "humid summers and cold, wet shoulder seasons", population: "about 145,000 residents" },
  "Halifax": { neighborhoods: ["Hydrostone", "Fairview"], landmarks: ["Halifax Harbour", "Point Pleasant Park"], climate: "coastal rain, fog, and winter storms", population: "about 465,000 residents" },
  "Hamilton": { neighborhoods: ["Stoney Creek", "Westdale"], landmarks: ["Hamilton Harbour", "Niagara Escarpment"], climate: "lake humidity plus escarpment-driven runoff", population: "about 585,000 residents" },
  "Kamloops": { neighborhoods: ["Sahali", "Brocklehurst"], landmarks: ["Thompson Rivers", "Riverside Park"], climate: "hot dry summers and cold interior winters", population: "about 100,000 residents" },
  "Kitchener": { neighborhoods: ["Doon", "Forest Heights"], landmarks: ["Victoria Park", "Grand River corridor"], climate: "snowy winters and humid Waterloo Region summers", population: "about 260,000 residents" },
  "Kelowna": { neighborhoods: ["Glenmore", "Pandosy"], landmarks: ["Okanagan Lake", "Knox Mountain"], climate: "dry summers and damp valley winters", population: "about 150,000 residents" },
  "Kingston": { neighborhoods: ["Portsmouth", "Cataraqui North"], landmarks: ["Lake Ontario", "Fort Henry"], climate: "windy lakefront winters and humid summers", population: "about 130,000 residents" },
  "Leduc": { neighborhoods: ["Southfork", "Corinthia"], landmarks: ["Telford Lake", "Leduc Common"], climate: "prairie cold snaps and bright dry summers", population: "around 35,000 residents" },
  "Lethbridge": { neighborhoods: ["West Lethbridge", "Lakeview"], landmarks: ["Oldman River", "High Level Bridge"], climate: "dry southern Alberta weather and strong wind", population: "about 100,000 residents" },
  "London": { neighborhoods: ["Old North", "Byron"], landmarks: ["Thames River", "Victoria Park"], climate: "humid summers with snowy Southwestern Ontario winters", population: "about 420,000 residents" },
  "Laval": { neighborhoods: ["Chomedey", "Sainte-Dorothée"], landmarks: ["Laval Nature Centre", "Prairie River"], climate: "cold Montreal-area winters and humid summers", population: "about 440,000 residents" },
  "Langley": { neighborhoods: ["Willoughby", "Murrayville"], landmarks: ["Fort Langley", "Nicomekl River"], climate: "wet Fraser Valley winters and mild summers", population: "about 130,000 residents" },
  "Maple Ridge": { neighborhoods: ["Haney", "Silver Valley"], landmarks: ["Alouette River", "Golden Ears"], climate: "rainy coastal weather and mild shoulder seasons", population: "about 95,000 residents" },
  "Markham": { neighborhoods: ["Unionville", "Milliken"], landmarks: ["Rouge River", "Main Street Unionville"], climate: "humid summers and icy York Region winters", population: "about 340,000 residents" },
  "Medicine Hat": { neighborhoods: ["Southridge", "Ross Glen"], landmarks: ["South Saskatchewan River", "Esplanade"], climate: "dry prairie air and strong winter chinooks", population: "around 65,000 residents" },
  "Merritt": { neighborhoods: ["Downtown Merritt", "Nicola West"], landmarks: ["Nicola River", "Baillie House"], climate: "dry valley summers and cool interior winters", population: "about 7,000 residents" },
  "Milton": { neighborhoods: ["Dempsey", "Bronte Meadows"], landmarks: ["Rattlesnake Point", "Sixteen Mile Creek"], climate: "escarpment weather with winter freeze-thaw movement", population: "about 135,000 residents" },
  "Mississauga": { neighborhoods: ["Port Credit", "Streetsville"], landmarks: ["Credit River", "Lake Ontario shoreline"], climate: "lake humidity and sharp winter temperature swings", population: "about 770,000 residents" },
  "Moncton": { neighborhoods: ["Downtown", "North End"], landmarks: ["Magnetic Hill", "Petitcodiac River"], climate: "humid summers and snowy Atlantic winters", population: "about 85,000 residents" },
  "Nanaimo": { neighborhoods: ["Departure Bay", "South Nanaimo"], landmarks: ["Nanaimo Harbour", "Newcastle Island"], climate: "mild coastal rain and short winters", population: "about 105,000 residents" },
  "Newmarket": { neighborhoods: ["Gorham-College Manor", "Stonehaven"], landmarks: ["Fairy Lake", "Main Street Newmarket"], climate: "York Region snow, rain, and freeze-thaw cycles", population: "about 90,000 residents" },
  "Niagara Falls": { neighborhoods: ["Clifton Hill", "Chippawa"], landmarks: ["Niagara Falls", "Niagara River"], climate: "lake-effect moisture and seasonal freeze-thaw", population: "about 95,000 residents" },
  "North Bay": { neighborhoods: ["Airport Hill", "Ferris"], landmarks: ["Lake Nipissing", "Laurentian Escarpment"], climate: "long cold winters and northern shield drainage", population: "about 50,000 residents" },
  "North York": { neighborhoods: ["Yonge and Sheppard", "Don Mills"], landmarks: ["Edwards Gardens", "Toronto Centre for the Arts"], climate: "humid GTA summers and snowy winters", population: "about 700,000 residents" },
  "Oakville": { neighborhoods: ["Bronte", "Old Oakville"], landmarks: ["Oakville Harbour", "Gairloch Gardens"], climate: "lake humidity and winter thaw cycles", population: "about 220,000 residents" },
  "Okotoks": { neighborhoods: ["D'Arcy Ranch", "Westmount"], landmarks: ["Sheep River", "downtown Okotoks"], climate: "dry prairie air with quick freeze-thaw changes", population: "about 30,000 residents" },
  "Ottawa": { neighborhoods: ["Glebe", "Orléans"], landmarks: ["Rideau Canal", "Ottawa River"], climate: "very cold winters and humid summers", population: "about 1 million residents" },
  "Oshawa": { neighborhoods: ["Kedron", "Lakeview"], landmarks: ["Oshawa Creek", "Lakeview Park"], climate: "Lake Ontario moisture and cold winter snaps", population: "about 185,000 residents" },
  "Penticton": { neighborhoods: ["Wiltse", "Columbia"], landmarks: ["Okanagan Lake", "Skaha Lake"], climate: "dry summers and mild winters in the valley", population: "about 40,000 residents" },
  "Peterborough": { neighborhoods: ["East City", "North End"], landmarks: ["Trent-Severn Waterway", "Jackson Park"], climate: "humid summers and cold inland winters", population: "about 85,000 residents" },
  "Prince Albert": { neighborhoods: ["West Flat", "Crescent Heights"], landmarks: ["North Saskatchewan River", "Kinsmen Park"], climate: "cold prairie winters and warm summer days", population: "about 35,000 residents" },
  "Quebec City": { neighborhoods: ["Sainte-Foy", "Vieux-Québec"], landmarks: ["Plains of Abraham", "Cap Diamant"], climate: "snowy river winters and warm summers", population: "about 550,000 residents" },
  "Regina": { neighborhoods: ["Cathedral", "Lakeview"], landmarks: ["Wascana Centre", "Saskatchewan Legislative Building"], climate: "windy prairie weather with deep winter freezes", population: "about 250,000 residents" },
  "Richmond": { neighborhoods: ["Steveston", "Brighouse"], landmarks: ["Fraser River", "Steveston Village"], climate: "wet coastal winters and mild summers", population: "about 220,000 residents" },
  "Richmond Hill": { neighborhoods: ["Langstaff", "Oak Ridges"], landmarks: ["Lake Wilcox", "Rouge River"], climate: "humid summers and cold York Region winters", population: "about 200,000 residents" },
  "Red Deer": { neighborhoods: ["Bower", "Clearview Ridge"], landmarks: ["Red Deer River", "Waskasoo Park"], climate: "cold central Alberta winters and dry summers", population: "about 110,000 residents" },
  "Saskatoon": { neighborhoods: ["Nutana", "Riversdale"], landmarks: ["South Saskatchewan River", "Meewasin Valley"], climate: "dry cold winters and warm prairie summers", population: "about 320,000 residents" },
  "Saint Johns": { neighborhoods: ["East End", "Downtown"], landmarks: ["Signal Hill", "The Narrows"], climate: "foggy, windy coastal weather and cool summers", population: "about 110,000 residents" },
  "Saint John": { neighborhoods: ["Uptown", "Millidgeville"], landmarks: ["Reversing Falls", "Saint John River mouth"], climate: "coastal storms and snowy Atlantic winters", population: "about 70,000 residents" },
  "St Albert": { neighborhoods: ["Forest Lawn", "Kingswood"], landmarks: ["Sturgeon River", "Red Willow Park"], climate: "prairie cold snaps and dry summer air", population: "about 70,000 residents" },
  "St Catharines": { neighborhoods: ["Merritton", "Port Dalhousie"], landmarks: ["Martindale Pond", "St. Catharines Museum"], climate: "Lake Ontario humidity and winter freeze-thaw", population: "about 140,000 residents" },
  "Surrey": { neighborhoods: ["Newton", "Guildford"], landmarks: ["Serpentine River", "Crescent Beach"], climate: "wet coastal winters and mild growing seasons", population: "about 700,000 residents" },
  "Sudbury": { neighborhoods: ["New Sudbury", "Minnow Lake"], landmarks: ["Ramsey Lake", "Science North"], climate: "long snowy winters and rocky Shield drainage", population: "about 165,000 residents" },
  "Thunder Bay": { neighborhoods: ["Current River", "Port Arthur"], landmarks: ["Lake Superior", "Sleeping Giant"], climate: "cold lakefront winters and short summers", population: "about 110,000 residents" },
  "Toronto": { neighborhoods: ["Leslieville", "The Junction"], landmarks: ["Don Valley", "Lake Ontario"], climate: "humid summers and lake-influenced winter weather", population: "about 3 million residents" },
  "Truro": { neighborhoods: ["Downtown Truro", "West End"], landmarks: ["Victoria Park", "Cobequid Bay"], climate: "Atlantic rain, snow, and windy shoulder seasons", population: "about 13,000 residents" },
  "Vancouver": { neighborhoods: ["Kitsilano", "Mount Pleasant"], landmarks: ["False Creek", "Stanley Park"], climate: "rainy coastal winters and mild summers", population: "about 680,000 residents" },
  "Vaughan": { neighborhoods: ["Woodbridge", "Maple"], landmarks: ["Humber River", "Canada's Wonderland"], climate: "humid GTA summers and cold winter cycles", population: "about 340,000 residents" },
  "Vernon": { neighborhoods: ["East Hill", "Bella Vista"], landmarks: ["Okanagan Lake", "Kalamalka Lake"], climate: "dry summers and cold interior winters", population: "about 45,000 residents" },
  "Victoria": { neighborhoods: ["James Bay", "Fernwood"], landmarks: ["Inner Harbour", "Beacon Hill Park"], climate: "mild coastal winters with frequent rain", population: "about 95,000 residents" },
  "West Kelowna": { neighborhoods: ["Glenrosa", "Shannon Lake"], landmarks: ["Okanagan Lake", "Gellatly Bay"], climate: "dry Okanagan summers and mild winters", population: "about 35,000 residents" },
  "Windsor": { neighborhoods: ["Walkerville", "Riverside"], landmarks: ["Detroit River", "Jackson Park"], climate: "hot humid summers and damp winter thaws", population: "about 230,000 residents" },
  "Waterloo": { neighborhoods: ["Uptown", "Westmount"], landmarks: ["University of Waterloo", "Waterloo Park"], climate: "humid summers and snowy winters", population: "about 120,000 residents" },
  "Whitby": { neighborhoods: ["Brooklin", "Downtown Whitby"], landmarks: ["Lynde Creek", "Whitby Harbour"], climate: "Lake Ontario humidity and winter freeze-thaw", population: "about 140,000 residents" },
  "Winnipeg": { neighborhoods: ["St. Boniface", "River Heights"], landmarks: ["Red River", "The Forks"], climate: "extreme winter cold and spring melt pressure", population: "about 850,000 residents" },
};

function provinceKey(targetArea: string) {
  return provinceFromTargetArea(targetArea).replace(/\s+/g, "");
}

function populationBand(city: string, province: string) {
  if (MAJOR_METROS.has(city)) return CITY_FACT_OVERRIDES[city]?.population || "a major metro population";
  if (LARGE_CITIES.has(city)) return CITY_FACT_OVERRIDES[city]?.population || "a large regional population";
  if (province === "ON" && city === "Sudbury") return "about 165,000 residents";
  if (province === "QC" && city === "Montreal") return "over 1.7 million residents";
  if (province === "BC" && city === "Victoria") return "about 95,000 residents";
  if (province === "AB") return "roughly 30,000 to 150,000 residents";
  if (province === "SK" || province === "MB") return "roughly 15,000 to 320,000 residents";
  if (province === "NB" || province === "NS" || province === "PE" || province === "NL") return "roughly 10,000 to 465,000 residents";
  return "roughly 20,000 to 250,000 residents";
}

function fallbackFacts(city: string, province: string): CityFact {
  const south = /south|lower|west/i.test(city);
  const north = /north/i.test(city);
  const water = /(lake|river|harbour|harbor|port|falls|bay|creek|beach)/i.test(city);
  const neighborhoods: [string, string] = [
    `${city} downtown`,
    south ? `${city} south side` : north ? `${city} north end` : `${city} residential districts`,
  ];
  const landmarkA = water ? `${city} waterfront` : `${city} city hall`;
  const landmarkB =
    province === "BC"
      ? "the regional valley and mountain corridor"
      : province === "AB"
        ? "the prairie edge and river valley"
        : province === "QC"
          ? "the riverfront and heritage core"
          : province === "NB" || province === "NS" || province === "PE" || province === "NL"
            ? "the harbourfront and coastal route"
            : "the local river corridor";
  return {
    neighborhoods,
  "landmarks": [landmarkA, landmarkB],
    climate:
      province === "BC"
        ? "wet coastal winters and mild summers"
        : province === "AB"
          ? "dry prairie air with sudden winter changes"
          : province === "SK" || province === "MB"
            ? "windy prairie weather and long cold winters"
            : province === "QC"
              ? "snowy winters and humid summers"
              : province === "NB" || province === "NS" || province === "PE" || province === "NL"
                ? "coastal rain, fog, and winter storms"
                : "humid summers and freeze-thaw winters",
  "population": populationBand(city, province),
  };
}

export function cityFactsFor(page: SeoPage): CityFact {
  if (!isCityPage(page)) {
    return {
  "neighborhoods": ["regional service routes", "main access roads"],
  "landmarks": ["downtown loading areas", "stormwater corridors"],
  "climate": "Canadian weather can still slow drainage, drying, and access.",
  "population": "Canada-wide service pages",
    };
  }

  const city = cityFromTargetArea(page.targetArea);
  const province = provinceKey(page.targetArea);
  return CITY_FACT_OVERRIDES[city] || fallbackFacts(city, province);
}

export function sameCityPages(page: SeoPage) {
  if (!isCityPage(page)) return [];
  const city = cityFromTargetArea(page.targetArea);
  return CITY_PAGES.filter((item) => item.pageSlug !== page.pageSlug && cityFromTargetArea(item.targetArea) === city);
}

export function cityPagesForPillar(pillar: SeoPage) {
  const family = pillar.pageSlug;
  return CITY_PAGES.filter((page) => serviceFamilyFor(page) === family);
}

export function supportCityLinks(page: SeoPage, limit = 5) {
  const family = serviceFamilyFor(page);
  const matches = CITY_PAGES.filter((item) => serviceFamilyFor(item) === family).slice(0, limit);
  if (matches.length >= limit) return matches;
  return [...matches, ...CITY_PAGES.filter((item) => !matches.includes(item)).slice(0, limit - matches.length)];
}

export function relatedCityLinks(page: SeoPage, limit = 5) {
  if (!isCityPage(page)) return CITY_PAGES.slice(0, limit);
  const cityMatches = sameCityPages(page);
  if (cityMatches.length >= limit) return cityMatches.slice(0, limit);
  const familyMatches = CITY_PAGES.filter((item) => item.pageSlug !== page.pageSlug && serviceFamilyFor(item) === serviceFamilyFor(page));
  return [...cityMatches, ...familyMatches.filter((item) => !cityMatches.includes(item))].slice(0, limit);
}

function slugHash(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function serviceTone(page: SeoPage) {
  const slug = page.pageSlug;
  if (slug.includes("septic")) return "septic systems";
  if (slug.includes("sump-pump")) return "sump pumps";
  if (slug.includes("rv")) return "holding tanks";
  return "drainage systems";
}

export function faqsFor(page: SeoPage) {
  const city = pageLocation(page);
  const topic = serviceTopicLabel(page);
  const tone = serviceTone(page);
  const variant = slugHash(page.pageSlug) % 3;
  const opener =
    variant === 0
      ? `What should I check first before booking ${topic.toLowerCase()} in ${city}?`
      : variant === 1
        ? `How do you decide whether the issue is a repair, cleaning, or replacement?`
        : `What helps the visit move faster when the site is hard to access?`;

  return [
    {
  "q": opener,
  "a": `Start with water shutoff access, the exact symptom, and any recent weather, pumping, flooding, or alarm history. That short intake keeps the conversation focused on ${tone}, not generic plumbing guesses.`,
    },
    {
  "q": `How does the first visit usually work for ${city} customers?`,
  "a": `The technician checks the system from the most likely access point, confirms whether the issue is active or historical, and then explains the next practical step. That can mean a quick reset, cleaning, a pump change, a repair scope, or a follow-up if hidden damage needs more attention.`,
    },
    {
  "q": `Can you help if I also need a second location-specific page for the same city?`,
  "a": `Yes. City pages are linked together so someone reading about ${city} can move to the related service route without starting over. That keeps the page useful for owners, property managers, and anyone comparing different parts of the same job.`,
    },
  ];
}

export function pageFamilyPages(page: SeoPage) {
  if (page.pageType === "Service Pillar") return cityPagesForPillar(page);
  if (isCityPage(page)) return sameCityPages(page);
  if (isEmergencyPage(page)) return [...PILLAR_PAGES.slice(0, 2), ...relatedCityLinks(page, 3)];
  if (page.pageType === "Cost Guide" || page.pageType === "Symptom" || page.pageType === "Near Me") {
    return [...PILLAR_PAGES.slice(0, 1), ...relatedCityLinks(page, 4)];
  }
  return [...PILLAR_PAGES.slice(0, 2), ...relatedCityLinks(page, 3)];
}

export function pageSummary(page: SeoPage) {
  return `${pageListLabel(page)} | ${page.pageType}`;
}
