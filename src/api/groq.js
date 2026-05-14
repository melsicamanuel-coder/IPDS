const GROQ_API_KEY =
  import.meta.env.VITE_GROQ_API_KEY;

export async function callGroq(

  apiKey,

  systemPrompt,

  userMessage

) {

  const response = await fetch(

    'https://api.groq.com/openai/v1/chat/completions',

    {

      method: 'POST',

      headers: {

        Authorization: `Bearer ${GROQ_API_KEY}`,

        'Content-Type': 'application/json',

      },

      body: JSON.stringify({

        model: 'llama-3.1-8b-instant',

        messages: [

          {

            role: 'system',

            content: systemPrompt,

          },

          {

            role: 'user',

            content: userMessage,

          },

        ],

        temperature: 0.4,

        max_tokens: 120,

      }),

    }

  );

  if (!response.ok) {

    const errorText =
      await response.text();

    console.error(
      'Groq API Error:',
      errorText
    );

    throw new Error(

      `Groq API failed: ${response.status}`

    );

  }

  const data = await response.json();

  console.log(
    'GROQ RESPONSE:',
    data
  );

  return (

    data?.choices?.[0]?.message?.content ||

    'No output generated.'

  );

}

export async function callGroqJSON(

  apiKey,

  systemPrompt,

  userMessage

) {

  const response = await fetch(

    'https://api.groq.com/openai/v1/chat/completions',

    {

      method: 'POST',

      headers: {

        Authorization: `Bearer ${GROQ_API_KEY}`,

        'Content-Type': 'application/json',

      },

      body: JSON.stringify({

        model: 'llama-3.1-8b-instant',

        messages: [

          {

            role: 'system',

            content: systemPrompt,

          },

          {

            role: 'user',

            content: userMessage,

          },

        ],

        temperature: 0.2,

        max_tokens: 120,

        response_format: {

          type: 'json_object',

        },

      }),

    }

  );

  if (!response.ok) {

    const errorText =
      await response.text();

    console.error(
      'Groq JSON Error:',
      errorText
    );

    throw new Error(

      `Groq API failed: ${response.status}`

    );

  }

  const data = await response.json();

  console.log(
    'GROQ JSON RESPONSE:',
    data
  );

  try {

    return JSON.parse(

      data?.choices?.[0]?.message?.content ||

      '{}'

    );

  }

  catch {

    return {};

  }

}