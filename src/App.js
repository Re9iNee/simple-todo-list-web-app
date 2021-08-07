import React from "react";
import "./styles/Buttons.css";
import Modal from "./Modal"
import Tasks from "./Tasks";
import database from "./database";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      idCounter: 0,
      showModal: false,
      createMode: false,
      updateMode: true,
      tasks: [],
      // localStorage obj
      storage: new database(props.url),
    };
    // deactive modal from Child Components
    this.deactivateModal = this.deactivateModal.bind(this);
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
  deactivateModal (event) {
    this.setState({
      showModal: false,
    })
  }

  static getDerivedStateFromProps(props, state) {
    // 1
    // state.storage.remove()
    return {
      tasks: state.storage.get(),
      // make this id unique
      idCounter: state.storage.getLastId() + 1,
    }
  }
  componentDidMount() {
    // ----- Debug Only -------
    // 2
    // this.state.storage.set([{
    //   title: "Wash Clothes",
    //   id: 1,
    //   children: [{
    //     title: "Sport Clothes",
    //     id: 2,
    //   }, {
    //     title: "Casuals",
    //     id: 3
    //   }]
    // }, {
    //   title: "Groceries",
    //   id: 4,
    //   children: []
    // }, {
    //   title: "Fix Mac",
    //   id: 5,
    //   children: []
    // }])
    // ----- DEBUG ONLY END------
  }

  render() {
    window.addEventListener("keydown", this.handleKeyDown);
    return (
      <div>
        <div className="container" id="taskContainer" 
        // TODO: the state will update even by a single click (even if modal is not activated )
        onClick={(ev) => this.deactivateModal("myModal", ev)}>
          <Tasks tasks={ this.state.tasks } />
        </div>
        <div className="btn-groups" onClick={(ev)=> this.deactivateModal("myModal", ev)}>
            <button className="btn primary-btn" id="addBtn" 
            onClick={this.create}
              >Add New</button>
        </div>
        { this.state.showModal &&
          <Modal 
            title= { this.state.createMode ? 'Create Task' : 'Rename Task' } 
            inputTitle= "task name" 
            inputPlaceHolder= "e.g: Wash Clothes" 
            primaryButtonTitle= { this.state.createMode ? 'Create' : 'Rename' } 
            transmitData = { this.gotData } 
            // TODO: add value in updateMode
            value= { this.state.createMode ? '' : '' }
            deactivateModal= { this.deactivateModal }
          />
          }
      </div>
    )
  }
  gotData = (childData) => {
     if (this.state.createMode) {
      const data = [...this.state.tasks];
      const newTask = { title: childData, children: [], timestamp: Date.now(), id: this.state.idCounter }
      data.push(newTask)
      this.state.storage.set(data)
    }
    this.setState({
      showModal: false,
      createMode: false,
      updateMode: true,
    })
  }
}


export default App;
