// supabase/functions/gemini-proxy/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const APP_SECRET = "itay_Va8BYl7RKiXOjdbKoQtGLM6EqCkDKNna7RHC1Bd2bA+oyCKkH+wJgabdRNA="
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const requestSecret = req.headers.get("X-App-Secret");
    if (requestSecret !== APP_SECRET) {
      console.error("[Auth] Invalid X-App-Secret");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
      });
    }

    const { prompt } = await req.json()
    console.log(`[Gemini] Received prompt: ${prompt.substring(0, 50)}...`);

    if (!GEMINI_API_KEY) {
      console.error("[Config] GEMINI_API_KEY is missing in Deno.env");
      throw new Error("API Key missing");
    }

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ]
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error("[Google API Error]", JSON.stringify(data));
      throw new Error(`Google API returned ${response.status}`);
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      console.warn("[Gemini] No candidates returned. Full response:", JSON.stringify(data));
      // If blocked by safety, explain why if possible
      if (data.promptFeedback?.blockReason) {
        return new Response(JSON.stringify({ text: `[Blocked: ${data.promptFeedback.blockReason}]` }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      return new Response(JSON.stringify({ text: "No response (possibly blocked by safety filters)" }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    console.log(`[Gemini] Success. Response length: ${resultText.length}`);
    return new Response(JSON.stringify({ text: resultText }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })

  } catch (error: any) {
    console.error("[Proxy Error]", error.message);
    return new Response(JSON.stringify({ text: "Error", details: error.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
})
