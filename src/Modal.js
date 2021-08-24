import React from "react";
import "./styles/Modal.css";
import closeImg from "./close@1.png";
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }
  transferData = (event) => {
    this.props.transmitData(this.state.value);
    event.preventDefault();
  };
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  componentWillUnmount() {
    // FIXME: it wont deactivate if you press on #addBtn
    const modal = document.getElementById("myModal");
    modal.classList.remove("active");
    const container = document.getElementsByClassName("container")[0];
    container.classList.remove("modalActivated");
    const buttonGroups = document.getElementsByClassName("btn-groups")[0];
    buttonGroups.classList.remove("modalActivated");
  }

  componentDidMount() {
    // Activate modal
    const modal = document.getElementById("myModal");
    modal.classList.add("active");
    // blur background
    const container = document.getElementsByClassName("container")[0];
    container.classList.add("modalActivated");
    const buttonGroups = document.getElementsByClassName("btn-groups")[0];
    buttonGroups.classList.add("modalActivated");
  }
  render() {
    return (
      <form className="modal" id="myModal" onSubmit={this.transferData}>
        <div className="modalHeader">
          <header className="header header-small">{this.props.title}</header>
          <div className="touchTarget" onClick={this.props.deactivateModal}>
            <img src={closeImg} alt="close modal" srcSet="" id="modalClose" />
          </div>
        </div>
        <hr />
        <div className="modalBody">
          <div>
            <header className="body body-small inputHeader">
              {this.props.inputTitle}
            </header>
            <input
              type="text"
              required
              autoFocus
              className="body body-large modalInput"
              name="value"
              id="modalInput"
              placeholder={this.props.inputPlaceHolder}
              defaultValue={this.state.value}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <hr />
        <div className="form-btn-group">
          <button className="btn primary-btn" type="submit">
            {this.props.primaryButtonTitle || "Save"}
          </button>

          <button
            className="btn secondary-btn"
            onClick={this.props.deactivateModal}
            type="button"
          >
            {this.props.secondaryButtonTitle || "Cancel"}
          </button>
        </div>
      </form>
    );
  }
}
export default Modal;
