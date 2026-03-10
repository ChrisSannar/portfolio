import * as React from 'react';
import { Token } from 'markdown-it';

import './MDParser.css';

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
        {sections.map(parsedSection => <MDSection section={parsedSection} />)}
    </div>
}

export const MDSection: React.FC<{ section: ParsedTokenSection }> = ({ section }) => {
    const [viewContents, setViewContents] = React.useState(true);
    const components = React.useMemo(() => {
        const components = [];
        let tokenList: ParsedToken[] = [];
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
        return components;
    }, [section]);

    const toggleContents = () => setViewContents(view => !view);

    return <div className="MDSection">
        <h2 className="sectionHeader" onClick={() => toggleContents()}>{section.sectionHeader.content}</h2>
        {viewContents && <div className="contents">
            {components}
        </div>}
    </div>
}


const h3Comp = (content: string | null) => <h3>{content}</h3>
const liComp = (content: string | null) => <li>{content}</li>
const pComp = (content: string | null) => {
    if (content === null) return <></>

    const result = [];
    const newLineSplit = content.split('\n');
    const emRegex = /(\*{1,2})(.*?)\1/g;
    for (const line of newLineSplit) {
        if (emRegex.test(line)) {
            result.push(<p><em>{line.replace(/\*{1,2}/g, '')}</em></p>)
        } else {
            result.push(<p>{line}</p>);
        }
    }
    return result;
}

const parsedTokenToComponent = (token: ParsedToken): JSX.Element | JSX.Element[] | null => {
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