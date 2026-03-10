import * as React from 'react';
import { Token } from 'markdown-it';

import { 
    ParsedToken, 
    ParsedTokenSection, 
    parseTokens 
} from './tokenParser';

interface IMDParser {
    tokens: Token[];
}
export const MDParser: React.FC<IMDParser> = ({
    tokens
}) => {
    const [sections, setSections] = React.useState<ParsedTokenSection[]>([]);
    React.useEffect(() => {
        setSections(parseTokens(tokens));
    }, [tokens])

    return <div className="MDParser">
        {sections.map(parsedSection => parsedSectionToComponent(parsedSection))}
    </div>
}


const h2Comp = (content: string | null) => <h2>{content}</h2>
const h3Comp = (content: string | null) => <h3>{content}</h3>
const pComp = (content: string | null) => <p>{content}</p>
const liComp = (content: string | null) => <li>{content}</li>

const parsedTokenToComponent = (token: ParsedToken): JSX.Element | null => {
    if (token.type === 'h2') {
        return h2Comp(token.content);
    }
    if (token.type === 'h3') {
        return h3Comp(token.content)
    }
    if (token.type === 'p') {
        return pComp(token.content)
    }
    if (token.type === 'li') {
        return liComp(token.content)
    }
    return null;
}

const isListType = (type: string) => type === 'li' || type === 'ul';
const parseTokenListToComponent = (tokens: ParsedToken[]): JSX.Element => {
    const headToken = tokens.shift();
    if (headToken?.type === 'ul') {
        return <ul>{tokens.map(toke => parsedTokenToComponent(toke))}</ul>
    }
    return <></>
}

const parsedSectionToComponent = (section: ParsedTokenSection) => {
    const components = [];
    let tokenList: ParsedToken[] = []
    for (const token of section.parsedTokens) {
        if (token.listEnd) {
            components.push(parseTokenListToComponent(tokenList));
            tokenList = [];
        }

        if (isListType(token.type ?? '')) {
            tokenList.push(token);
        } else {
            components.push(parsedTokenToComponent(token));
        }
    }

    return <div className='section'>
        {components}
    </div>
}