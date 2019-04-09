import React from 'react';
import {Table, Upload, Input, Popconfirm, Button, Icon, message, Popover, Badge} from 'antd';
import {isEmpty,map} from 'lodash';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {getPropMeta,parseCube_new} from '../../../utils/cubeParser';
import {dObj,updateCubeData2,dFile} from '../../../actions/actions';
import moment from 'moment';
import {
    CUBE_FOR_FUND_AND_IK,
    DO_FOR_FUND_AND_IK,
    CUBE_NOMEN,
    DP_FOR_FUND_AND_IK,
    DP_FOR_WORKS
} from '../../../constants/tofiConstants';
const ButtonGroup = Button.Group;


const EditableCell = ({ editable, value, onChange }) => (
    <div style={{ flex: 1 }}>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);


const EditableUpload = ({ editable, value, onChange, openViewer }) => (
    <span style={{ flex: '0 0 20px', textAlign: 'center' }}>
    {editable ?
        <label style={{ cursor: 'pointer' }}>
            <input
                type="file"
                multiple
                style={{ display: 'none' }}
                accept='image/*, application/pdf'
                onChange={e => {
                    onChange(Array.from(e.target.files))
                }}
            />
            <Badge count={value && value.length} showZero={false}>
                <Icon type='upload' />
            </Badge>
        </label> :
        value && value.length > 0 && (
            <Badge count={value.length} onClick={() => openViewer(value)}>
                <Icon type='paper-clip' />
            </Badge>
        )
    }
  </span>
)

