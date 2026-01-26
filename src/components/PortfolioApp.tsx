import React from 'react';
import './PortfolioApp.css';
import { PortApp } from '../data/PortApp';

interface IPortfolioAppProps {
    app : PortApp;
    onClick?: (e: React.MouseEvent) => void;
}
export const PortfolioApp: React.FC<IPortfolioAppProps> = ({ app, onClick }) => {
    return (
        <div className='PortfolioApp' onClick={onClick}>
            <div className='appImg'>

            </div>
            <h4>
                {app.Title}
            </h4>
        </div>
    );
};
