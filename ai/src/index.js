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

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
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