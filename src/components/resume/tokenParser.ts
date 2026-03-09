import { Token } from 'markdown-it';

export interface ParsedToken {
    type: 'h2' | 'p' | 'default';
    content: string;
}

const defaultToken = (): ParsedToken => ({
    type: 'default',
    content: ''
});

enum MultiplexerState {
    DEFAULT = 'default',
    // H1 = 'h1',
    H2 = 'h2',
    // H3 = 'h3',
    P = 'p'
}
export const multiplexer = () => {
    let state: MultiplexerState = MultiplexerState.DEFAULT;
    return (token: Token): ParsedToken => {
        if (token.type === 'heading_open' && token.tag === 'h2') {
            state = MultiplexerState.H2;
        }
        else if (token.type === 'paragraph_open') {
            state = MultiplexerState.P;
        }
        else if (token.type === 'inline') {
            if (state === MultiplexerState.H2) {
                return {
                    type: 'h2',
                    content: token.content
                } as ParsedToken;
            }
            else if (state === MultiplexerState.P) {
                return {
                    type: 'p',
                    content: token.content
                } as ParsedToken;
            }
        }
        else if (
            token.type === 'heading_close' || 
            token.type === 'paragraph_close'
        ) {
            state = MultiplexerState.DEFAULT;
        }
        return defaultToken();
    }
}