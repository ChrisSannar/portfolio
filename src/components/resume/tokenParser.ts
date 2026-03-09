import { Token } from 'markdown-it';

export interface ParsedToken {
    type: 'h2' | 'p' | 'ul' | 'li' | 'default';
    content: string | ParsedToken[];
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
    P = 'p',
    UL = 'ul'
}
export const multiplexer = () => {
    let state: MultiplexerState = MultiplexerState.DEFAULT;
    let listState: ParsedToken[] = [];
    return (token: Token): ParsedToken => {
        // console.log(token.type, token.content, state);
        if (token.type === 'heading_open' && token.tag === 'h2') {
            state = MultiplexerState.H2;
        }
        else if (token.type === 'paragraph_open') {
            if (state !== MultiplexerState.UL) {
                state = MultiplexerState.P;
            }
        }
        else if (token.type === 'bullet_list_open' || token.type === 'list_item_open') {
            state = MultiplexerState.UL;
        }
        else if (token.type === 'bullet_list_close') {
            const temp = [...listState];
            listState = [];
            return {
                type: 'ul',
                content: temp
            } as ParsedToken;
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
            else if (state === MultiplexerState.UL) {
                listState.push({
                    type: 'li',
                    content: token.content
                } as ParsedToken);
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