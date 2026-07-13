export default async function handler(req, res) {
  try {
    const timestamp = Date.now();

    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?timestamp=${timestamp}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch Airtable data" });
    }

    const data = await response.json();

    const images = data.records
      .map((record) => {
        const attachments = record.fields.Attachments;
        return attachments?.[0]?.thumbnails?.full?.url || null;
      })
      .filter(Boolean);

    res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
