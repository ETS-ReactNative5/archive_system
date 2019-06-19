import React from "react"
import {Button, Col, Input, message, Modal, Row, Tree} from "antd";
import {connect} from "react-redux";
import {createObj, getAllObjOfCls, getCube} from "../../../../actions/actions";
import {parseCube_new} from "../../../../utils/cubeParser";
import axios from 'axios';
import ListOfPosts from "./ListOfPosts";

const TreeNode = Tree.TreeNode;

class ModalNomen extends React.Component {
    state = {
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
        newNameRazdel: ''
    };


    buildComponent = () => {
        const filters = {
            filterDOAnd: [
                {
                    dimConst: 'dimObjNomen',
                    concatType: "and",
                    conds: [
                        {
                            ids: this.props.initialValues.key
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
                            consts: "nomenPerechen"
                        }
                    ]
                }
            ]
        };

        const fd = new FormData();
        fd.append("cubeSConst", 'cubeSNomen');
        fd.append("filters", JSON.stringify(filters));
        fd.append("nodeWithChilds", 1);

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
                `dp_${this.props.tofiConstants['dimPropNomen'].id}`).map(this.renderTableDataInv)


                this.setState({
                    data: getChildren(this.props.initialValues.key, parseCubeData),
                    loading: false,
                });

                function getChildren(parentId, array) {
                    let children = [];
                    array.forEach((item) => {
                        if (item.parent === parentId) {
                            let child = item;
                            let myChildren = getChildren(item.key, array)
                            if (myChildren.length > 0) child.children = myChildren;
                            children.push(child);
                        }
                    });
                    return children;
                }
            }
        });


    };


    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({checkedKeys});
    };

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);

        /*Условия кнопки Добавить раздел*/
        if (!!info.selectedNodes && !!info.selectedNodes[0] && !!info.selectedNodes[0].props && !!info.selectedNodes[0].props.children) {
            this.setState({
                selectedKeys,
                addDocToNode: false,
            });
        } else if (selectedKeys.length > 0) {
            this.setState({
                selectedKeys,
                addDocToNode: true
            });
        }

        if (!!selectedKeys[0]) {
            this.setState({
                addLevel: 'Добавить подраздел'
            })
        } else {
            this.setState({
                addLevel: 'Добавить раздел'
            })
        }


        if (
        (info.node.props.children && info.node.props.children.find(el => el.props.clsORtr == this.props.tofiConstants['nomenItemList'].id)) ||
        (info.node.props.clsORtr == this.props.tofiConstants['nomenItemList'].id)
        ) {
            this.setState({
                disabledAddRazdel: true
            })
        } else {
            this.setState({
                disabledAddRazdel: false
            })
        }


        if (selectedKeys.length == 0) {
            this.setState({
                selectedKeys: [],
                disabledAddRazdel: false,
                addLevel: 'Добавить раздел'
            })
        }


        /* конец Условия кнопки Добавить раздел*/


        /*Условия кнопки Добавить перечень*/
        if ((info.node.props.clsORtr == this.props.tofiConstants['nomenItemList'].id) || (info.node.props.children && info.node.props.children.find(el => el.props.clsORtr == this.props.tofiConstants['nomenNodeList'].id))) {
            this.setState({
                disabledAddItem: true,
                selectedKeysid:null,
            })
        } else {
            this.setState({
                selectedKeysid:selectedKeys[0],
                selectedChildren:info.node.props.children,
                disabledAddItem: false
            })
        }

        /*Условия кнопки Добавить перечень*/
    };

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            showAddModal: false,
        });
    };

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                <TreeNode title={item.title} key={item.key} dataRef={item.parent}
                          clsORtr={item.clsORtr}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });

    };

    renderTableDataInv = (item, ids) => {
        this.lng = localStorage.getItem('i18nextLng');
        return {
            key: item.id,
            numb: ids + 1,
            title: item.name[this.lng],
            parent: item.parent,
            clsORtr: item.clsORtr
        }
    };


    componentDidMount() {
        this.buildComponent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedNomen !== this.props.selectedNomen) {
            this.buildComponent();

        }

    }

    addNewRazdel = () => {
        const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
        console.log(this.state.newNameRazdel);
        var name = {
            kz: this.state.newNameRazdel,
            ru: this.state.newNameRazdel,
            en: this.state.newNameRazdel
        };

        const cube = {
            cubeSConst: 'cubeSNomen',
            doConst: 'dimObjNomen',
            dpConst: 'dimPropNomen'
        };

        var selectedKeys = this.state.selectedKeys;
        var obj = {
            name: name,
            fullName: name,
            clsConst: 'nomenNodeList',
        };

        if (!!selectedKeys[0]) {
            obj.parent = selectedKeys[0].split("_")[1]
        } else {
            obj.parent = this.props.initialValues.key.split("_")[1]
        }

        createObj(cube, obj).then(res => {
            hideCreateObj();

            if (res.success) {
                message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'), 3);
                this.setState({
                    showAddModal: false
                });
                this.buildComponent();
            }
        })
    };
    changeName = (e) => {
        this.setState({
            newNameRazdel: e.target.value
        })
    };


    addNewPost = () => {
        const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
        console.log(this.state.newNameRazdel);
        var name = {
            kz: this.state.newNamePost,
            ru: this.state.newNamePost,
            en: this.state.newNamePost
        };

        const cube = {
            cubeSConst: 'cubeSNomen',
            doConst: 'dimObjNomen',
            dpConst: 'dimPropNomen'
        };

        var selectedKeys = this.state.selectedKeys;
        var obj = {
            name: name,
            fullName: name,
            clsConst: 'nomenItemList',
        };

        if (!!selectedKeys[0]) {
            obj.parent = selectedKeys[0].split("_")[1];
            createObj(cube, obj).then(res => {
                hideCreateObj();

                if (res.success) {
                    message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'), 3);
                    this.setState({
                        showAddModalPost: false
                    });
                    this.buildComponent();
                }
            })
        } else {

        }


    };
    changeNamePost = (e) => {
        this.setState({
            newNamePost: e.target.value
        })
    };

    render() {
        return (
        <div>
            <Row>
                <Col span={6}>
                    <Button onClick={() => {
                        this.setState({
                            showAddModal: true
                        })
                    }} disabled={this.state.disabledAddRazdel}
                            type='primary'>{this.state.addLevel}</Button>
                    <Button onClick={() => {
                        this.setState({
                            showAddModalPost: true
                        })
                    }}
                            disabled={this.state.disabledAddItem} type='primary'>Добавить
                        статью</Button>

                    {!!this.state.data && <Tree
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                    newTree={this.state.data}
                    checkStrictly
                    >

                        {this.renderTreeNodes(this.state.data)}
                    </Tree>


                    }
                </Col>
                <Col span={18}>
                    <ListOfPosts
                    selectedKeysid={this.state.selectedKeysid}
                    selectedChildren={this.state.selectedChildren}
                    t={this.props.t}
                    selectedIK={this.props.selectedIK}
                    tofiConstants={this.props.tofiConstants}
                    dateIncludeOfIk={this.props.dateIncludeOfIk}
                    initialValues={this.state.initialValues}
                    />
                </Col>
            </Row>

            <Modal footer={null} onCancel={this.handleCancel}
                   visible={this.state.showAddModal}>
                <h5>{this.state.addLevel}</h5>
                <Row>
                    <Col span={20}>
                        <Input value={this.state.newNameRazdel}
                               onChange={(e) => this.changeName(e)}/>
                    </Col>
                    <Col span={4}>
                        <Button disabled={!this.state.newNameRazdel}
                                onClick={this.addNewRazdel} type='primary'
                                icon='plus'/>
                    </Col>
                </Row>
            </Modal>

            <Modal footer={null} onCancel={this.handleCancel}
                   visible={this.state.showAddModalPost}>
                <h5>Добавить статью</h5>
                <Row>
                    <Col span={20}>
                        <Input value={this.state.newNamePost}
                               onChange={(e) => this.changeNamePost(e)}/>
                    </Col>
                    <Col span={4}>
                        <Button disabled={!this.state.newNamePost}
                                onClick={this.addNewPost} type='primary'
                                icon='plus'/>
                    </Col>
                </Row>
            </Modal>
        </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        perechenListOptions: state.generalData.perechenList,
        cubeSNomen: state.cubes.cubeSNomen,
    }
}

export default connect(mapStateToProps, {getAllObjOfCls, getCube})(ModalNomen);
