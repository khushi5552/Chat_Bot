const dotenv = require('dotenv');

dotenv.config({ path: '../../.env.local' });

class OllamaService {
  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'gemma:2b';
    this.currentController = null;
  }

  async generateResponse(prompt, onChunk) {
    try {
      this.currentController = new AbortController();
      
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: true,
        }),
        signal: this.currentController.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              onChunk(data.response);
            }
          } catch (e) {
            // Skip invalid JSON lines
            continue;
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Generation was aborted');
        return;
      }
      console.error('Ollama service error:', error);
      throw error;
    } finally {
      this.currentController = null;
    }
  }

  stopGeneration() {
    if (this.currentController) {
      this.currentController.abort();
      this.currentController = null;
    }
  }
}

module.exports = new OllamaService();