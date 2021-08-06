import React from "react";
import "./styles/Modal.css";
import closeImg from "./close@1.png";
class Modal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: this.props.value
        }
    }
    transferData = (event) => {
        this.props.transmitData(this.state.value);
        event.preventDefault();
    }
    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }
    render() {
        return (
            <form className="modal" id="myModal" onSubmit={this.transferData}>
                <div className="modalHeader">
                    <header className="header header-small">{this.props.title}</header>
                    <div className="touchTarget">
                        <img src={closeImg} alt="close modal" srcSet="" id="modalClose" />
                    </div>
                </div>
                <hr/>
                <div className="modalBody">
                    <div>
                        <header className="body body-small inputHeader">{this.props.inputTitle}</header>
                        <input type="text" className="body body-large modalInput" name="" id="modalInput" placeholder={this.props.inputPlaceHolder} value={this.state.value} onChange= {this.handleChange}/>
                    </div>
                </div>
                <hr/>
                <div className="form-btn-group">
                    <button className="btn primary-btn" type="submit">{this.props.primaryButtonTitle || 'Save' }</button>
                    <button className="btn secondary-btn">{this.props.secondaryButtonTitle || 'Cancel'}</button>
                </div>
            </form>
        );
    }
}
export default Modal;