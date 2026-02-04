import React from 'react';
import './PortfolioApp.css';
import { PortApp } from '../data/PortApp';

interface IPortfolioAppProps extends React.HTMLAttributes<HTMLDivElement> {
    app : PortApp;
    onClick?: (e: React.MouseEvent) => void;
}
export const PortfolioApp: React.FC<IPortfolioAppProps> = ({ app, onClick, className }) => {
    return (
        <div 
            className={`PortfolioApp ${className ? className : ''}`}
            onClick={onClick}
        >
            <div className='appImg'>

            </div>
            <h4 className={`unselectable`}>
                {app.Title}
            </h4>
        </div>
    );
};
