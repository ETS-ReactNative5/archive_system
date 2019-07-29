import React from 'react'
import {Button, Col, Icon, Input, message, Modal, Row, Select, Tree} from "antd";
import axios from 'axios';
import {onSaveCubeData, parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import AntTable from "../../../AntTable";
import {updateCubeData2} from "../../../../actions/actions";
import moment from "moment";

const {Option} = Select;

const TreeNode = Tree.TreeNode;

class ListOfPosts extends React.Component {
    state = {
        refresh:null,
        listTime: null,
        tableLoad: false,
        data: [],
        loading: false,
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        addDocToNode: false,
        addLevel: 'добавить раздел',
        disabledAddRazdel: false,
        disabledAddItem: true,
        showAddModal: false,
        showAddModalPost: false,
        newNameRazdel: '',
        tableData: [],
        editable: {},
        shelfLifeOfNomenCasesValue: {}
    };

    editPosts = (obj) => {
        let editable = {...this.state.editable};
        editable[obj[0]] = true;
        this.setState({editable: editable});

    };


    componentWillReceiveProps(props) {

    }


    componentDidMount() {
        this.buildComponent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedChildren !== this.props.selectedChildren) {
            this.buildComponent();
        }
    }


    buildComponent = () => {
        let children = [];
        for (let i of this.props.listTime) {
            children.push(<Option key={i.id}>{i.name.ru}</Option>)
        }
        this.setState({
            tableLoad: true,
            listTime: children
        });
        let postsObjs = this.props.selectedChildren;
        if (!postsObjs) {
            return;
        }
        let postsKeys = [...postsObjs.map(el => el.key)];
        const filters = {
            filterDOAnd: [
                {
                    dimConst: 'dimObjNomen',
                    concatType: "and",
                    conds: [
                        {
                            ids: postsKeys.join(',')
                        }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: 'dimPropNomen',
                    concatType: "and",
                    conds: [
                        {
                            consts: "nomenIndex,numberOfNomenCases,shelfLifeOfNomenCases,nomenCasesNote,nomenPerechenNode"
                        }
                    ]
                }
            ]
        };


        const fd = new FormData();
        fd.append("cubeSConst", 'cubeSNomen');
        fd.append("filters", JSON.stringify(filters));
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
            if (res.data.success == true) {
                var cubeData = res.data.data;
                const parseCubeData = parseCube_new(
                    cubeData['cube'],
                    [],
                    'dp',
                    'do',
                    cubeData[`do_${this.props.tofiConstants['dimObjNomen'].id}`],
                    cubeData[`dp_${this.props.tofiConstants['dimPropNomen'].id}`],
                    `do_${this.props.tofiConstants['dimObjNomen'].id}`,
                    `dp_${this.props.tofiConstants['dimPropNomen'].id}`).map(this.renderTableData);
                var oldTableData = JSON.parse(JSON.stringify(parseCubeData));
                this.setState({
                    oldTableData: oldTableData,
                    tableData: parseCubeData,
                    tableLoad: false
                })
            }
        });
    };


    renderTableData = (item, ids) => {
        this.lng = localStorage.getItem('i18nextLng');
        let result = {
            key: item.id,
            idx: ids + 1,
            name: item.name[this.lng],
        };
        const constArr = ['nomenIndex', 'numberOfNomenCases', 'shelfLifeOfNomenCases', 'nomenCasesNote', 'nomenPerechenNode'];
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


    handleChange = (e, key, c) => {

        let tableData = [...this.state.tableData];
        let row = tableData.find(el => el.key == key);
        if (row[c] === null) {
            row[c] = {}
        }

        if (c == 'name') {
            row.name = e.target.value;
            row.fullName = e.target.value;
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


    checkPosts = (obj, key, c, type) => {
        if (type == 'name') {
            data = [
                {
                    own: [{
                        doConst: 'dimObjNomen',
                        doItem: String(key),
                        isRel: "0",
                        objData: {name: {ru: obj, en: obj, kz: obj}, fullName: {ru: obj, en: obj, kz: obj}}
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
        if (type == '11') {
            let valueArr = this.state.shelfLifeOfNomenCasesValue[key];
            let data;

            if (obj && !!obj.idDataPropVal) {
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
                                idDataPropVal: obj.idDataPropVal,
                                val: valueArr,
                                typeProp: String(type),
                                periodDepend: "2",
                                isUniq: 1,
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
            } else {
                data = {
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
                            val: valueArr,
                            typeProp: String(type),
                            periodDepend: "2",
                            isUniq: 1,
                            mode: "ins",
                        }
                    ],
                    periods: [{
                        periodType: '0',
                        dbeg: '1800-01-01',
                        dend: '3333-12-31'
                    }]
                };
            }


            updateCubeData2(
                'cubeSNomen',
                moment().format('YYYY-MM-DD'),
                JSON.stringify(data),
                {},
                {}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'),this.buildComponent()) : message.error(res.errors[0].text));
            let editable = {...this.state.editable};
            editable[key + c] = false;



            this.setState({
           //     shelfLifeOfNomenCasesValue:{[rec.key]:valueArr},
                editable: editable})
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

        if (type == '21') {
            value = obj.value;
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
            if (type == '21') {
                val1 = parseInt(cell.value);
                val2 = parseInt(obj.value);
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
                    {}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED')) : message.error(res.errors[0].text));
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


    onListTimeChange = (s, key) => {
        let oldShelfLifeOfNomenCasesValue = {...this.state.shelfLifeOfNomenCasesValue};

        oldShelfLifeOfNomenCasesValue[key] = s;


        this.setState({
            shelfLifeOfNomenCasesValue: oldShelfLifeOfNomenCasesValue
        })
    };

    render() {
        this.lng = localStorage.getItem('i18nextLng');
        const columns = [
                {
                    key: "nomenIndex",
                    title: this.props.tofiConstants['nomenIndex'].name[this.lng],
                    dataIndex: 'nomenIndex',
                    width: '18%',
                    render: (obj, rec) => {
                        return (<div className="editable-cell">
                            {
                                this.state.editable[rec.key + 'nomenIndex'] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Input
                                                    value={obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                                    onChange={(e) => this.handleChange(e, rec.key, 'nomenIndex')}
                                                    onPressEnter={() => this.checkPosts(obj, rec.key, 'nomenIndex')}
                                                />
                                            </Col>
                                            <Col span={4}
                                                 style={{textAlign: 'right', paddingTop: '6px'}}>
                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.checkPosts(obj, rec.key, 'nomenIndex', '315')}
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
                                            onClick={() => this.editPosts([rec.key + 'nomenIndex'])}
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
                    width: '18%',
                    render: (obj, rec) => {
                        return (<div className="editable-cell">
                            {
                                this.state.editable[rec.key + 'name'] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Input
                                                    value={obj ? obj : ''}
                                                    onChange={(e) => this.handleChange(e, rec.key, 'name')}
                                                    onPressEnter={() => this.checkPosts(obj, rec.key, 'name', 'name')}
                                                />
                                            </Col>
                                            <Col span={4}
                                                 style={{textAlign: 'right', paddingTop: '6px'}}>
                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.checkPosts(obj, rec.key, 'name', 'name')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {obj ? obj : ''}
                                        <Icon
                                            type="edit"
                                            className="editable-cell-icon"
                                            onClick={() => this.editPosts([rec.key + 'name'])}
                                        />
                                    </div>
                            }
                        </div>)
                    }
                },
                {
                    key: "numberOfNomenCases",
                    title: this.props.tofiConstants['numberOfNomenCases'].name[this.lng],
                    dataIndex: 'numberOfNomenCases',
                    width: '18%',
                    render: (obj, rec) => {
                        return (<div className="editable-cell">
                            {
                                this.state.editable[rec.key + 'numberOfNomenCases'] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Input
                                                    value={obj ? obj.value : ''}
                                                    onChange={(e) => this.handleChange(e, rec.key, 'numberOfNomenCases')}
                                                    onPressEnter={() => this.checkPosts(obj, rec.key, 'numberOfNomenCases')}
                                                />
                                            </Col>
                                            <Col span={4}
                                                 style={{textAlign: 'right', paddingTop: '6px'}}>
                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.checkPosts(obj, rec.key, 'numberOfNomenCases', '21')}
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
                                            onClick={() => this.editPosts([rec.key + 'numberOfNomenCases'])}
                                        />
                                    </div>
                            }
                        </div>)
                    }
                },
                {
                    key: "shelfLifeOfNomenCases",
                    title: this.props.tofiConstants['shelfLifeOfNomenCases'].name[this.lng],
                    dataIndex: 'shelfLifeOfNomenCases',
                    width: '18%',

                    render: (obj, rec) => {
                        return (<div className="editable-cell">
                            {
                                this.state.editable[rec.key + 'shelfLifeOfNomenCases'] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Select
                                                    style={{width: '100%'}}
                                                    name="shelfLifeOfNomenCases"
                                                    value={this.state.shelfLifeOfNomenCasesValue[rec.key]}
                                                    onChange={(s) => this.onListTimeChange(s, rec.key)}
                                                    isSearchable={true}
                                                    placeholder={this.props.tofiConstants.shelfLifeOfNomenCases.name[this.lng]}
                                                >
                                                    {this.state.listTime}
                                                </Select>
                                            </Col>
                                            <Col span={4}
                                                 style={{textAlign: 'right', paddingTop: '6px'}}>
                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.checkPosts(obj, rec.key, 'shelfLifeOfNomenCases', '11')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {obj && obj.label}
                                        <Icon
                                            type="edit"
                                            className="editable-cell-icon"
                                            onClick={() => this.editPosts([rec.key + 'shelfLifeOfNomenCases'])}
                                        />
                                    </div>
                            }
                        </div>)
                    }
                },
                {
                    key: "nomenCasesNote",
                    title: this.props.tofiConstants['nomenCasesNote'].name[this.lng],
                    dataIndex: 'nomenCasesNote',
                    width: '18%',
                    render: (obj, rec) => {
                        return (<div className="editable-cell">
                            {
                                this.state.editable[rec.key + 'nomenCasesNote'] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Input
                                                    value={obj ? obj.valueLng ? obj.valueLng[this.lng] : '' : ''}
                                                    onChange={(e) => this.handleChange(e, rec.key, 'nomenCasesNote')}
                                                    onPressEnter={() => this.checkPosts(obj, rec.key, 'nomenCasesNote')}
                                                />
                                            </Col>
                                            <Col span={4}
                                                 style={{textAlign: 'right', paddingTop: '6px'}}>
                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.checkPosts(obj, rec.key, 'nomenCasesNote', '315')}
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
                                            onClick={() => this.editPosts([rec.key + 'nomenCasesNote'])}
                                        />
                                    </div>
                            }
                        </div>)
                    }
                },
                {
                    key: "nomenPerechenNode",
                    title: this.props.tofiConstants['nomenPerechenNode'].name[this.lng],
                    dataIndex: 'nomenPerechenNode',
                    width: '18%',
                    render: obj => obj && obj.label
                }
            ]

        ;
        return (
            <div>
                {!!this.props.selectedChildren ?
                    <AntTable loading={this.state.tableLoad}
                              dataSource={this.state.tableData}
                              columns={columns}/> : 'Выберите последний узел номенклатуры'}
            </div>
        )
    }

}


export default ListOfPosts;
