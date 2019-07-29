import React from "react"
import {onSaveCubeData, parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import {
    createObj, dFile, dObj, getFile, getIdGetObj,
    updateCubeData2
} from "../../../../actions/actions";
import axios from 'axios';
import AntTable from "../../../AntTable";
import {isEmpty, isEqual} from "lodash";
import {
    Button, Col, DatePicker, Icon, Input, Modal, Row, Popconfirm, Upload,
    Badge
} from "antd";
import moment from "moment";
import message from "antd/es/message/index";
import Select from "../../../Select";
import ModalNomen from "./ModalNomen";

class NomenTable extends React.Component {
    state = {
        data: {},
        cubeData: {},
        editable: {},
        modalOpen: false,
        showTreeModal: false,
        newObjName: '',
        newFileArr: '',
        nomenPerechenOptions: [],
        perechenListValue: {}
    };


    handleOk = (e) => {
        this.setState({
            modalOpen: false
        })
    };

    handleCancel = (e) => {
        this.setState({
            modalOpen: false,
            showTreeModal: false
        })
    };


    addRow = () => {
        let name = {
            kz: this.state.newObjName,
            ru: this.state.newObjName,
            en: this.state.newObjName
        };
        const showLoad = message.loading('Сохранение', 0);
        this.setState({
            iconLoading: true
        });
        const cube = {
            cubeSConst: 'cubeSNomen',
            doConst: 'dimObjNomen',
            dpConst: 'dimPropNomen'
        };
        const obj = {
            clsConst: 'nomenList',
            name,
            fullName: name
        };

        createObj({cubeSConst: cube.cubeSConst}, obj).then(res => {
            if (res.success) {
                let data = [
                    {
                        own: [{
                            doConst: 'doForFundAndIK',
                            doItem: String(this.props.selectedIK.id),
                            isRel: "0",
                            objData: {}
                        }
                        ],
                        props: [
                            {
                                propConst: 'nomen',
                                val: String(res.data.record.id),
                                typeProp: "41",
                                periodDepend: "2",
                                isUniq: "2",
                                mode: "ins",
                            }
                        ],
                        periods: [{
                            periodType: '0',
                            dbeg: '1800-01-01',
                            dend: '3333-12-31'
                        }]
                    }
                ];


                updateCubeData2(
                    'cubeForFundAndIK',
                    moment().format('YYYY-MM-DD'),
                    JSON.stringify(data),
                    {},
                    {}).then(res2 => res2.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED')) : message.error(res2.errors[0].text)).then(
                    () => {
                        this.props.rerender();
                        this.buildComponent();
                    }
                )

                showLoad();
            }
        });


    }
    ;


    check = (obj, key, c, type) => {
        if (type == 'name') {
            data = [
                {
                    own: [{
                        doConst: 'dimObjNomen',
                        doItem: String(key),
                        isRel: "0",
                        objData: {name: obj, fullName: obj}
                    }
                    ],
                    periods: [{
                        periodType: '0',
                        dbeg: '1800-01-01',
                        dend: '3333-12-31'
                    }]
                }
            ];

            updateCubeData2(
                'cubeSNomen',
                moment().format('YYYY-MM-DD'),
                JSON.stringify(data),
                {},
                {}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED')) : message.error(res.errors[0].text));
            let editable = {...this.state.editable};
            editable[key + c] = false;
            this.setState({editable: editable});
            return
        }
        if (type == '41') {
            uniq = '2';
            let valueArr = this.state.perechenListValue[key];

            const c = {
                cube: {
                    cubeSConst: 'cubeSNomen',
                    doConst: 'dimObjNomen',
                    dpConst: 'dimPropNomen',
                    data: this.state.cubeData
                },
                obj: {
                    doItem: String(key)
                }
            };

            let prop = {'nomenPerechen': valueArr}
            const v = {
                values: prop,
                complex: "",
                oFiles: {}
            };

            const objData = {};
            onSaveCubeData(c, v, this.props.tofiConstants, objData).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED')) : message.error(res.errors[0].text));
            this.buildComponent()
        }
        let uniq = '1';
        let editable = {...this.state.editable};
        let oldTableData = [...this.state.oldTableData];
        var val1 = '';
        var val2 = '';
        let cell = '';
        var data = [];
        let value;
        if (type == '315') {
            value = obj.valueLng;
        }
        if (type == '312') {
            if (!obj) {
                obj = {};
                obj.value = moment()
            }
            ;
            if (obj.value instanceof moment) {
                value = obj.value.format('YYYY-MM-DD');
            } else {
                value = moment(obj.value).format('YYYY-MM-DD');
            }
        }

        if (!!oldTableData.find(el => el.key == key)[c]) {
            cell = oldTableData.find(el => el.key == key)[c];

            if (type == '315') {
                val1 = JSON.stringify(cell.valueLng);
                val2 = JSON.stringify(obj.valueLng);
            }

            if (type == '312') {
                val1 = JSON.stringify(moment(cell.value).format("YYYY-MM-DD"));
                val2 = JSON.stringify(value);
            }


            if (val1 !== val2) {
                data = [
                    {
                        own: [{
                            doConst: 'dimObjNomen',
                            doItem: String(key),
                            isRel: "0",
                            objData: {}
                        }
                        ],
                        props: [
                            {
                                propConst: c,
                                idDataPropVal: cell.idDataPropVal,
                                val: value,
                                typeProp: String(type),
                                periodDepend: "2",
                                isUniq: uniq,
                                mode: "upd",
                            }
                        ],
                        periods: [{
                            periodType: '0',
                            dbeg: '1800-01-01',
                            dend: '3333-12-31'
                        }]
                    }
                ];

                updateCubeData2(
                    'cubeSNomen',
                    moment().format('YYYY-MM-DD'),
                    JSON.stringify(data),
                    {},
                    {}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED')) : message.error(res.errors[0].text))
                editable[key + c] = false;
                this.setState({editable: editable})
            } else {
                editable[key + c] = false;
                this.setState({editable: editable})
            }

        } else {


            data = [
                {
                    own: [{
                        doConst: 'dimObjNomen',
                        doItem: String(key),
                        isRel: "0",
                        objData: {}
                    }
                    ],
                    props: [
                        {
                            propConst: c,
                            val: value,
                            typeProp: String(type),
                            periodDepend: "2",
                            isUniq: uniq,
                            mode: "ins",
                        }
                    ],
                    periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
                }
            ];

            updateCubeData2(
                'cubeSNomen',
                moment().format('YYYY-MM-DD'),
                JSON.stringify(data),
                {},
                {}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'), this.buildComponent()) : message.error(res.errors[0].text))
            editable[key + c] = false;
            this.setState({editable: editable});


        }
    };


    onChangeDate = (value, key, c) => {

        let tableData = [...this.state.tableData];
        let row = tableData.find(el => el.key == key);
        if (row[c] === null) {
            row[c] = {}
        }
        row[c].value = value.format('DD-MM-YYYY');
        this.setState({
            tableData: tableData
        })
    };

    handleChange = (e, key, c) => {

        let tableData = [...this.state.tableData];
        let row = tableData.find(el => el.key == key);
        if (row[c] === null) {
            row[c] = {}
        }

        if (c == 'name') {
            row.name = {ru: e.target.value, kz: e.target.value, en: e.target.value};
            row.fullName = {ru: e.target.value, kz: e.target.value, en: e.target.value};
        } else {
            row[c].value = e.target.value;
            row[c].valueLng = {
                kz: e.target.value,
                ru: e.target.value,
                en: e.target.value
            };
        }
        this.setState({
            tableData: tableData
        })
    };

    edit = (obj) => {
        let editable = {...this.state.editable};
        editable[obj[0]] = true;
        this.setState({editable: editable});

    };


    buildComponent = () => {
        this.setState({
            iconLoading: false
        });
        if (this.props.listIdOfNomen.length > 0) {
            var StringedlistArr = this.props.listIdOfNomen.join(',');
            const filterNomen = {
                filterDPAnd: [
                    {
                        dimConst: 'dimPropNomen',
                        concatType: "and",
                        conds: [
                            {
                                consts: "nomenNumber,nomenYear,fileNomen,nomenPerechen,nomenApprovalDate,nomenApprovalDocNumber,nomenApprovalFile,nomenAgreementDate,nomenAgreementDocNumber,nomenAgreementFile"
                            }
                        ]
                    }
                ],
                filterDOAnd: [
                    {
                        dimConst: 'dimObjNomen',
                        concatType: "and",
                        conds: [
                            {
                                ids: String(StringedlistArr)
                            }
                        ]
                    }
                ],
            };
            const fd = new FormData();
            fd.append("cubeSConst", 'cubeSNomen');
            fd.append("filters", JSON.stringify(filterNomen));
            axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res3 => {
                    var cubeData = res3.data.data;
                    const parsedCube = parseCube_new(
                        cubeData["cube"],
                        [],
                        "dp",
                        "do",
                        cubeData['do_' + this.props.tofiConstants.dimObjNomen.id],
                        cubeData['dp_' + this.props.tofiConstants.dimPropNomen.id],
                        ['do_' + this.props.tofiConstants.dimObjNomen.id],
                        ['dp_' + this.props.tofiConstants.dimPropNomen.id]
                    );

                    var tableData = parsedCube.map(this.renderTableData);
                    var oldTableData = JSON.parse(JSON.stringify(tableData));

                    let newObjPerechen = {};

                    for (let i of tableData) {
                        newObjPerechen[i.key] = i.nomenPerechen;
                    }


                    this.setState({
                        perechenListValue: newObjPerechen,
                        cubeData: cubeData,
                        oldTableData: oldTableData,
                        tableData: tableData
                    });
                }
            );
        } else {
            this.setState({
                iconLoading: false,
                oldTableData: [],
                tableData: []
            });
        }

    }
    ;

    renderTableData = (item, idx) => {
        const result = {
            key: item.id,
            name: item.name
        };

        const constArr = ['nomenNumber', 'nomenYear', 'fileNomen', 'nomenPerechen', 'nomenApprovalDate', 'nomenApprovalDocNumber', 'nomenApprovalFile', 'nomenAgreementDate', 'nomenAgreementDocNumber', 'nomenAgreementFile'];
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


    componentDidMount() {
        this.buildComponent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.listIdOfNomen !== this.props.listIdOfNomen) {
            this.buildComponent();
        }
    }


    onRowClick = record => {
        this.setState({
            selectedRow: record,
            openCard: true
        })

    };

    delNom = (id) => {

        let fd = new FormData();
        fd.append("cubeSConst", 'cubeSNomen');
        fd.append("dimObjConst", 'dimObjNomen');
        fd.append("objId", id.split('_')[1]);
        const hideLoading = message.loading(this.props.t('REMrOVING'), 30);
        dObj(fd)
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                    this.buildComponent()
                } else {
                    throw res
                }
            }).catch(err => {
            console.error(err);
            message.error(this.props.t('REMOVING_ERROR'))
        })
    };

    showFile = (key) => {
        getFile(key.__file__id).then(blob => {
            let ext = blob.headers['content-disposition'].slice(-4).replace(/['"]+/g, '');
            let type = ext === 'pdf' ?  'application/pdf' : 'image/jpeg';
            const url = URL.createObjectURL(new Blob([blob.data], {type:type}));
            this.setState({
                modalOpen: true,
                file: <iframe src={`${url}#toolbar=0`} frameBorder="0"/>
            })
        })
    };

    changeObjName = (e) => {
        this.setState({
            newObjName: e.target.value
        })
    };


    onChangeFile = (e, c, key) => {
        let data = [
            {
                own: [{
                    doConst: 'dimObjNomen',
                    doItem: String(key),
                    isRel: "0",
                    objData: {}
                }
                ],
                periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
            }
        ];
        var nomenApprovalFile = [];
        nomenApprovalFile[0] = e.target.files[0];

        updateCubeData2(
            'cubeSNomen',
            moment().format('YYYY-MM-DD'),
            JSON.stringify(data),
            {},
            {nomenApprovalFile}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'), this.buildComponent()) : message.error(res.errors[0].text))

    };
    onChangeFile2 = (e, c, key) => {
        let data = [
            {
                own: [{
                    doConst: 'dimObjNomen',
                    doItem: String(key),
                    isRel: "0",
                    objData: {}
                }
                ],
                periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
            }
        ];
        var nomenAgreementFile = [];
        nomenAgreementFile[0] = e.target.files[0];

        updateCubeData2(
            'cubeSNomen',
            moment().format('YYYY-MM-DD'),
            JSON.stringify(data),
            {},
            {nomenAgreementFile}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'), this.buildComponent()) : message.error(res.errors[0].text))

    };
    onChangeFile3 = (e, c, key) => {
        let data = [
            {
                own: [{
                    doConst: 'dimObjNomen',
                    doItem: String(key),
                    isRel: "0",
                    objData: {}
                }
                ],
                periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
            }
        ];
        var fileNomen = [];
        fileNomen[0] = e.target.files[0];

        updateCubeData2(
            'cubeSNomen',
            moment().format('YYYY-MM-DD'),
            JSON.stringify(data),
            {},
            {fileNomen}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'), this.buildComponent()) : message.error(res.errors[0].text))

    };


    loadOptions = (c) => {
        axios.get(`/${localStorage.getItem('i18nextLng')}/entity/getAllObjOfCls?clsConst=${c}&dte=${''}&propConsts=${'invNumber'}`).then(res => {
            let listOfPerechen = res.data.data;
            this.setState({
                nomenPerechenOptions: listOfPerechen
            })

        })
    };


    delFile = async file => {

        // remove file from server and go on
        const res = await dFile(file.__file__id, 'cubeSNomen');
        if (!res.success) {
            //  on fail stop here with message;
            res.errors.forEach(err => {
                message.error(err.text);
            });

            return;
        } else {

            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            this.buildComponent()
        }
    };


    onPerechenListChange = (s, key) => {
        let oldStatePerch = {...this.state.perechenListValue};

        oldStatePerch[key] = s;


        this.setState({
            perechenListValue: oldStatePerch
        })
    };

    showTreeModal = () => {
        this.setState({
            showTreeModal: true
        })
    };

    render() {


        const {t} = this.props;
        const {nomenYear, fileNomen, nomenPerechen, nomenApprovalDate, nomenApprovalDocNumber, nomenApprovalFile, nomenAgreementDate, nomenAgreementDocNumber, nomenAgreementFile} = this.props.tofiConstants;
        this.lng = localStorage.getItem('i18nextLng');
        const columns = [
            {
                key: "nomenNumber",
                title: "№",
                dataIndex: 'nomenNumber',
                width: '5%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'nomenNumber'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <Input
                                                value={obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                                onChange={(e) => this.handleChange(e, rec.key, 'nomenNumber')}
                                                onPressEnter={() => this.check(obj, rec.key, 'nomenNumber')}
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'nomenNumber', '315')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'nomenNumber'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: "name",
                title: "Название",
                dataIndex: 'name',
                width: '10%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'name'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <Input
                                                value={obj ? obj[this.lng] : ''}
                                                onChange={(e) => this.handleChange(e, rec.key, 'name')}
                                                onPressEnter={() => this.check(obj, rec.key, 'name', 'name')}
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'name', 'name')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj[this.lng] : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'name'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: "nomenYear",
                title: nomenYear.name[this.lng],
                dataIndex: 'nomenYear',
                width: '10%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'nomenYear'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <Input
                                                value={obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                                onChange={(e) => this.handleChange(e, rec.key, 'nomenYear')}
                                                onPressEnter={() => this.check(obj, rec.key, 'nomenYear')}
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'nomenYear', '315')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'nomenYear'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: "fileNomen",
                title: fileNomen.name[this.lng],
                dataIndex: 'fileNomen',
                width: '4%',
                render: (obj, rec) => obj ? <Row>
                        <Col span={18}>
                            <Button type="primary"
                                    className="centerIcon"
                                    icon="eye"
                                    shape='circle'
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '10px'
                                    }} onClick={() => this.showFile(obj.value)}/>
                        </Col>
                        <Col span={6}>

                            <Popconfirm title={this.props.t('CONFIRM_REMOVE')}
                                        onConfirm={() => this.delFile(obj.value)}
                                        okText="Да"
                                        cancelText="Нет">
                                <Icon style={{color: 'red', position: 'relative', top: '5px'}}
                                      type="delete"/>
                            </Popconfirm>


                        </Col>
                    </Row> :

                    <label>
                        <input
                            type="file"
                            style={{display: 'none'}}
                            onChange={(e) => this.onChangeFile3(e, 'fileNomen', rec.key)}/>
                        <span className='ant-btn ant-btn-primary'><Icon
                            type='upload'/>
                    </span>
                    </label>
            },
            {
                key: "nomenPerechen",
                title: nomenPerechen.name[this.lng],
                dataIndex: 'nomenPerechen',
                width: '15%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'nomenPerechen'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <Select
                                                name="perechenList"
                                                isMulti
                                                value={this.state.perechenListValue[rec.key]}
                                                onChange={(s) => this.onPerechenListChange(s, rec.key)}
                                                isSearchable={false}
                                                placeholder={this.props.tofiConstants.nomenPerechen.name[this.lng]}
                                                onMenuOpen={() => this.loadOptions("perechenList")}
                                                options={
                                                    this.state.nomenPerechenOptions
                                                        ? this.state.nomenPerechenOptions.map(option => ({
                                                            value: option.id,
                                                            label: option.name[this.lng]
                                                        }))
                                                        : []
                                                }
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'nomenPerechen', '41')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.map(el => el.label).join(', ') : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'nomenPerechen'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: "nomenApprovalDate",
                title: nomenApprovalDate.name[this.lng],
                dataIndex: 'nomenApprovalDate',
                width: '15%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'nomenApprovalDate'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <DatePicker
                                                onChange={(val) => {
                                                    this.onChangeDate(val, rec.key, 'nomenApprovalDate')
                                                }
                                                }
                                                defaultValue={obj ? moment(obj.value, 'DD-MM-YYYY') : moment()}
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'nomenApprovalDate', '312')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.value : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'nomenApprovalDate'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: "nomenApprovalDocNumber",
                title: nomenApprovalDocNumber.name[this.lng],
                dataIndex: 'nomenApprovalDocNumber',
                width: '9%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'nomenApprovalDocNumber'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <Input
                                                value={obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                                onChange={(e) => this.handleChange(e, rec.key, 'nomenApprovalDocNumber')}
                                                onPressEnter={() => this.check(obj, rec.key, 'nomenApprovalDocNumber')}
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'nomenApprovalDocNumber', '315')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'nomenApprovalDocNumber'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: "nomenApprovalFile",
                title: nomenApprovalFile.name[this.lng],
                dataIndex: 'nomenApprovalFile',
                width: '5%',
                render: (obj, rec) => obj ?
                    <Row>
                        <Col span={18}>
                            <Button type="primary"
                                    className="centerIcon"
                                    icon="eye"
                                    shape='circle'
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '10px'
                                    }} onClick={() => this.showFile(obj.value)}/>
                        </Col>
                        <Col span={6}>

                            <Popconfirm title={this.props.t('CONFIRM_REMOVE')}
                                        onConfirm={() => this.delFile(obj.value)}
                                        okText="Да"
                                        cancelText="Нет">
                                <Icon style={{color: 'red', position: 'relative', top: '5px'}}
                                      type="delete"/>
                            </Popconfirm>


                        </Col>
                    </Row>
                    :

                    <label>
                        <input
                            type="file"
                            style={{display: 'none'}}
                            onChange={(e) => this.onChangeFile(e, 'nomenApprovalFile', rec.key)}/>
                        <span className='ant-btn ant-btn-primary'><Icon
                            type='upload'/>
                    </span>
                    </label>
            },
            {
                key: "nomenAgreementDate",
                title: nomenAgreementDate.name[this.lng],
                dataIndex: 'nomenAgreementDate',
                width: '15%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'nomenAgreementDate'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <DatePicker
                                                onChange={(val) => {
                                                    this.onChangeDate(val, rec.key, 'nomenAgreementDate')
                                                }
                                                }
                                                defaultValue={obj ? moment(obj.value, 'DD-MM-YYYY') : moment()}
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'nomenAgreementDate', '312')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.value : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'nomenAgreementDate'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: "nomenAgreementDocNumber",
                title: nomenAgreementDocNumber.name[this.lng],
                dataIndex: 'nomenAgreementDocNumber',
                width: '7%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'nomenAgreementDocNumber'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <Input
                                                value={obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                                onChange={(e) => this.handleChange(e, rec.key, 'nomenAgreementDocNumber')}
                                                onPressEnter={() => this.check(obj, rec.key, 'nomenAgreementDocNumber')}
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'nomenAgreementDocNumber', '315')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'nomenAgreementDocNumber'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: "nomenAgreementFile",
                title: nomenAgreementFile.name[this.lng],
                dataIndex: 'nomenAgreementFile',
                width: '5%',
                render: (obj, rec) => obj ? <Row>
                        <Col span={18}>
                            <Button type="primary"
                                    className="centerIcon"
                                    icon="eye"
                                    shape='circle'
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '10px'
                                    }} onClick={() => this.showFile(obj.value)}/>
                        </Col>
                        <Col span={6}>

                            <Popconfirm title={this.props.t('CONFIRM_REMOVE')}
                                        onConfirm={() => this.delFile(obj.value)}
                                        okText="Да"
                                        cancelText="Нет">
                                <Icon style={{color: 'red', position: 'relative', top: '5px'}}
                                      type="delete"/>
                            </Popconfirm>


                        </Col>
                    </Row> :

                    <label>
                        <input
                            type="file"
                            style={{display: 'none'}}
                            onChange={(e) => this.onChangeFile2(e, 'nomenAgreementFile', rec.key)}/>
                        <span className='ant-btn ant-btn-primary'><Icon
                            type='upload'/>
        </span>
                    </label>
            },
        ];

        return (
            <div>
                <Popconfirm title={this.props.t('CONFIRM_REMOVE')}
                            onConfirm={() => this.delNom(this.state.selectedRow.key)}
                            okText="Да"
                            cancelText="Нет">
                    <Button type='danger'
                            className='margin0-15'
                            disabled={!this.state.selectedRow}>Удалить</Button>
                </Popconfirm>
                <Button className='margin0-15' type='primary' disabled={!this.state.selectedRow}
                        onClick={this.showTreeModal}>
                    Создать/редактировать содержание номенклатуры
                </Button>
                <h1>Таблица номенклатур</h1>
                <Row>
                    <Col span={16}>
                        <Input onChange={this.changeObjName} value={this.state.newObjName}/>
                    </Col>
                    <Col span={8}>
                        <Button type="primary" icon="plus-circle-o"
                                loading={this.state.iconLoading}
                                style={{margin: '5px'}}
                                disabled={!this.state.newObjName}
                                onClick={this.addRow}>
                            Добавить
                        </Button>
                    </Col>
                </Row>


                <AntTable loading={false}
                          columns={columns}
                          dataSource={this.state.tableData}
                          changeSelectedRow={this.changeSelectedRow}
                          onRowClick={this.onRowClick}
                          className='nomenTable'
                          rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
                />


                <Modal visible={this.state.showTreeModal}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}
                       cancelText="Закрыть"
                       footer={false}
                       className="w80">
                    <ModalNomen
                        t={t}
                        selectedIK={this.props.selectedIK}
                        tofiConstants={this.props.tofiConstants}
                        dateIncludeOfIk={this.props.dateIncludeOfIk}
                        initialValues={this.state.selectedRow}
                        rerender={this.buildComponent}

                    />
                </Modal>


                <Modal visible={this.state.modalOpen}
                       onCancel={this.handleCancel}
                       cancelText="Закрыть"
                       className="w80">
                    <div className="Viewer-window h70vh">
                        {this.state.file}
                    </div>
                </Modal>

            </div>
        )
    }

}

export default NomenTable;
