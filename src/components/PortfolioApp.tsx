import React from 'react';
import './PortfolioApp.css';
import { PortApp } from '../data/PortApp';
import { App, ColorModeType } from '../data/App';

interface IPortfolioAppProps extends React.HTMLAttributes<HTMLDivElement> {
    app : PortApp;
    onClick?: (e: React.MouseEvent) => void;
}
export const PortfolioApp: React.FC<IPortfolioAppProps> = ({ app, onClick, className }) => {
    const localApp = App.getHotInstance().subscribe('PortfolioApp');
    const darkMode = localApp.ColorMode === ColorModeType.DARK;
    return (
        <div 
            className={`PortfolioApp ${className ? className : ''}`}
            onClick={onClick}
        >
            <div className='appIcon'>
                <img 
                    src={`${darkMode ? app.Images.appIconDark : app.Images.appIcon}`}
                    alt={`${app.Title} icon`} 
                    className='appImg'
                />
            </div>
            <h4 className={`unselectable`}>
                {app.Title}
            </h4>
        </div>
    );
};
