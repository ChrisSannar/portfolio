import * as React from 'react';
import './TerminalInput.css';
import { sendLLMQueryToServer } from '../../services/server_requests';

interface ITerminalInput {}

export const TerminalInput: React.FC<ITerminalInput> = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [inputFocused, setInputFocused] = React.useState(false);
    const [boxValue, setBoxValue] = React.useState('');

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
        sendLLMQueryToServer(query, process.env.REACT_APP_ENV === "development").then(response => {
            console.log('LLM response:', response);
            setBoxValue(response.output);
        }).catch(error => {
            console.error('Error sending LLM query:', error);
            setBoxValue('Error: ' + error.message);
        });
    }

    const contentBoxStyle: React.CSSProperties = inputFocused ?
        { opacity: 1, visibility: 'visible' } :
        { opacity: 0, visibility: 'hidden' };

    return <div className='TerminalInput'>
        <div className="content-box" style={contentBoxStyle}>
            <div className="inner-box-content">{boxValue}</div>
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