const GROQ_API_KEY =
  import.meta.env.VITE_GROQ_API_KEY;

export async function callGroq(
  apiKey,
  systemPrompt,
  userMessage
) {
  const response = await fetch(
    '/api/groq/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userMessage + '\n\n/no_think',
          },
        ],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API Error:', errorText);
    throw new Error(`Groq API failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('GROQ RESPONSE:', data);

  const msg = data?.choices?.[0]?.message;
  return msg?.content || msg?.reasoning_content || 'No output generated.';
}

export async function callGroqJSON(
  apiKey,
  systemPrompt,
  userMessage
) {
  const response = await fetch(
    '/api/groq/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userMessage + '\n\n/no_think',
          },
        ],
        temperature: 0.2,
        max_tokens: 1024,
        response_format: {
          type: 'json_object',
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq JSON Error:', errorText);
    throw new Error(`Groq API failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('GROQ JSON RESPONSE:', data);

  try {
    const msg = data?.choices?.[0]?.message;
    const text = msg?.content || msg?.reasoning_content || '{}';
    return JSON.parse(text);
  } catch {
    return {};
  }
}
