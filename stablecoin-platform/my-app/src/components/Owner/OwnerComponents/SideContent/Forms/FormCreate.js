import React, { Component } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Style from "../../../../SharedComponents/Forms.module.scss";
import Web3 from 'web3';


const CustomInput = ({ field, form, ...props }) => {
    return (
        <div className={Style.formGroup}>
            <label className={Style.label}>{field.name}</label>
            <input type="text" {...props} className={Style.formInput} {...field} />
        </div>
    );
};

const CustomError = (props) => {
    return (
        <div className={Style.errorField + " text-danger"}>{props.children}</div>
    );
};

export default class FormCreateProposal extends Component {
    
    userSchema = Yup.object().shape({
        ProposalId: Yup.string()
            .required("Required"),
        AddressTo: Yup.string()
            .required("Required")
            .matches(/^0x[a-fA-F0-9]{40}$/, "Must be a valid ethereum address"),
        Operation: Yup.string()
            .required("Required")
            .oneOf(["setMinter","setAdministrator", "setReserve"],"Not a valid operation"),
        AddressContract: Yup.string()
            .required("Required")
            .matches(/^0x[a-fA-F0-9]{40}$/, "Must be a valid ethereum address"),
        State: Yup.boolean()
            .required("Required")

    });

    submit = (values, actions) => {
        this.props.web3.eth.getAccounts().then((accounts) => {
            this.props.contract.methods.createProposal(Web3.utils.fromAscii(values["ProposalId"]),values["AddressTo"], Web3.utils.fromAscii(values["Operation"]), values["AddressContract"], values["State"]).send({ from: accounts[0]});
            actions.setSubmitting(false);
        })
    };

    render() {
        return (
            <div>
                <Formik
                    onSubmit={this.submit}
                    initialValues={{
                        ProposalId: "",
                        AddressTo: "",
                        Operation:"",
                        AddressContract: "",
                        State: ""
                    }}
                    validationSchema={this.userSchema}
                >
                    {({ handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit} className={Style.formContainer}>
                            <Field
                                name="ProposalId"
                                component={CustomInput}
                                placeholder="proposal_id"
                            />
                            <ErrorMessage name="ProposalId" component={CustomError} />
                            <Field
                                name="AddressTo"
                                component={CustomInput}
                                placeholder="address_to"
                            />
                            <ErrorMessage name="AddressTo" component={CustomError} />
                            <Field
                                name="Operation"
                                component={CustomInput}
                                placeholder="setMinter/Admin/Reserve"
                            />
                            <ErrorMessage name="Operation" component={CustomError} />
                            <Field
                                name="AddressContract"
                                component={CustomInput}
                                placeholder="address_contract"
                            />
                            <ErrorMessage name="AddressContract" component={CustomError} />
                            <Field
                                name="State"
                                component={CustomInput}
                                placeholder="state"
                            />
                            <ErrorMessage name="State" component={CustomError} />
                            <button
                                className={Style.submitButton}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Write
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
        );
    }
}