/*eslint eqeqeq:0*/
class LegalEntitiesNomenclatureSmall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showButton:true,
      showButtonDeL:true,

    };
  }
    renderColumns(text, record, column, file) {
        return (
            <div className='flex'>
                <EditableCell
                    editable={record.editable}
                    value={text}
                    onChange={value => this.handleChange(value, record.key, column)}
                />
                <EditableUpload
                    editable={record.editable}
                    value={record[file]}
                    onChange={value => this.handleChange(value, record.key, file)}
                    openViewer={values => this.props.openViewer(values)}
                />
            </div>
        );
    }

  remove = key => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
  };
  onRowClick = record => {
      this.setState({ selectedRow: record },()=>{
          let fileData = this.state.data.filter(el=>el.key === this.state.selectedRow.key)

          if(fileData[0].fileNomen === null || fileData[0].fileNomen[0].uid === undefined){
              this.setState({
                  showButton:true,
                  showButtonDeL:false
              })
          }else{
              this.setState({
                  showButtonDeL:true,
                  showButton:false
              })
          }
      })

  };
  handleChange(value, key, column) {
      const newData = [...this.state.data];
      const target = newData.find(item => key === item.key);
      if (target) {
          target[column] = value;
          this.setState({ data: newData });
      }
  }
    onRemove = async file => {
        if(file.type === '') {
            // remove file from server and go on
            const res = await dFile(file.name, CUBE_NOMEN );
            if(!res.success) {
                //  on fail stop here with message;
                res.errors.forEach(err => {
                    message.error(err.text);
                });

                return;
            }else {
                this.updateComp()
                message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));

            }


        }

    };
    saveData=(key)=>{
        const newData = [...this.state.data];
        const target = newData.find(item => key== item.key);
        try {
            if (target) {
                const {key, editable, archiveInfoDate1IdDataPropVal, archiveInfoDate2IdDataPropVal, archiveInfoDate3IdDataPropVal, normativeDocTypeIdDataPropVal, file1IdDataPropVal, file2IdDataPropVal, file3IdDataPropVal, fileNomenIdDataPropVal, ...rest} = target;
                let datas = [];
                datas = [{
                    own: [{doConst: "dimObjNomen", doItem: target.key, isRel: "0", objData: {}}],
                    periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
                }];

                const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
                return updateCubeData2(
                    CUBE_NOMEN,
                    moment().format('YYYY-MM-DD'),
                    JSON.stringify(datas),
                    {},
                    {['file1']: rest.file1, ['file2']: rest.file2, ['file3']: rest.file3, ['fileNomen']: rest.fileNomen})
                    .then(res => {
                        hideLoading();
                        if (res.success) {
                            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                            delete target.editable;
                            this.setState({data: newData});
                            this.updateComp()

                        } else {
                            message.error(this.props.t('PROPS_UPDATING_ERROR'));
                            if (res.errors) {
                                res.errors.forEach(err => {
                                    message.error(err.text);
                                });
                                return {success: false}
                            }
                        }
                    })
                    .catch(err => {
                        console.warn(err);
                    })
            }
        }catch(e) {
            console.log(e)
        }

    }

    stopPropagation = e => {
    e.stopPropagation();
  };
  renderInvTableHeader = () => {
    return (
      <div className="flex">
        <Link to={{
          pathname: `/sourcing/sourcesMaintenance/legalEntities/${this.props.record.key}/nomenclature`,
          state: {record: this.props.record}
        }}><Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}
          type="primary"
          shape='circle'
          icon='plus'
        />
        </Link>
          {
              !this.state.selectedRow || (this.state.selectedRow && isEmpty(this.state.selectedRow.fileNomen)) ?
                  <label className={!this.state.selectedRow ? 'disabled' : ''}>
                    <input
                        disabled={!this.state.selectedRow}
                        type="file"

                        style={{ display: 'none' }}
                        onChange={e => this.handleChange(Array.from(e.target.files), this.state.selectedRow.key, 'fileNomen')}/>
                    <span className='ant-btn ant-btn-primary'><Icon type='upload'/> <span>{this.props.t('UPLOAD_FILE')}</span></span>
                  </label> :
                  <ButtonGroup>
                    <Button type='primary' icon='eye' onClick={() => this.props.openViewer(this.state.selectedRow.fileNomen)}>
                      <Badge
                          count={this.state.selectedRow.fileNomen.length}
                      >
                          {this.props.t('VIEW_FILES')}
                      </Badge>

                    </Button>
                      {(this.state.showButton?
                          <Popover content={""} title="Загрузить">
                          <Button style={{marginLeft:5}} type='primary' icon='upload' onClick={()=> this.saveData(this.state.selectedRow.key)}></Button>
                          </Popover>
                              :null)}
                      {(this.state.showButtonDeL?                      <Popover content={""} title="Удалить">
                          <Button style={{marginLeft:5}} type='primary' icon='delete' onClick={()=> this.onRemove(this.state.selectedRow.fileNomen[0])}>
                          </Button>
                      </Popover>:null)}

                  </ButtonGroup>
          }
      </div>
    )
  };
  updateComp =()=>{
      this.setState({
          data:[],
          selectedRow:[],
          loading: true
      },()=>{
          this.props.getCube("cubeSNomen", JSON.stringify(this.props.filters)).then(res=>{
              if(isEmpty(this.props.tofiConstants)) return;
              if(this.props.cubeSNomen) {
                  const { dimObjNomen, dimPropNomen } = this.props.tofiConstants;
                  this.setState(
                      {
                          loading: false,
                          data: parseCube_new(
                              this.props.cubeSNomen['cube'],
                              [],
                              'dp',
                              'do',
                              this.props.cubeSNomen[`do_${dimObjNomen.id}`],
                              this.props.cubeSNomen[`dp_${dimPropNomen.id}`],
                              `do_${dimObjNomen.id}`,
                              `dp_${dimPropNomen.id}`).map(this.renderTableData)
                      }
                  );
              } else {
                  this.setState({ data: [] });
              }
          })
      })



  }
  componentDidMount=()=> {
    if(isEmpty(this.props.tofiConstants)) return;
    if(this.props.cubeSNomen) {
      const { dimObjNomen, dimPropNomen } = this.props.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(
            this.props.cubeSNomen['cube'],
            [],
            'dp',
            'do',
            this.props.cubeSNomen[`do_${dimObjNomen.id}`],
            this.props.cubeSNomen[`dp_${dimPropNomen.id}`],
            `do_${dimObjNomen.id}`,
            `dp_${dimPropNomen.id}`).map(this.renderTableData)
        }
      );
    } else {
      this.setState({ data: [] });
    }
  }

  componentDidUpdate(prevProps) {
    if(!this.props.cubeSNomen && prevProps.cubeSNomen) {
      this.setState({ data: [] })
    }
  }
  renderTableData = (item, id) => {
    const { nomenNumber, nomenAgreementDate, nomenPerechen, fileNomen } = this.props.tofiConstants;

    const nomenNumberObj = item.props.find(element => element.prop == nomenNumber.id),
      nomenAgreementDateObj = item.props.find(element => element.prop == nomenAgreementDate.id),
      nomenPerechenObj = item.props.find(element => element.prop == nomenPerechen.id);

    const file = item.props.find(element => element.prop == fileNomen.id);
    const temp ={
        fileNomen : file && file.value ? file.value : {},

    }
    return {
      key: item.id,
      nomenNumber: nomenNumberObj ? nomenNumberObj.value || '' : '',
      nomenAgreementDate: nomenAgreementDateObj && nomenAgreementDateObj.value ? nomenAgreementDateObj.value : '',
      nomenPerechen: nomenPerechenObj && nomenPerechenObj.cube && nomenPerechenObj.cube.idRef ? { value: nomenPerechenObj.cube.idRef, label: nomenPerechenObj.cube.name[this.lng] } : null,
      fileNomen: isEmpty(temp.fileNomen) === false  ? [temp.fileNomen] : null
    }
  };
  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { t, tofiConstants: { nomenNumber, nomenAgreementDate, nomenPerechen } } = this.props;

    this.lng = localStorage.getItem('i18nextLng');
    return <div className="LegalEntitiesInventoriesSmall">
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', margin: '5px 0'}}>{t('NOMENCLATURE')}</h3>
      <Table
        bordered
        columns={[
          {
            key: 'nomenNumber',
            title: nomenNumber.name[this.lng],
            dataIndex: 'nomenNumber',
            width: '10%',
          }, {
            key: 'nomenAgreementDate',
            title: nomenAgreementDate.name[this.lng],
            dataIndex: 'nomenAgreementDate',
            width: '25%',
          }, {
            key: 'nomenPerechen',
            title: nomenPerechen.name[this.lng],
            dataIndex: 'nomenPerechen',
            width: '42%',
            render: value => value ? value.label : ''
          },
          {
            key: 'action',
            title: '',
            dataIndex: '',
            width: '8%',
            render: (text, record) => {
              return (
                <div className="editable-row-operations">
                  <Link to={{
                    pathname: `/sourcing/sourcesMaintenance/legalEntities/${this.props.record.key}/nomenclature/${record.key}`,
                    state: {record: this.props.record}
                  }}>
                    <Icon type="edit" style={{fontSize: '14px'}}/>
                  </Link>
                  <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                    const fd = new FormData();
                    fd.append("cubeSConst", 'cubeSNomen');
                    fd.append("dimObjConst", 'dimObjNomen');
                    fd.append("objId", record.key.split('_')[1]);
                    const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                    dObj(fd)
                      .then(res => {
                        hideLoading();
                        if(res.success) {
                          message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                          this.remove(record.key, record.table)
                        } else {
                          throw res
                        }
                      }).catch(err => {
                      console.error(err);
                      message.error(this.props.t('REMOVING_ERROR'))
                    })
                  }}>
                    <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}} onClick={this.stopPropagation}><Icon type="delete" className="editable-cell-icon"/></a>
                  </Popconfirm>
                </div>
              );
            },
          }
        ]}
        dataSource={this.state.data}
        size='small'
        title={this.renderInvTableHeader}
        pagination={{pageSize: 20}}
        scroll={{y: '100%'}}
        onRowClick={this.onRowClick}
        rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}

        style={{minHeight: 'unset', marginLeft: '5px', paddingBottom: '30px'}}
      />
    </div>
  }
}
function mapStateToProps(state) {
    return {
        cubeSNomen: state.cubes.cubeSNomen
    }
}

export default connect(mapStateToProps, {
})(LegalEntitiesNomenclatureSmall);