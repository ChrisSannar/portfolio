import * as React from 'react';
import './TerminalInput.css'; 
import { sendLLMQueryToServer } from '../../services/server_requests';

interface ITerminalInput {}

interface IResponse {
    id: string;
    error?: boolean;
    output: string[];
}

const DEFAULT_RESPONSE_VALUE: IResponse = {
    id: '0',
    output: [
        "Welcome to the interactive terminal.",
        "You can ask specific questions about my resume, projects, or skills here through a language model interface.",
    ],
};

export const TerminalInput: React.FC<ITerminalInput> = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState<string>('');
    const [inputFocused, setInputFocused] = React.useState<boolean>(false);
    const [loadingResponse, setLoadingResponse] = React.useState<boolean>(false);
    const [responses, setResponses] = React.useState<IResponse[]>([]);

    const responseEndRef = React.useRef<HTMLDivElement>(null);

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

    React.useEffect(() => {
        scrollToResponseBottom();
    }, [loadingResponse]);

    const scrollToResponseBottom = () => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const addResponse = (response: IResponse) => {
        setResponses(prev => [...prev, response]);
    }

    const submitQuery = (query: string) => {
        if (!query.trim()) {
            return;
        }
        setLoadingResponse(true);
        sendLLMQueryToServer(query).then(response => {
            setLoadingResponse(false);
            addResponse(response);
            setInputValue('');
            setTimeout(() => inputRef.current?.focus(), 0);
        }).catch(error => {
            addResponse({
                id: Date.now().toString(),
                error: true,
                output: ["An error occurred while processing your query. Please try again."]
            });
            setLoadingResponse(false);
        });
    }

    const responseContainerStyle: React.CSSProperties = inputFocused ?
        { opacity: 1, visibility: 'visible' } :
        { opacity: 0, visibility: 'hidden' };

    const responseTSX = responses.map(resp => (
        <div key={resp.id} className={`response-box`}>
            <div className="inner-box-content">
                <PrinterContent 
                    content={resp.output} 
                    activate={resp.output.length > 0} 
                    tick={() => scrollToResponseBottom()}
                />
            </div>
        </div>
    ));

    const defaultResponseTSX = (
        <div className={`response-box default-response`}>
            <div className="inner-box-content">
                {DEFAULT_RESPONSE_VALUE.output.map((line, idx) => <p key={line + ":" + idx}>{line}</p>)}
            </div>
        </div>
    );

    return <div className='TerminalInput'>
        <div className='response-container' style={responseContainerStyle}>
            {responses.length > 0 ? responseTSX : defaultResponseTSX}
            {loadingResponse && <div className={`response-box loading`}>
                <LoadingResponse />
            </div>}
            <div className="response-end" ref={responseEndRef} />
        </div>
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
                    scrollToResponseBottom();
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
    printingDone?: () => void;
    tick?: () => void;
}
const PrinterContent: React.FC<IPrinterContent> = ({ 
    content, 
    activate, 
    printSpeed = 10,
    printingDone = () => {},
    tick = () => {},
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
                    tick();
                }
                setDisplayedContent(prev => [...prev]); 
            }
            tick();
            printingDone();
        }
        if (activate){
            printContent(splitContent);
        }
    }, [activate]);

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
