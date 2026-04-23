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
        {sections.map(parsedSection => <MDSection section={parsedSection} key={parsedSection.id} />)}
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

    return <div key={section.id} className="MDSection">
        <h2 
            key={section.id} 
            className="sectionHeader unselectable" 
            onClick={() => toggleContents()}
        >{section.sectionHeader.content}</h2>
        {viewContents && <div className="contents">
            {components}
        </div>}
    </div>
}


const h3Comp = (content: string | null, id: string) => <h3 key={id + " " + 1}>{content}</h3>
const liComp = (content: string | null, id: string) => <li key={id + " " + 2}>{content}</li>
const pComp = (content: string | null, id: string) => {
    if (content === null) return <></>

    const result = [];
    const newLineSplit = content.split('\n');
    const strongRegex = /(\*\*|__)(.*?)\1/;
    const emRegex = /(?<!\*)\*([^*]+)\*(?!\*)/;
    let i = 0;
    for (const line of newLineSplit) {
        if (strongRegex.test(line)) {
            result.push(<p key={id + " " + i++}><b>{line.replace(/\*\*/g, '')}</b></p>)
        }
        else if (emRegex.test(line)) {
            result.push(<p key={id + " " + i++}><em>{line.replace(/\*/g, '')}</em></p>)
        } else {
            result.push(<p key={id + " " + i++}>{line}</p>);
        }
    }
    return result;
}
const aComp = (content: string | null, href: string | null, id: string) => {
    if (content === null || href === null) return <></>
    return <p>
        <a key={id} href={href} target="_blank" rel="noopener noreferrer">{content}</a>
    </p>
}

const parsedTokenToComponent = (token: ParsedToken): JSX.Element | JSX.Element[] | null => {
    if (token.type === 'h3') {
        return h3Comp(token.content, token.id)
    }
    if (token.type === 'p') {
        return pComp(token.content, token.id)
    }
    if (token.type === 'li') {
        return liComp(token.content, token.id)
    }
    if (token.type === 'a') {
        return aComp(token.content, token.secondaryContent ?? null, token.id)
    }
    return null;
}

const isListType = (type: string) => type === 'li' || type === 'ul';
const parseTokenListToComponent = (tokens: ParsedToken[]): JSX.Element => {
    const headToken = tokens.shift();
    if (headToken?.type === 'ul') {
        return <ul key={headToken.id + " " + 0}>{tokens.map(toke => parsedTokenToComponent(toke))}</ul>
    }
    return <></>
}