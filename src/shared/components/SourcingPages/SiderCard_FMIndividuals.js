import React from 'react';
import axios from 'axios';
import classnames from 'classnames';
import FMIndividualsForm from './FMIndividualsForm';
import AntTabs from '../AntTabs';
import LaborInfoTable from './LaborInfoTable';

class SiderCard_FMIndividuals extends React.PureComponent {

  state = {
    year: null,
    life: null,
    width: 600,
    handleBarLeft: -10,
    mouseDown: false
  };
  startX;
  startLeft;

  handleMouseDown = e => {this.setState({mouseDown: true}); this.startX = e.nativeEvent.clientX; this.startLeft = this.state.handleBarLeft - 200};
  handleMouseUp = () => {
    this.setState({mouseDown: false, handleBarLeft: this.state.handleBarLeft + 200}, () => {
      const endLeft = this.state.handleBarLeft + 10;
      this.setState({ width: this.state.width - endLeft, handleBarLeft: -10 })
    });
  };

  handleMouseMove = e => {
    if(!this.state.mouseDown) return;
    const move = e.nativeEvent.clientX - this.startX;
    this.setState({ handleBarLeft: this.startLeft + move });
  };

  componentDidMount() {
    axios(`${localStorage.getItem('i18nextLng')}/utils/getConst?constName=life`)
      .then(res => res.data)
      .then(body => JSON.parse(body.data))
      .then(json => this.setState({life: json.value}))
      .catch(err => {
        console.log(err);
      });
    axios(`${localStorage.getItem('i18nextLng')}/utils/getConst?constName=years`)
      .then(res => res.data)
      .then(body => JSON.parse(body.data))
      .then(json => this.setState({year: json.value}))
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    const { t, tofiConstants, initialValues } = this.props;
    const lng = localStorage.getItem('i18nextLng');
    return (
      <div className="card" style={{ width: this.state.width }}>
        <div className={classnames('handleBar', {'mouse-down': this.state.mouseDown})}
             onMouseDown={this.handleMouseDown}
             onMouseUp={this.handleMouseUp}
             onMouseMove={this.handleMouseMove}
             onMouseLeave={this.handleMouseLeave}
             style={{left : this.state.handleBarLeft}}
        >
          <div className="handleBar-bar" />
        </div>
        {this.props.closer}
        <AntTabs tabs={[
          {
            tabKey: 'props',
            tabName: t('MAIN_INFO'),
            tabContent: <FMIndividualsForm tofiConstants={tofiConstants} t={t} initialValues={{...initialValues}} life={this.state.life}/>
          },
          {
            tabKey: 'Description',
            tabName: tofiConstants.personLaborActivity.name[lng],
            tabContent: <LaborInfoTable t={t} tofiConstants={tofiConstants} year={this.state.year}/>
          }
        ]}/>

      </div>
    )
  }
}

export default SiderCard_FMIndividuals;