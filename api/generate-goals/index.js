try {
  const { createPerplexityCompletion } = require('../../src/services/perplexity');

  module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON' });
      }
    }

    const { dream, deadline } = body || {};
    if (!dream || !deadline) {
      return res.status(400).json({ error: 'dream, deadline required' });
    }

    const messages = [
      { role: 'system', content: '너는 목표 코치야. 사용자의 꿈과 기한을 바탕으로 구체적이고 실행 가능한 목표(일간/주간/월간)를 제안해줘.' },
      { role: 'user', content: `내 꿈: ${dream}\n기한: ${deadline}\n목표를 단계별로 제안해줘.` }
    ];

    try {
      const aiRes = await createPerplexityCompletion(messages, 'llama-3-sonar-large-32k-online', { temperature: 0.7 });
      res.status(200).json({ goals: aiRes.choices?.[0]?.message?.content || '' });
    } catch (e) {
      console.error('Handler error:', e);
      res.status(500).json({ error: String(e) });
    }
  };
} catch (e) {
  // Vercel 로그에 반드시 남도록
  console.error('API Route Fatal Error:', e);
  // 에러 발생 시 모든 요청에 대해 500 반환
  module.exports = (req, res) => {
    res.status(500).json({ error: 'API Route Fatal Error: ' + String(e) });
  };
} 