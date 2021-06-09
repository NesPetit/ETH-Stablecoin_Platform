import React, { Component } from "react";
import Style from "../Dashboard.module.scss"

class WelcomeComp extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
              <div className={Style.overflowHidden + " " + Style.card}>
                    <div className={Style.wcardLugh}>
                        <div className={Style.row}>
                            <div className={Style.col8}>
                                <div className="p-4 mb-4">
                                    <h5>OPERATOR</h5>
                                </div>
                            </div>
                            <div className={Style.alignSelfEnd + " " + Style.col4}></div>
                        </div>
                    </div>
                    <div className={Style.pt0 + " " + Style.cardBody} >
                      <div className={Style.row}>
                        <div className={Style.colSm6}>
                            <h5 className={Style.fontSize15 + " " + Style.textTruncate + " " + Style.mt4}>Students Esilv</h5>
                            <p className={Style.textMuted + " " + Style.textTruncate + " " + Style.mb0}>Lugh SAS</p>
                        </div>
                        <div className={Style.colSm6}>
                            <div className={Style.pt4}>
                                <div className={Style.row}>
                                    <div className={Style.col12}>
                                        <h5 className={Style.fontSize15}>Email</h5>
                                        <p className={Style.textMuted + " " + Style.mb0 + " " + Style.fontSize11}>joricklartigau@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
            </React.Fragment>
        );
    }
}

export default WelcomeComp;