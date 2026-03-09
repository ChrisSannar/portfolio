import * as React from 'react';
import { Token } from 'markdown-it';

import { multiplexer, ParsedToken } from './tokenParser';

interface IMDParser {
    tokens: Token[];
}

export const parsedTokenToComponent = (token: ParsedToken) => {
    if (token.content instanceof Array) {
        return <ULParsed content={token.content} />;
    }
    switch (token.type) {
        case 'h2':
            return <H2Parsed content={token.content} />;
        case 'p':
            return <PParsed content={token.content} />;
        case 'li': 
            return token.content;
        default:
            return null;
    }
}

const H2Parsed: React.FC<{ content: string }> = ({ content }) => {
    return <h2>{content}</h2>
}
const PParsed: React.FC<{ content: string }> = ({ content }) => {
    return <p>{content}</p>
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