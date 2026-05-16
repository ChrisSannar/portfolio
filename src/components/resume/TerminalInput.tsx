import * as React from 'react';
import './TerminalInput.css';

interface ITerminalInput {}

export const TerminalInput: React.FC<ITerminalInput> = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [inputFocused, setInputFocused] = React.useState(false);

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
        setInputValue('');
    }

    const contentBoxStyle: React.CSSProperties = inputFocused ?
        { opacity: 1, visibility: 'visible' } :
        { opacity: 0, visibility: 'hidden' };

    return <div className='TerminalInput'>
        <div className="content-box" style={contentBoxStyle}>
        </div>
        <input
            className="terminal-input" 
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