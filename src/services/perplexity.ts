// 환경 변수 로딩 (Node.js 서버/브라우저 모두 지원)
let PERPLEXITY_API_KEY = '';
if (typeof process !== 'undefined' && process.env && process.env.PERPLEXITY_API_KEY) {
  PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
} else {
  // Vite(브라우저) 환경에서만 import.meta.env 사용 (Node.js에서는 문법 에러 방지)
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PERPLEXITY_API_KEY) {
      PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
    }
  } catch (e) {
    // Node.js 환경에서는 import.meta 자체가 문법적으로 불가하므로 무시
  }
}

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

if (!PERPLEXITY_API_KEY) {
  throw new Error('PERPLEXITY_API_KEY (서버) 또는 VITE_PERPLEXITY_API_KEY (클라이언트) 환경변수가 설정되어 있지 않습니다.');
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