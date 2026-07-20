export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method === "GET") {
      return new Response(
        "Gemini Worker is running 🚀",
        {
          headers: corsHeaders
        }
      );
    }

    const { message } = await request.json();

    // Завантажуємо knowledge.json
    const knowledgeResponse = await fetch(
      "https://weband3d.com/knowledge.json"
      
    );

    const knowledge = await knowledgeResponse.json();

    // Перетворюємо JSON у текст
    const siteKnowledge = knowledge
      .map(page => `
Title: ${page.title}
URL: ${page.url}
Knowledge:
${page.knowledge}
`)
      .join("\n-------------------------\n");

    // Запит до Gemini
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `
You are the official AI assistant of WebAnd3D Digital Lab.

You MUST answer ONLY using the Website Knowledge below.

If the answer cannot be found in the Website Knowledge, politely reply that the information is not available on the website.

Do not invent services, prices, technologies or portfolio items.
`
            }]
          },

          contents: [
            {
              parts: [
                {
                  text: `
Website Knowledge:

${siteKnowledge}

--------------------------------

User Question:

${message}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response";

    return Response.json(
      {
        answer: text
      },
      {
        headers: corsHeaders
      }
    );
  }
};