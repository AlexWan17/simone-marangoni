import Parser from "rss-parser";

type FeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  categories?: string[];
};

export type LegalAlert = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string | null;
  excerpt: string;
  categories: string[];
};

type LegalAlertOptions = {
  terms?: readonly string[];
};

const parser = new Parser<Record<string, never>, FeedItem>();

const sources = [
  {
    url: "https://www.stj.jus.br/hrestp-c-portalp/RSS.xml",
    source: "STJ",
  },
  {
    url: "https://www.conjur.com.br/rss.xml",
    source: "ConJur",
  },
] as const;

function normalizeDate(item: FeedItem) {
  return item.isoDate ?? item.pubDate ?? null;
}

function createId(url: string) {
  return Buffer.from(url).toString("base64");
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesTerms(alert: LegalAlert, terms: readonly string[] = []) {
  if (terms.length === 0) {
    return true;
  }

  const haystack = normalizeText(
    [
    alert.title,
    alert.excerpt,
    alert.source,
    ...alert.categories,
    ].join(" "),
  );

  return terms.some((term) => haystack.includes(normalizeText(term)));
}

export async function getLegalAlerts(
  limit = 10,
  options: LegalAlertOptions = {},
): Promise<LegalAlert[]> {
  const feedResults = await Promise.all(
    sources.map(async (feedSource) => {
      try {
        const feed = await parser.parseURL(feedSource.url);

        return (feed.items ?? []).map((item) => ({
          id: createId(item.link ?? `${feedSource.source}-${item.title ?? "alerta"}`),
          title: item.title?.trim() || "Alerta jurídico sem título",
          url: item.link?.trim() || feedSource.url,
          source: feedSource.source,
          publishedAt: normalizeDate(item),
          excerpt:
            item.contentSnippet?.trim() ||
            "Atualização jurídica relevante para acompanhamento estratégico do escritório.",
          categories: item.categories ?? [],
        }));
      } catch {
        return [];
      }
    }),
  );

  return feedResults
    .flat()
    .filter((alert) => matchesTerms(alert, options.terms))
    .sort((first, second) => {
      const firstDate = first.publishedAt ? new Date(first.publishedAt).getTime() : 0;
      const secondDate = second.publishedAt ? new Date(second.publishedAt).getTime() : 0;
      return secondDate - firstDate;
    })
    .slice(0, limit);
}
