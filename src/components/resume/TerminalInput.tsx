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
                    {boxValue.map(val => <p key={val}>{val}</p>)}
                </div>
            </div>
        ))}
        {loadingResponse && <div className={`response-box loading`} style={responseBoxStyle}>
            <div className="loading-indicator inner-box-content">Loading...</div>
        </div>}
        <input
            className="terminal-input" 
            alt="llm query input"
            type='text' 
            ref={inputRef}
            value={inputValue}
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
