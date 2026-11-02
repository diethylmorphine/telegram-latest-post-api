const DEFAULT_CHANNEL_USERNAME = "iamdiethylmorphine";

export function extractLatestPostId(html, channel) {
  const escapedChannel = channel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`data-post=["']${escapedChannel}/(\\d+)["']`, "g");
  const ids = [];
  for (const match of html.matchAll(pattern)) {
    const id = Number(match[1]);
    if (Number.isSafeInteger(id) && id > 0) ids.push(id);
  }
  return ids.length ? Math.max(...ids) : null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const channel = process.env.TELEGRAM_CHANNEL_USERNAME || DEFAULT_CHANNEL_USERNAME;
  if (!/^[A-Za-z0-9_]{5,32}$/.test(channel)) {
    return res.status(500).json({ success: false, error: "Channel configuration is invalid" });
  }

  try {
    const response = await fetch(`https://t.me/s/${channel}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TelegramLatestPostAPI/1.0)",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("upstream request failed");

    const html = await response.text();
    const latestPostId = extractLatestPostId(html, channel);
    if (latestPostId === null) {
      return res.status(404).json({ success: false, error: "No posts found", channel });
    }

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
    return res.status(200).json({
      success: true,
      channel,
      latest_post_id: latestPostId,
      post_url: `https://t.me/${channel}/${latestPostId}`,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return res.status(502).json({ success: false, error: "Failed to fetch latest post" });
  }
}
