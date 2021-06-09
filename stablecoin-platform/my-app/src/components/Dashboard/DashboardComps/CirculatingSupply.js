import React, { Component } from "react";
import Style from "../Dashboard.module.scss";

class CirculatingSupply extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>   
                <div className={Style.colMd6}>
                    <div className={Style.card + " " + Style.miniStatWid}>
                        <div className={Style.cardBody}>
                            <div className={Style.media}>
                                <div className={Style.mediaBody}>
                                    <p className={Style.textMuted + " " + Style.fontWeightMedium}>Circulating supply</p>
                                    <h4 className={Style.mb0}><svg viewBox="0 0 280 280" width="20" height="20"><path fill="currentColor" d="M113.508 10.297a101.316 103.496 0 00-100.887 93.108q-.503 5.166-.51 10.463c0 1.478 0 2.956.1 4.414A101.39 103.57 0 10113.509 10.297zm45.654 153.402l-1.855 1.41-.402.315a53.19 54.335 0 01-13.398 7.61c-.831.328-1.662.63-2.513.91a51.395 52.5 0 01-8.186 1.97 53.914 55.074 0 01-8.22.63h-.348a52.856 53.992 0 01-24.619-6.296 53.88 55.04 0 01-20.325-19.29c-.328-.575-.67-1.17-.951-1.78l-13.539 3.655-5.044-19.49 13.003-3.51a91.924 93.902 0 01-.61-9.58l-14.778 3.982-5.044-19.475 1.554-.418a1.293 1.32 0 01.348-.137l19.226-5.194a123.2 123.2 0 011.045-6.685v-.11-.15a1.22 1.245 0 00.034-.165l4.99-23.807 1.34-6.24 1.468-6.837v-.069l1.226-5.748 8.87 1.93a15.977 16.32 0 0112.359 19.079c0 .095-.034.184-.06.28l-1.488 7.07-2.974 14.233 23.507-6.364a5.741 5.865 0 01.938-.171l5.218-1.403 1.46 5.666v.055l3.082 11.886.49 1.882-38.32 10.34a47.42 47.42 0 00-.066 2.36 62.897 64.25 0 00.22 6.557c0 .253.041.492.068.732l40.489-10.95 1.634 6.344 1.019 3.922 1.889 7.308.496 1.91-39.86 10.757c.335.383.67.752 1.065 1.129a30.012 30.657 0 0020.968 8.759 34.835 35.584 0 005.855-.5 29.12 29.747 0 0010.082-3.66c.744-.432 4.02-2.964 5.212-3.86l.208-.164.08-.062 3.631-2.854 14.216 18.593z"></path></svg> 500 000</h4>
                                </div>
                                <div className={Style.miniStatIcon + " " + Style.roundedCircle + " " + Style.bgPrimary + " " + Style.alignSelfCenter + " " + Style.avatarSm}>
                                    <span className={Style.avatarTitle}>
                                        <i className={`fas fa-chart-line fa-xs ` + Style.fontSize24}></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default CirculatingSupply;