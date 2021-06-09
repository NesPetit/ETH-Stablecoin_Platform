import React, { Component } from "react";
import Style from "../Dashboard.module.scss";

class ReserveBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>   
                <div className={Style.colMd6}>
                    <div className={Style.miniStatWid + " " + Style.card + " " + Style.bgDanger}>
                        <div className={Style.cardBody}>
                            <div className={Style.media}>
                                <div className={Style.mediaBody}>
                                    <p className={Style.textWhite + " " + Style.fontWeightMedium}>Reserve bank account</p>
                                    <h4 className={Style.mb0 + " " + Style.textWhite}>€ 0 <i className="bx bx-pencil ml-4" style={{"cursor" : "pointer"}}></i></h4>
                                </div>
                                <div className={Style.miniStatIcon + " " + Style.roundedCircle + " " + Style.bgPrimary + " " + Style.alignSelfCenter + " " + Style.avatarSm + " " + Style.textWhite}>
                                    <span className={Style.avatarTitle + " " + Style.bgWhite}><i className={`fas fa-piggy-bank fa-xs ` + Style.textPig + " " + Style.fontSize24}></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ReserveBalance;