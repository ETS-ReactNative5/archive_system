import React from 'react';
import {getAllPermis, getRolePermis, savePrivs} from "../../../actions/actions";

import AntTable from "../../AntTable";
import {Tree, message, Button} from 'antd';

const TreeNode = Tree.TreeNode;


class UsersRolesCard extends React.Component {
    state = {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        tree: [{
            title: 'Архив',
            key: 'Архив'
        }]

    };


    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({checkedKeys});
    }

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({selectedKeys});
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }


    initChildren = el => {
        const result = {
            key: el.id,
            title: el.txt[localStorage.getItem('i18nextLng')]
        }
        if (el.hasChild) {
            result.children = this.permis
                .filter(elem => elem.parent == el.id)
                .map(this.initChildren);
        }
        return result;
    };


    componentDidMount() {
        getAllPermis()
            .then(response => {
                console.log(response);
                this.permis = response.data;
                const allPermis = this.permis
                    .filter(o => !(o.parent)) // get first level objects only (parent equals to "0")
                    .map(this.initChildren);
                this.setState({
                    tree: allPermis
                });
                console.log(this.state.tree);
            })

        getRolePermis(this.props.record.key)
            .then(response => {
                    let recivedRoles=[];
                    response.data.forEach(el => {recivedRoles.push(el.id)});
                    this.setState({
                        checkedKeys: recivedRoles
                    });
                }
            )
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.record.key !== prevProps.record.key) {
            getRolePermis(this.props.record.key)
                .then(response => {
                        this.setState({
                            checkedKeys: response.data.map(el => el.id)
                        });
                    }
                )
        }
    }


    render() {
        return <div>
            <h3> - Привелегии роли </h3>
            <Button type="primary" onClick={ () => {
                savePrivs(this.props.record.key, this.state.checkedKeys.checked.join(',')).then((res) => {
                    if(!!res.data.errors){
                        for (let item of res.data.errors){
                            message.error(item.text)
                        }
                    }else {
                        message.success("Роль обновлена")

                    }
                }).catch(e => {
                    console.log(e)
                })
            }
            }>Сохранить</Button>
            <Tree
                checkable
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

                {this.renderTreeNodes(this.state.tree)}
            </Tree>


            {/*  <AntTable
             dataSource={this.state.data}
             columns={columns}
             />*/}

            <privTree/>
        </div>
    }
}


export default UsersRolesCard;