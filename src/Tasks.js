import React from 'react';
import "./styles/Tasks.css";


class Tasks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tasks: [{
              title: "Wash Clothes",
              id: 1,
              children: [{
                title: "Sport Clothes",
                id: 2,
              }, {
                title: "Casuals",
                id: 3
              }]
            }, {
              title: "Groceries",
              id: 4,
              children: []
            }, {
              title: "Fix Mac",
              id: 5,
              children: []
            }]
        };
    }
    render() {
        return (
            <ul>
                {this.state.tasks.map((task) => 
                    <li tabIndex="0" key={task.id}>
                        {task.title}
                        {task.children.length > 0 && 
                        <ul>
                            {task.children.map((child) => 
                            <li key={child.id} tabIndex="0">{child.title}</li>)}
                        </ul>
                        }
                    </li>
                )}
          </ul>
        );
    }
}
export default Tasks;