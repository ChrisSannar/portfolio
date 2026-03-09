import * as React from 'react';
import { Token } from 'markdown-it-ts';

interface IMDParser {
    tokens: Token[];
}

export const MDParser: React.FC<IMDParser> = ({
    tokens
}) => {
    return <div>
        {tokens.map((token, index) => {
            // Handle other token types as needed
            return null;
        })}
    </div>
}