import React, {Component} from 'react';

class DisplayPanel extends Component {
    render() {
        return (
            <div >
                <span style={{ fontSize:20}} className={this.getBadgeClasses()}>{this.props.val}</span>
            </div>
        );
    }

    getBadgeClasses(){

        let classes = "badge m-2 badge-";
        classes += this.props.val === 0 ? "warning" : "primary";
        return classes;
    }
}

export default DisplayPanel;
