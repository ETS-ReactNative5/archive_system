import React from 'react';
import { Col, Button, Input, Row } from 'antd';
import {FUND_HISTORICAL_NOTE} from '../../constants/tofiConstants';

class EditCardAnnotations extends React.Component {

  state = {
    fundAnnotation: '',
    fundNSA: '',
    fundNote: '',
    fundHistoricalNote: ''
  };

  //TODO check i18n I get from server
  componentDidMount() {
    /*const lng = localStorage.getItem('i18nextLng');
    const { list } = this.props;
    this.setState(prevState => ({
      fundAnnotation: list.fundAnnotation ? list.fundAnnotation[lng] : '',
      fundNSA: list.fundNSA ? list.fundNSA[lng] : '',
      fundNote: list.fundNote ? list.fundNote[lng] : '',
      fundHistoricalNote: list.fundHistoricalNote ? list.fundHistoricalNote[lng] : ''
    }))*/
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { t, tofiConstants }  = this.props;
    const { fundHistoricalNote } = this.state;
    const lng = localStorage.getItem('i18nextLng');

    return (
      <div className="EditCardAnnotations">
        <div className="EditCardAnnotations__body">
          <Row>
            <Col md={{ span:11, offset: 1 }} xs={{ span: 22, offset: 1 }}>
              <h3>{ tofiConstants[FUND_HISTORICAL_NOTE].name[lng] }</h3>
              <Input.TextArea
                autosize
                name="fundHistoricalNote"
                value={fundHistoricalNote}
                onChange={this.handleChange}
              />
            </Col>
          </Row>
        </div>
        <div className="EditCardAnnotations__footer">
          <Button type='primary'>{t('SAVE')}</Button>
          <Button>{t('CANCEL')}</Button>
        </div>
      </div>
    )
  }
}

export default EditCardAnnotations;
