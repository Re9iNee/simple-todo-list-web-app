import React from "react";
import "./styles/Buttons.css";
import Modal from "./Modal"
import Tasks from "./Tasks"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      idCounter: 0,
      showModal: false,
      createMode: false,
      updateMode: true,
    };
  }
  handleKeyDown(event) { 
    // TODO: bring back preventDefaults()
    // TODO: dblClick -> Rename
    const activeEl = document.querySelector("li:focus");
    // (onFocus)Ctrl + Shift + Delete | CMD + Delete -> Remove Task
    // TODO: dblCheck delete keyCode in Windows
    if (activeEl) {
      // Windows
      if (event.ctrlKey)
        if (event.shiftKey)
          if (event.keyCode === 8) {
            console.log("Remove a task")
            // event.preventDefault();
          }

      // Mac
      if (event.metaKey)
        if (event.keyCode === 8) {
          console.log("Remove a task")
          // event.preventDefault();
        }

      // (onFocus)Enter -> New Task
      // TODO: dblCheck enter KeyCode in windows
      if (event.keyCode === 13) {
        console.log("New Task")
        // event.preventDefault();
      }

      // (onFocus)Tab -> Indent Outdent
      if (event.keyCode === 9) {
        // event.preventDefault();
        // on tab keyDown
        const taskContainer = document.getElementById("taskContainer");
        const grandParentEl = activeEl.parentElement.parentElement;
        if (grandParentEl === taskContainer) {
          // Indent
          // TODO: don't Indent the Parent.
          const prevSibEl = activeEl.previousElementSibling;
          // if prevSibling exists: appendChild to previousSibling
          if (prevSibEl) {
            // if prevSibEl has ul child append to that otherwise create a new one
            const ulExist = prevSibEl.firstElementChild;
            if (ulExist) {
              ulExist.appendChild(activeEl)
            } else {
              const ul = document.createElement("ul");
              ul.appendChild(activeEl)
              prevSibEl.appendChild(ul);
            }
          }
          // else: Do Nothing
          // active element has no previous sibling to indent (OR one list item is only available)
        } else if (grandParentEl.tagName === "LI") {
          // Outdent
          grandParentEl.insertAdjacentElement("afterend", activeEl)
        }
        activeEl.focus()
      }


      // Documentation: Keyboard Navigation - Arrow Key Up.pdf
      // Priority List: PrevSibLastChild - PrevSib - Parent(GParent)
      if (event.keyCode === 38) {
        // event.preventDefault();
        // Arrow Key Up
        try {
          // 1st Priority - prevSibLastChild
          const prevSibLastChild = activeEl.previousElementSibling.firstElementChild.lastElementChild;
          prevSibLastChild.focus()
        } catch {
          try {
            const prevSibEl = activeEl.previousElementSibling;
            prevSibEl.focus()
          } catch {
            try {
              const grandPaEl = activeEl.parentElement.parentElement;
              grandPaEl.focus()
            } catch {
              // Do Nothing
            }
          }
        }
      }
      // Documentation: Keyboard Navigation - Arrow Key Down.pdf
      // Priority List: Child - Next Sib - GParent Sib
      if (event.keyCode === 40) {
        // event.preventDefault();
        // Arrow Key Down
        try {
          // 1st Priority - Child
          const childEl = activeEl.firstElementChild.firstElementChild;
          childEl.focus()
        } catch {
          try {
            // 2nd Priority - Next Sibling
            const nextSiblingEl = activeEl.nextElementSibling;
            nextSiblingEl.focus()
          } catch {
            try {
              // 3rd Priority - grandParentSibling
              const grandPaSibEl = activeEl.parentElement.parentElement.nextElementSibling;
              grandPaSibEl.focus()
            } catch {
              // Do Nothing
            }
          }
        }
      }
    }
    // Keyboard Navigation if we don't have any focused element
    else {
      // event.preventDefault();
      const taskContainer = document.getElementById("taskContainer");
      if (event.keyCode === 38) {
        // Arrow Key Up
        taskContainer.firstElementChild.lastElementChild.focus()
      } else if (event.keyCode === 40) {
        taskContainer.firstElementChild.firstElementChild.focus()
      }
    }
    
  } 

  create = (event) => {
    event.stopPropagation();
    this.setState({
      showModal: true,
      createMode: true,
      updateMode: false
    })
  }
  deactivateModal(id, event) {
    this.setState({
      showModal: false,
    })
  }

  render() {
    window.addEventListener("keydown", this.handleKeyDown);
    return (
      <div>
        <div className="container" id="taskContainer" onClick={(ev) => this.deactivateModal("myModal", ev)}>
          <Tasks/>
        </div>
        <div className="btn-groups" onClick={(ev)=> this.deactivateModal("myModal", ev)}>
            <button className="btn primary-btn" id="addBtn" 
            onClick={this.create}
              >Add New</button>
        </div>
        { this.state.showModal && this.state.createMode &&
        <Modal title="Create Task" inputTitle="task name" inputPlaceHolder="e.g: Wash Clothes" primaryButtonTitle="Create" transmitData = {this.gotData}/> }
        { this.state.showModal && this.state.updateMode &&
        <Modal title="Rename Task" inputTitle="task name" inputPlaceHolder="e.g: Wash Clothes" primaryButtonTitle="Rename" transmitData = {this.gotData}/> }
        { this.state.showModal &&
          <Modal 
            title={this.state.createMode ? 'Create Task' : 'Rename Task'} 
            inputTitle="task name" 
            inputPlaceHolder="e.g: Wash Clothes" 
            primaryButtonTitle={ this.state.createMode ? 'Create' : 'Rename' } 
            transmitData = {this.gotData} 
            value="" 
            // TODO: dont forget to add value in updateMode
          />
          }
      </div>
    )
  }
  gotData = (childData) => {
    debugger
    this.setState({
      showModal: false,
      createMode: false,
      updateMode: true,
    })
  }
}


export default App;
