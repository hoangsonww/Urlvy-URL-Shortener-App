const fetch = require("node-fetch");
const { createClient } = require("@google/generativeai");

exports.handler = async (event) => {
  const { slug, question } = JSON.parse(event.body);

  // 1) Query Hasura for click stats
  const query = `
    query Stats($slug: String!) {
      url(where: {slug: {_eq: $slug}}) {
        clicks {
          created_at
        }
      }
    }
  `;
  const gqlRes = await fetch(process.env.NHOST_HASURA_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": process.env.AUTH_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables: { slug } }),
  });
  const { data, errors } = await gqlRes.json();
  if (errors) throw new Error(JSON.stringify(errors));

  const counts = data.url[0].clicks
    .map((c) => c.created_at)
    .reduce((acc, ts) => {
      const day = ts.split("T")[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

  // 2) Prompt Gemini with stats + question
  const client = createClient(process.env.GOOGLE_API_KEY);
  const statsText = Object.entries(counts)
    .map(([day, cnt]) => `• ${day}: ${cnt}`)
    .join("\n");
  const prompt = `
    You are UrlvyStatsBot. Here are the daily click counts for "${slug}":
    ${statsText}

    Q: ${question}
    A:
  `;
  const res = await client.generateText({
    model: "gemini-2-flash-lite",
    prompt,
    maxOutputTokens: 150,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ answer: res.text.trim() }),
  };
};
