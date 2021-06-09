import React, { Component } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Style from "../../../../SharedComponents/Forms.module.scss";
import Web3 from 'web3';
import addresses from "../../../../../addresses.json"

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

export default class FormMintProposal extends Component {

    userSchema = Yup.object().shape({
        ProposalId: Yup.string()
            .required("Required"),
        AddressContract: Yup.string()
            .required("Required")
            .matches(/^0x[a-fA-F0-9]{40}$/, "Must be a valid ethereum address"),
        Amount: Yup.number()
            .required("Required")
            .positive("Must be positive"),
        Operation: Yup.string()
            .required("Required")
    });

    submit = (values, actions) => {

        this.props.web3.eth.getAccounts().then((accounts) => {
            this.props.contract.methods.createProposal(
                Web3.utils.fromAscii(values["ProposalId"]),
                values["Amount"],  Web3.utils.fromAscii(values["Operation"]), 
                values["AddressContract"]).send({ from: accounts[0] });
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
                        AddressContract: addresses.stablecoin,
                        Amount: "",
                        Operation: "mint"
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
                                name="AddressContract"
                                component={CustomInput}
                                placeholder="address_contract"
                            />
                            <ErrorMessage name="AddressContract" component={CustomError} />
                            <Field
                                name="Amount"
                                component={CustomInput}
                                placeholder="amount"
                            />
                            <ErrorMessage name="Amount" component={CustomError} />
                            <button
                                className={Style.submitButton}
                                type="submit"
                                disabled={isSubmitting}>Write
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
        );
    }
}