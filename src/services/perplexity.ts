const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

if (!PERPLEXITY_API_KEY) {
  throw new Error('VITE_PERPLEXITY_API_KEY 환경변수가 설정되어 있지 않습니다.');
}

export type PerplexityMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function createPerplexityCompletion(messages: PerplexityMessage[], model = 'sonar-medium-online', options: Partial<{ temperature: number; max_tokens: number }> = {}) {
  const res = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      ...options,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Perplexity API 오류: ${res.status} ${error}`);
  }

  const data = await res.json();
  return data;
}

// 사용 예시:
// const response = await createPerplexityCompletion([
//   { role: 'system', content: 'You are a helpful assistant.' },
//   { role: 'user', content: '안녕, 오늘 할 일 추천해줘.' }
// ]); 