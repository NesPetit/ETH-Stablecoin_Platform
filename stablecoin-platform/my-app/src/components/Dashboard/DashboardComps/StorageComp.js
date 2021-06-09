import React, { Component } from "react";
import Style from "../Dashboard.module.scss";
import logo from "../../../assets/logo.97b5ac3d.png";

class StorageComp extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
            <div className={Style.card}>
                <div className={Style.cardBody}>
                    <div className={Style.mb2 + " " + Style.cardTitle}>Lugh contract storage</div>
                    <div className={Style.textCenter + " " + Style.mb4}>
                        <div className={Style.mxAuto}>
                            <div className=" sb-avatar sb-avatar--src" style={{"display": "inline-block", "verticalAlign" : "middle", "width": "82px", "height": "82px", "borderRadius": "100%", "fontFamily" : "Helvetica, Arial, sans-serif"}}>
                                <img className=" sb-avatar__image" width="82px" height="82px" src={logo} style={{"maxWidth": "100%", "width": "82px", "height": "82px", "borderRadius": "100%"}}></img>
                            </div>
                        </div>
                        <p className={Style.textMuted + " " + Style.mb2}>Contract ID</p>
                        <h5 className={Style.fontSize14}>KT1Vrium33CaJ6HMcxMM414wscDWXSeNjJB7</h5> {/* Put Stablecoin address*/}
                        <p className={Style.textMuted + " " + Style.mb3}></p>
                        <hr></hr>
                        <h5><a className={Style.textDark} href="/dashboard">Transfer status -<span className="text-success font-16 ml-1">Active</span></a></h5>
                        <p className={Style.textMuted}>6 operations</p> {/* Put number of operations */}
                    </div>
                    <div className={Style.mb1 + " " + Style.row}>
                        <div className={Style.col4}>
                            <div className={Style.textCenter + " " + Style.mt3}>
                                <div className={Style.avatarXs + " " + Style.mxAuto + " " + Style.mb3 + " " + Style.mrAuto}>
                                    <span className={Style.avatarTitle + " " + Style.roundedCircle + " " + Style.fontSize16 + " " + Style.bgPrimary}>
                                        <i className={`fas fa-cog fa-xs ` + Style.textWhite}></i>
                                    </span>
                                </div>
                                <h5 className={Style.fontSize12}>Administrator</h5>
                                <p className={Style.textMuted + " " + Style.mb0 + " " + Style.fontSize10}>KT1CBXB...GhZsAo</p> {/* Put Administrator address*/}
                            </div>
                        </div>
                        <div className={Style.col4}>
                            <div className={Style.textCenter + " " + Style.mt3}>
                                <div className={Style.avatarXs + " " + Style.mxAuto + " " + Style.mb3 + " " + Style.mrAuto}>
                                    <span className={Style.avatarTitle + " " + Style.roundedCircle + " " + Style.fontSize16 + " " + Style.bgInfo}>
                                        <i className={`fas fa-stamp fa-xs ` + Style.textWhite}></i>
                                    </span>
                                </div>
                                <h5 className={Style.fontSize12}>Minter</h5>
                                <p className={Style.textMuted + " " + Style.mb0 + " " + Style.fontSize10}>KT1WhR6...AmMNoR</p> {/* Put Minter address*/}
                            </div>
                        </div>
                        <div className={Style.col4}>
                            <div className={Style.textCenter + " " + Style.mt3}>
                                <div className={Style.avatarXs + " " + Style.mxAuto + " " + Style.mb3 + " " + Style.mrAuto}>
                                    <span className={Style.avatarTitle + " " + Style.roundedCircle + " " + Style.fontSize16 + " " + Style.bgPink}>
                                        <i className={`fas fa-gavel fa-xs ` + Style.textWhite}></i>
                                    </span>
                                </div>
                                <h5 className={Style.fontSize12}>Owner</h5>
                                <p className={Style.textMuted + " " + Style.mb0 + " " + Style.fontSize10}>KT1Ne1u...CCbqBi</p> {/* Put Owner address*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </React.Fragment>
        );
    }
}

export default StorageComp;