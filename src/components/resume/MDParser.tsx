import * as React from 'react';
import { Token } from 'markdown-it';

import { ModifyType, multiplexer, ParsedToken } from './tokenParser';

interface IMDParser {
    tokens: Token[];
}

export const parsedTokenToComponent = (token: ParsedToken) => {
    if (token.content instanceof Array) {
        if (token.type === 'ul') {
            return <ULParsed content={token.content} />;
        }
        return <MultiPParsed content={token.content}/>;
    }
    switch (token.type) {
        case 'h2':
            return <H2Parsed content={token.content} />;
        case 'h3': 
            return <H3Parsed content={token.content} />;
        case 'p':
            return <PParsed content={token.content} mod={token.modify}/>;
        case 'li': 
            return token.content;
        default:
            return null;
    }
}

const H2Parsed: React.FC<{ content: string }> = ({ content }) => {
    return <h2>{content}</h2>
}
const H3Parsed: React.FC<{ content: string }> = ({ content }) => {
    return <h3>{content}</h3>
}
const PParsed: React.FC<{ content: string, mod: ModifyType }> = ({ content, mod }) => {
    if (mod === 'em') {
        return <p><em>{content}</em></p>
    } else if (mod === 'strong') {
        return <p><strong>{content}</strong></p>
    }
    return <p>{content}</p>
}
const MultiPParsed: React.FC<{ content: ParsedToken[] }> = ({ content }) => {
    return <>
        {content.map((childToken, index) => 
            <PParsed 
                key={index} 
                mod={childToken.modify}
                content={childToken.content as string} 
            />)}
    </>
}
const ULParsed: React.FC<{ content: ParsedToken[] }> = ({ content }) => {
    return <ul>
        {content.map((childToken, index) => <li key={index}>{parsedTokenToComponent(childToken)}</li>)}
    </ul>
}

export const MDParser: React.FC<IMDParser> = ({
    tokens
}) => {
    const [parsedTokens, setParsedTokens] = React.useState<ParsedToken[]>([]);

    React.useEffect(() => {
        const mux = multiplexer();
        const newTokens = [];
        for (const toke of tokens) {
            const newToken = mux(toke);
            if (newToken.type !== 'default') {
                newTokens.push(newToken);
            }
        }
        setParsedTokens(newTokens);
    }, [tokens]);

    return <div className='MDParser'>
        {parsedTokens.map((token, index) => parsedTokenToComponent(token))}
    </div>
}