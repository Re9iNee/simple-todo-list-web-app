import React from 'react';
import "./styles/Tasks.css";


class Tasks extends React.Component {
    handleKeydown = (event, id) => {
        // (onFocus)Enter -> New Task
        // TODO: dblCheck enter KeyCode in windows
        if (event.keyCode === 13) {
            // open modal in createMode
            this.props.onCreate(event, id);
        }
    }
    render() {
        return (
            <ul>
                {this.props.tasks.map((task) => 
                    <li 
                    tabIndex="0"
                    key = { task.id } 
                    onKeyDown = { (ev) => this.handleKeydown(ev, task.id) }>
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