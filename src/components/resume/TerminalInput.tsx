import * as React from 'react';
import './TerminalInput.css'; 
import { sendLLMQueryToServer } from '../../services/server_requests';

interface ITerminalInput {}

const DEFAULT_BOX_VALUE = [
    "Welcome to the interactive terminal.",
    "You can ask specific questions about my resume, projects, or skills here through a language model interface.",
];

export const TerminalInput: React.FC<ITerminalInput> = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState<string>('');
    const [inputFocused, setInputFocused] = React.useState<boolean>(false);
    const [boxValue, setBoxValue] = React.useState<string[]>(DEFAULT_BOX_VALUE);

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

    const submitQuery = (query: string) => {
        if (!query.trim()) {
            return;
        }
        sendLLMQueryToServer(query).then(response => {
            setBoxValue(response.output);
            setInputValue('');
        }).catch(error => {
            setBoxValue(['There was an error responding to your input.', 'Please try again later.']);
        });
    }

    const contentBoxStyle: React.CSSProperties = inputFocused ?
        { opacity: 1, visibility: 'visible' } :
        { opacity: 0, visibility: 'hidden' };

    return <div className='TerminalInput'>
        <div className="content-box" style={contentBoxStyle}>
            <div className="inner-box-content">
                {boxValue.map(val => <p key={val}>{val}</p>)}
            </div>
        </div>
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
