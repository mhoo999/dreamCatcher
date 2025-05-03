// openai 패키지 의존성 없이 타입 직접 정의
export type ChatCompletionRequestMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

if (!OPENAI_API_KEY) {
  throw new Error('VITE_OPENAI_API_KEY 환경변수가 설정되어 있지 않습니다.');
}

export async function createChatCompletion(messages: ChatCompletionRequestMessage[], model = 'gpt-3.5-turbo', options: Partial<{ temperature: number; max_tokens: number }> = {}) {
  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      ...options,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI API 오류: ${res.status} ${error}`);
  }

  const data = await res.json();
  return data;
}

// 사용 예시:
// const response = await createChatCompletion([
//   { role: 'system', content: 'You are a helpful assistant.' },
//   { role: 'user', content: '안녕, 오늘 할 일 추천해줘.' }
// ]); 