import React from 'react';
import "./styles/Tasks.css";


class Tasks extends React.Component {
    handleKeydown = (event, id) => {
        // (onFocus)Enter -> New Task
        // TODO: dblCheck enter KeyCode in windows
        if (event.keyCode === 13) {
            event.preventDefault();
            // open modal in createMode
            this.props.onCreate(event, id);
        }
    }
    handleDblClick = (event, id, title) => {
        event.stopPropagation();
        this.props.onUpdate(event, id, title)
    }
    render() {
        return (
            <ul>
                {this.props.tasks.map((task) => 
                    <li 
                    tabIndex="0"
                    key = { task.id } 
                    onKeyDown = { (ev) => this.handleKeydown(ev, task.id) }
                    onDoubleClick= { (ev) => this.handleDblClick(ev, task.id, task.title) }>
                        {task.title}
                        {task.children.length > 0 && 
                        <ul>
                            {task.children.map((child) => 
                            <li 
                            key={child.id} 
                            onDoubleClick= { (ev) => this.handleDblClick(ev, child.id, child.title) }
                            tabIndex="0">{child.title}</li>)}
                        </ul>
                        }
                    </li>
                )}
          </ul>
        );
    }
}
export default Tasks;