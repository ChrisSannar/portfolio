
const sendLLMQueryToServer = async (query: string, test: boolean = false) => {
    const response = await fetch(process.env.REACT_APP_PORTFOLIO_SERVE_URL + '/' + (test ? 'llm-test' : 'llm'), {
        method: 'POST',
        body: query,
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

export { sendLLMQueryToServer };