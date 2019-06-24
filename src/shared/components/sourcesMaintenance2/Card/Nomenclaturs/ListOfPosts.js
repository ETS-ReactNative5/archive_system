import React from "react"
import {Button, Col, Input, message, Modal, Row, Tree} from "antd";
import axios from 'axios';
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import AntTable from "../../../AntTable";

const TreeNode = Tree.TreeNode;

class ListOfPosts extends React.Component {
    state = {
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
        tableData: []
    };


    componentDidMount() {
        this.buildComponent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedChildren !== this.props.selectedChildren) {
            this.buildComponent();
        }


    }


    buildComponent = () => {
        this.setState({
            tableLoad: true
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
                `dp_${this.props.tofiConstants['dimPropNomen'].id}`).map(this.renderTableData)

                this.setState({
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

    render() {
        this.lng = localStorage.getItem('i18nextLng');
        const columns = [
            {
                key: "nomenIndex",
                title: this.props.tofiConstants['nomenIndex'].name[this.lng],
                dataIndex: 'nomenIndex',
                width: '18%',
                render: obj => obj && obj.value
            },
            {
                key: "name",
                title: "Название",
                dataIndex: 'name',
                width: '18%'
            },
            {
                key: "numberOfNomenCases",
                title: this.props.tofiConstants['numberOfNomenCases'].name[this.lng],
                dataIndex: 'numberOfNomenCases',
                width: '18%',
                render: obj => obj && obj.value
            },
            {
                key: "shelfLifeOfNomenCases",
                title: this.props.tofiConstants['shelfLifeOfNomenCases'].name[this.lng],
                dataIndex: 'shelfLifeOfNomenCases',
                width: '18%',
                render: obj => obj && obj.value
            },

            {
                key: "nomenCasesNote",
                title: this.props.tofiConstants['nomenCasesNote'].name[this.lng],
                dataIndex: 'nomenCasesNote',
                width: '18%',
                render: obj => obj && obj.valueLng[this.lng]
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


export
default
ListOfPosts;
