import React, { Component } from 'react';
import {Formik, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import Style from "../Forms.module.scss";
import Web3 from 'web3'


const CustomInput = ({ field, form, ...props}) =>{
    return (
        <div className={Style.formGroup}>
            <label className={Style.label}>{ field.name }</label>
            <input type="text" {...props} className={Style.formInput} {...field}/>
         </div>
    )
}

const CustomError = (props) => {
    return(
        <div className={Style.errorField + " text-danger"} >{ props.children }</div>
    )
}

export default class FormAcceptReject extends Component{
    constructor(props) {
        super(props);
        this.state = {
          origin: props.origin
        }
    }

    userSchema = Yup.object().shape({
        Identifier: Yup.string()
            .required("Required")
    })

    submit = (values, actions) => {
        this.props.web3.eth.getAccounts().then((accounts) => {
            console.log(accounts[0]);
            this.props.origin === "accept" ? this.props.contract.methods.accept(Web3.utils.fromAscii(values["Identifier"])).send({from:accounts[0]}) : this.props.contract.methods.reject(Web3.utils.fromAscii(values["Identifier"])).send({from:accounts[0]});
                        actions.setSubmitting(false);
        })
      };

    render(){
        return(
            <div>
                <Formik onSubmit={this.submit} initialValues={{Identifier: ''}} validationSchema={ this.userSchema }>
                    {({handleSubmit, isSubmitting}) =>(
                        <form onSubmit={handleSubmit} className={Style.formContainer}> 
                            <Field name="Identifier" component={CustomInput} placeholder="proposal_id" />
                            <ErrorMessage name="Identifier" component={CustomError}/>
                            <button className={Style.submitButton} type="submit" disabled={isSubmitting}> 
                                Write
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
        )
    }
}