import React from 'react';
import {Table, Button, DatePicker, Input} from 'antd';
import DialogBox from './DialogBox';

class EditDialogBody extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      dialogBox: {
        visible: false
      }
    }
  }

  renderTableHeader = () => {
    return (
      <div className="modal-table-header">
        <Button onClick={this.openDialogBox}>Создать</Button>
        <Button onClick={this.openDialogBox}>Изменить</Button>
        <Button type='danger'>Удалить</Button>
      </div>
    )
  };

  openDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: true} })
  };

  closeDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: false} })
  };

  onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  render() {
    const { loading, dialogBox: { visible } } = this.state;

    return (
      <div>
        <Table
          dataSource={[]}
          columns={
            [
              {
                key: 'value',
                title: 'Значение',
                dataIndex: 'value',
                width: '50%'
              },
              {
                key: 'dBeg',
                title: 'Начало',
                dataIndex: 'dBeg',
                width: '25%'
              },
              {
                key: 'dEnd',
                title: 'Конец',
                dataIndex: 'dEnd',
                width: '25%'
              }
            ]
          }
          className='editDialogBody'
          size={'small'}
          loading={loading}
          bordered
          title={this.renderTableHeader}
        />
        <DialogBox
          visible={visible}
          handleClose={this.closeDialogBox}
          width="300px"
          heading='NEW'
        >
          <DatePicker onChange={this.onDateChange}/>
          <DatePicker onChange={this.onDateChange}/>
          <Input />
        </DialogBox>
      </div>
    );
  }
};

export default EditDialogBody;