import { Token } from 'markdown-it';

export type TokenType = 'h2' | 'h3' | 'p' | 'ul' | 'li' | 'default';
export type ModifyType = 'em' | 'strong' | null;
export interface ParsedToken {
    type: TokenType;
    modify: ModifyType
    content: string | ParsedToken[];
}

const defaultToken = (): ParsedToken => ({
    type: 'default',
    modify: null,
    content: ''
});
const breakdownParagraphContent = (content: string): ParsedToken[] | string => {
    const newLineSplit = content.split('\n');
    if (newLineSplit.length === 1) {
        return content;
    }

    const result: ParsedToken[] = [];
    for (const line of newLineSplit) {
        const emRegex = /(\*{1,2})(.*?)\1/g;
        if (emRegex.test(line)) {
            const mod = line.includes('**') ? 'strong' : 'em';
            result.push({
                type: 'p',
                modify: mod,
                content: line.replace(/\*{1,2}/g, '')
            });
            continue;
        }

        result.push({
            type: 'p',
            modify: null,
            content: line
        });
    }
    console.log('result', result);
    return result;
}

enum MultiplexerState {
    DEFAULT = 'default',
    // H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    P = 'p',
    UL = 'ul'
}
export const multiplexer = () => {
    let state: MultiplexerState = MultiplexerState.DEFAULT;
    let listState: ParsedToken[] = [];
    return (token: Token): ParsedToken => {
        // ***
        if (token.content.includes("2021") || token.content.includes("passion")) {
            console.log(token, state);
        }
        // ***
        // console.log(token);
        if (token.type === 'heading_open' && token.tag === 'h2') {
            if (token.tag === 'h2') {
                state = MultiplexerState.H2;
            }
            else if (token.tag === 'h3') {
                state = MultiplexerState.H3;
            }
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
            state = MultiplexerState.DEFAULT;
            return {
                type: 'ul',
                modify: null,
                content: temp
            } as ParsedToken;
        }

        else if (token.type === 'inline') {
            if (state === MultiplexerState.H2) {
                return {
                    type: 'h2',
                    modify: null,
                    content: token.content
                } as ParsedToken;
            }
            else if (state === MultiplexerState.H3) {
                return {
                    type: 'h3',
                    modify: null,
                    content: token.content
                } as ParsedToken;
            }
            else if (state === MultiplexerState.P) {
                return {
                    type: 'p',
                    modify: null,
                    content: breakdownParagraphContent(token.content)
                } as ParsedToken;
            }
            else if (state === MultiplexerState.UL) {
                listState.push({
                    type: 'li',
                    modify: null,
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