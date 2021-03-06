import React, {FC} from 'react';
import logo from "assets/png/kranklogo.png"
import TelegramIcon from '@material-ui/icons/Telegram';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
import {createTheme} from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/styles';

type TFooterProps = {
};
const theme = createTheme({
    palette: {
        text: {
            primary: '#ffffcc'
        },
        primary: {
            main: '#aa0000',
        },
        secondary: {
            main: '#ffffcc',
        },
    },
});
const Footer: FC<TFooterProps> = () => {

    return (
        <ThemeProvider theme={theme}>
            <footer className="footer">
                <div className="footer__content _container">
                    <div className="footer__firstBlock">
                        <p className="footer__text text">
                            ©2021 Krankenkopf ‒ All right!
                        </p>
                        <div className="footer__icons">
                            <a href="https://t.me/romanthekrank" rel="noopener noreferrer" target="_blank">
                                <TelegramIcon className="footer__icon icon" color={'secondary'}/>
                            </a>
                            <a href="https://github.com/krankenkopf" rel="noopener noreferrer" target="_blank">
                                <GitHubIcon className="footer__icon icon" color={'secondary'} />
                            </a>
                            <a href="https://linkedin.com/in/roman-the-krank" rel="noopener noreferrer" target="_blank">
                                <LinkedInIcon className="footer__icon icon" color={'secondary'} />
                            </a>
                            <a href="https://instagram.com/hermannthekrank" rel="noopener noreferrer" target="_blank">
                                <InstagramIcon className="footer__icon icon" color={'secondary'} />
                            </a>
                        </div>
                    </div>
                    <div className="footer__logo">
                        <img src={logo} alt="logo"/>
                    </div>
                </div>

            </footer>
        </ThemeProvider>

    )
}

export default Footer