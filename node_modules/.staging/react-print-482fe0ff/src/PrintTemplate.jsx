var React = require('react');
require('../react-print.css');

export default class PrintTemplate extends React.Component {
    render() {
        return (
            <div id="react-print">{this.props.children}</div>
        )
    }
};