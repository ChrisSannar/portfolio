import { Token } from 'markdown-it';

const randomKey = () => Math.random().toString(16).slice(2);

export type TokenType = 'h2' | 'h3' | 'p' | 'ul' | 'li' | 'a' | null;
export type ModifyType = 'em' | 'strong' | null;
export interface ParsedToken {
    id: string;
    type: TokenType;
    modify: ModifyType;
    content: string | null;
    secondaryContent?: string | null;
    listEnd?: boolean;
}
export interface ParsedTokenSection {
    id: string;
    sectionHeader: ParsedToken;
    parsedTokens: ParsedToken[];
}

const breakDownInline = (tokens: Token[]): ParsedToken[] => {
    // console.log("tokes", tokens);
    const result: ParsedToken[] = [];
    let currentTag: TokenType = null;
    for (const toke of tokens) {
        if (toke.type === 'heading_open') {
            if (toke.tag === 'h2') {
                currentTag = 'h2'
            } 
            else if (toke.tag === 'h3') {
                currentTag = 'h3'
            }
        }
        else if (toke.type === 'paragraph_open') {
            if (currentTag !== 'li') {
                currentTag = 'p'
            }
        }
        else if (toke.type === 'list_item_open') {
            currentTag = 'li'
        }
        else if (toke.type === "bullet_list_open") {
            result.push({
                id: randomKey(),
                type: 'ul',
                modify: null,
                content: null,
            });
        }
        else if (toke.type === "bullet_list_close") {
            result.push({
                id: randomKey(),
                type: 'ul',
                modify: null,
                content: null,
                listEnd: true,
            });
        }

        if (toke.type === 'inline') {
            if (toke.children?.length === 3) {
                const [open, text, close] = toke.children;
                if (open.type === 'link_open' && close.type === 'link_close') {
                    result.push({
                        id: randomKey(),
                        type: 'a',
                        modify: null,
                        content: text.content,
                        secondaryContent: open.attrGet('href') ?? null,
                    });
                }
            }
            else if (currentTag === 'h2' || currentTag === 'h3') {
                result.push({
                    id: randomKey(),
                    type: currentTag,
                    modify: null,
                    content: toke.content
                });
            }
            else if (currentTag === 'p') {
                result.push({
                    id: randomKey(),
                    type: 'p',
                    modify: null,
                    content: toke.content
                });
            }
            else if (currentTag === 'li') {
                result.push({
                    id: randomKey(),
                    type: 'li',
                    modify: null,
                    content: toke.content
                });
            }
            currentTag = null;
        }
    }
    return result;
}

const divideParsedTokensIntoSections = (tokens: ParsedToken[], splitter: TokenType): ParsedTokenSection[] => {
    const result: ParsedTokenSection[] = [];

    let nextSection: ParsedToken[] = [];
    let lastSectionHeader: ParsedToken | null = null;
    for (const toke of tokens) {
        if (toke.type === splitter) {
            if (nextSection.length !== 0 && lastSectionHeader != null) {
                result.push({
                    id: randomKey(),
                    sectionHeader: lastSectionHeader,
                    parsedTokens: nextSection,
                });
                nextSection = [];
            }
            lastSectionHeader = toke;
        } else {
            nextSection.push(toke);
        }
    }
    if (lastSectionHeader !== null) {
        result.push({
            id: randomKey(),
            sectionHeader: lastSectionHeader,
            parsedTokens: nextSection
        });
    }

    return result;
}

export const parseTokens = (tokens: Token[]): ParsedTokenSection[] => {

    const parsed: ParsedToken[] = breakDownInline(tokens);
    const sections: ParsedTokenSection[] = divideParsedTokensIntoSections(parsed, 'h2');
    return sections;
}