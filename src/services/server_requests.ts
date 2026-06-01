
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

export { sendLLMQueryToServer };
