const fetch = require("node-fetch");
const { createClient } = require("@google/generativeai");

exports.handler = async (event) => {
  const { destination, slug } = JSON.parse(event.body);
  const client = createClient(process.env.GOOGLE_API_KEY);

  // 1) Generate summary via Gemini
  const res = await client.generateText({
    model: "gemini-2-flash-lite",
    prompt: `Give me a concise 2-line summary of the content at: ${destination}`,
    maxOutputTokens: 80,
  });
  const summary = res.text.trim();

  // 2) Call Hasura GraphQL to insert new URL record
  const mutation = `
    mutation InsertUrl($dest: String!, $slug: String, $summary: String!) {
      insert_url_one(object: {
        destination: $dest,
        slug: $slug,
        summary: $summary,
        owner_id: ${event.requestContext.authorizer.jwt.claims.sub}
      }) {
        id slug destination summary owner_id created_at
      }
    }
  `;
  const variables = { dest: destination, slug, summary };

  const gqlRes = await fetch(process.env.NHOST_HASURA_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": process.env.AUTH_ADMIN_SECRET,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });
  const { data, errors } = await gqlRes.json();
  if (errors) throw new Error(JSON.stringify(errors));

  return {
    statusCode: 200,
    body: JSON.stringify(data.insert_url_one),
  };
};
