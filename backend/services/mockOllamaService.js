class MockOllamaService {
  constructor() {
    this.currentController = null;
  }

  async generateResponse(prompt, onChunk) {
    try {
      this.currentController = new AbortController();

      const mockResponse = `I understand you're asking about: "${prompt}". This is a mock response to test the chat interface. The streaming functionality is working correctly, and each word appears gradually to simulate real AI responses. You can test creating new chats, switching between conversations, and all the UI features while we resolve the Ollama connection.`;

      const words = mockResponse.split(' ');

      for (let i = 0; i < words.length; i++) {
        if (this.currentController.signal.aborted) break;

        const word = words[i] + (i < words.length - 1 ? ' ' : '');
        onChunk(word);

        await new Promise(resolve => setTimeout(resolve, 100)); // simulate delay
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Generation was aborted');
        return;
      }
      console.error('Mock service error:', error);
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

module.exports = new MockOllamaService();
