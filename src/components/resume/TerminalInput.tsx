import * as React from 'react';
import './TerminalInput.css'; 
import { sendLLMQueryToServer, sendLLMQueryToServerTEST } from '../../services/server_requests';

interface ITerminalInput {}

interface IResponse {
    id: string;
    error?: boolean;
    output: string[];
}

const DEFAULT_BOX_VALUE = [
    "Welcome to the interactive terminal.",
    "You can ask specific questions about my resume, projects, or skills here through a language model interface.",
];

export const TerminalInput: React.FC<ITerminalInput> = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState<string>('');
    const [inputFocused, setInputFocused] = React.useState<boolean>(false);
    const [boxValue, setBoxValue] = React.useState<string[]>(DEFAULT_BOX_VALUE);
    const [loadingResponse, setLoadingResponse] = React.useState<boolean>(false);
    const [responses, setResponses] = React.useState<IResponse[]>([]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    // const submitQuery = (query: string) => {
    //     if (!query.trim()) {
    //         return;
    //     }
    //     setLoadingResponse(true);
    //     sendLLMQueryToServer(query).then(response => {
    //         setLoadingResponse(false);
    //         setBoxValue(response.output);
    //         setInputValue('');
    //     }).catch(error => {
    //         setBoxValue(['There was an error responding to your input.', 'Please try again later.']);
    //     });
    // }

    const addResponse = (response: IResponse) => {
        setResponses(prev => [...prev, response]);
    }

    const submitQuery = (query: string) => {
        if (!query.trim()) {
            return;
        }
        setLoadingResponse(true);
        sendLLMQueryToServerTEST(query).then(response => {
            setLoadingResponse(false);
            // setBoxValue(response.output);
            addResponse(response);
            setInputValue('');
        }).catch(error => {
            setBoxValue(['There was an error responding to your input.', 'Please try again later.']);
        });
    }

    // ***
    // const responseBoxStyle: React.CSSProperties = inputFocused ?
    //     { opacity: 1, visibility: 'visible' } :
    //     { opacity: 0, visibility: 'hidden' };

    const responseBoxStyle: React.CSSProperties = { opacity: 1, visibility: 'visible' };

    return <div className='TerminalInput'>
        {responses.map(resp => (
            <div key={resp.id} className={`response-box`} style={responseBoxStyle}>
                <div className="inner-box-content">
                    <PrinterContent content={resp.output} activate={resp.output.length > 0} />
                </div>
            </div>
        ))}
        {loadingResponse && <div className={`response-box loading`} style={responseBoxStyle}>
            <LoadingResponse />
        </div>}
        <input
            className="terminal-input" 
            alt="llm query input"
            type='text' 
            ref={inputRef}
            value={inputValue}
            disabled={loadingResponse}
            onChange={e => {
                setInputValue(e.target.value);
            }}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    submitQuery(inputValue);
                }
            }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder='Ctrl + /'
        />
    </div>
}

interface IPrinterContent {
    content: string[];
    activate: boolean;
    printSpeed?: number;
}
const PrinterContent: React.FC<IPrinterContent> = ({ 
    content, 
    activate, 
    printSpeed = 20,
}) => {
    const [displayedContent, setDisplayedContent] = React.useState<string[]>([]);

    React.useEffect(() => {
        const splitContent: string[][] = content.map(line => line.split(''));
        async function printContent(splitContent: string[][]) {
            for (const lineIdx in splitContent) {
                const line = splitContent[lineIdx];
                let lineStr = "";
                for (const tokenIdx in line) {
                    lineStr += line[tokenIdx];
                    setDisplayedContent(prev => {
                        const newContent = [...prev];
                        newContent[lineIdx] = lineStr;
                        return newContent;
                    });
                    await new Promise(resolve => setTimeout(resolve, printSpeed));
                }
                setDisplayedContent(prev => [...prev]); 
            }
        }
        if (activate){
            printContent(splitContent);
        }
    }
    , [activate]);

    return <>
        {displayedContent.map((val, idx) => <p key={val + ":" + idx}>{val}</p>)}
    </>
}

interface ILoadingResponse {
    rate?: number;
}
const LoadingResponse: React.FC<ILoadingResponse> = ({ rate = 200 }) => {
    const [dots, setDots] = React.useState<string>('');
    
    React.useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length < 6 ? prev + '. ' : '');
        }, rate);
        return () => clearInterval(interval);
    }, []);

    const loadingStyle: React.CSSProperties = {
        fontStyle: 'italic',
        height: '1rem', 
        paddingBottom: '0',
        wordSpacing: '-0.5rem',
    };

    return <p className="loading-indicator inner-box-content" style={loadingStyle}>{dots}</p>
}