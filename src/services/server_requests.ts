
export interface ILLMResponse {
    id: string;
    error?: boolean;
    output: string[];
}

const getNewResponseId = (): string => {
    return Math.random().toString(36).substr(2, 9);
}

const formatLLMResponseText = (response: string): string[] => {
    if (typeof response !== 'string') {
        return ['Unsupported response format'];
    } 
    
    return response.split('\n');
}

const sendLLMQueryToServer = async (query: string) => {
    const response = await fetch('/llm', {
        method: 'POST',
        body: query,
    });
    if (!response.ok) {
        return {
            id: getNewResponseId(),
            error: true,
            output: [`Server error: ${response.statusText}`],
        } as ILLMResponse;
    }
    const resp = await response.json();
    return {
        id: getNewResponseId(),
        output: formatLLMResponseText(resp.output),
    } as ILLMResponse;
}

const sendLLMQueryToServerTEST = async (query: string) => {
    return new Promise<ILLMResponse>((resolve) => {
        setTimeout(() => {
            resolve({
                id: getNewResponseId(),
                output: [
                    `You asked: ${query}`,
                    "This is a simulated response for testing purposes.",
                    "In a real implementation, this would be the response from the server.",
                ],
            });
        }, 1000);
    });
}

export { sendLLMQueryToServer, sendLLMQueryToServerTEST };
