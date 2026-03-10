import { Token } from 'markdown-it';

export type TokenType = 'h2' | 'h3' | 'p' | 'ul' | 'li' | null;
export type ModifyType = 'em' | 'strong' | null;
export interface ParsedToken {
    type: TokenType;
    modify: ModifyType
    content: string | null;
    listEnd?: boolean;
}
export interface ParsedTokenSection {
    parsedTokens: ParsedToken[];
}

const breakDownInline = (tokens: Token[]): ParsedToken[] => {
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
                type: 'ul',
                modify: null,
                content: null,
            });
        }
        else if (toke.type === "bullet_list_close") {
            result.push({
                type: 'ul',
                modify: null,
                content: null,
                listEnd: true,
            });
        }

        if (toke.type === 'inline') {
            if (currentTag === 'h2' || currentTag === 'h3') {
                result.push({
                    type: currentTag,
                    modify: null,
                    content: toke.content
                });
            }
            else if (currentTag === 'p') {
                result.push({
                    type: 'p',
                    modify: null,
                    content: toke.content
                });
            }
            else if (currentTag === 'li') {
                result.push({
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
// const breakdownParagraphContent = (content: string): ParsedToken[] | string => {
//     const newLineSplit = content.split('\n');
//     if (newLineSplit.length === 1) {
//         return content;
//     }
 
//     const result: ParsedToken[] = [];
//     for (const line of newLineSplit) {
//         const emRegex = /(\*{1,2})(.*?)\1/g;
//         if (emRegex.test(line)) {
//             const mod = line.includes('**') ? 'strong' : 'em';
//             result.push({
//                 type: 'p',
//                 modify: mod,
//                 content: line.replace(/\*{1,2}/g, '')
//             });
//             continue;
//         }

//         result.push({
//             type: 'p',
//             modify: null,
//             content: line
//         });
//     }
//     return result;
// }

const divideParsedTokensIntoSections = (tokens: ParsedToken[], splitter: TokenType): ParsedTokenSection[] => {
    const result: ParsedTokenSection[] = [];

    let nextSection: ParsedToken[] = [];
    for (const toke of tokens) {
        if (toke.type === splitter) {
            if (nextSection.length !== 0) {
                result.push({
                    parsedTokens: nextSection,
                });
                nextSection = [];
            }
            nextSection.push(toke);
        } else {
            nextSection.push(toke);
        }
    }
    result.push({
        parsedTokens: nextSection
    })

    return result;
}

export const parseTokens = (tokens: Token[]): ParsedTokenSection[] => {

    const parsed: ParsedToken[] = breakDownInline(tokens);
    const sections: ParsedTokenSection[] = divideParsedTokensIntoSections(parsed, 'h2');
    return sections;
}