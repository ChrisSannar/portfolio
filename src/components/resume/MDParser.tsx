import * as React from 'react';
import { Token } from 'markdown-it';

import { multiplexer, ParsedToken } from './tokenParser';

interface IMDParser {
    tokens: Token[];
}

export const parsedTokenToComponent = (token: ParsedToken) => {
    switch (token.type) {
        case 'h2':
            return <H2Parsed key={token.content} content={token.content} />;
        case 'p':
            return <PParsed key={token.content} content={token.content} />;
        default:
            return null;
    }
}

export const H2Parsed: React.FC<{ content: string }> = ({ content }) => {
    return <h2>{content}</h2>
}
export const PParsed: React.FC<{ content: string }> = ({ content }) => {
    return <p>{content}</p>
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