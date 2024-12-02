import React from 'react';
import './PortfolioApp.css';
import { PortApp } from '../data/PortApp';

interface IPortfolioAppProps {
    app : PortApp;
}
export const PortfolioApp: React.FC<IPortfolioAppProps> = ({ app }) => {
    return (
        <div className='PortfolioApp'>
            <div className='appImg'>

            </div>
            <h4>
                {app.Title}
            </h4>
        </div>
    );
};
