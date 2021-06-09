import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logoLight from "../../../src/assets/logo-light.png";
import Style from "./Header.module.scss";
import logoSchool from "../../../src/assets/logo-esilv-ecole-ingenieur.png"

export default class Header extends Component {
    render(){
        return(
                <nav className={`navbar navbar-expand-sm navbar-dark py-0 ` + Style.headerStyle}>
                    <div className={Style.logoContainer}>
                        <Link to="/">
                            <span>
                                <img src={logoLight} alt="" height="24" />
                            </span>
                        </Link>
                    </div>
                    <div className="collpase navbar-collapse" style={{"fontStyle" :"Poppins, sans-serif", "fontSize": "16px"}}>
                        <ul className="navbar-nav mr-auto">
                            <li className="navbar-item">
                            <a href="/Owner" className="nav-link">Owner</a>
                            </li>
                            <li className="navbar-item">
                            <a href="/Admin" className="nav-link">Administrator</a>
                            </li>
                            <li className="navbar-item">
                            <a href="/Minter" className="nav-link">Minter</a>
                            </li>
                            <li className="navbar-item">
                            <a href="/Reserve" className="nav-link">Reserve</a>
                            </li>
                        </ul>
                    </div>
                    <a href="https://www.esilv.fr/" target="_blank" rel="noreferrer">
                        <span>
                            <img src={logoSchool} alt="" height="40" style={{"padding" : "0 0.5rem"}}/>
                        </span>
                    </a>
                </nav>
        )
    }
}