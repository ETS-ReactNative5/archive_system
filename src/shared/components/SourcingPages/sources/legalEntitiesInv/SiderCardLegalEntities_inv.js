import React from 'react';
import classnames from 'classnames';
import {Button, Icon, Popconfirm, Tree} from "antd";
import {getObjListNew} from "../../../../actions/actions";
import {getObject} from "../../../../utils";

const TreeNode = Tree.TreeNode;

class SiderCardLegalEntities extends React.Component {

  state = {
    year: null,
    life: null,
    width: 600,
    handleBarLeft: -10,
    mouseDown: false,
    checkedKeys: [],
    treeData: [],
  };

  //===============================MAGIC========================================
  startX;
  startLeft;

  handleMouseDown = e => {
    this.startX = e.nativeEvent.clientX;
    this.startLeft = this.state.handleBarLeft - 200;
    this.setState({mouseDown: true, handleBarLeft: this.state.handleBarLeft - 200})
  };
  handleMouseUp = () => {
    this.setState({mouseDown: false, handleBarLeft: this.state.handleBarLeft + 200}, () => {
      const endLeft = this.state.handleBarLeft + 10;
      this.setState({width: this.state.width - endLeft, handleBarLeft: -10})
    });
  };
  handleMouseMove = e => {
    if (!this.state.mouseDown) return;
    const move = e.nativeEvent.clientX - this.startX;
    this.setState({handleBarLeft: this.startLeft + move});
  };
  //===============================MAGIC========================================

  componentDidMount() {
    // do not know formData
    const invNomenValue = this.props.formData.invNomen.map(obj => obj.value);
    this.setState({treeData: [], loading: true});
    invNomenValue.forEach(val => {
      const fd = new FormData();
      fd.append("parent", String(val));
      fd.append("propConsts", "nomenIndex");
      getObjListNew(fd)
        .then(res => {
          if (res.success) {
            this.setState({
              loading: false,
              treeData: this.state.treeData.concat(
                res.data.map(o => ({
                  key: o.id,
                  title: o.name[this.lng],
                  isLeaf: !o.hasChild,
                  nomenIndex: o.nomenIndex && o.nomenIndex[this.lng]
                }))
              )
            });
          } else {
            console.log(res);
            this.setState({loading: false});
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({loading: false});
        });
    });
  }

  onLoadData = treeNode => {
    if (treeNode.props.dataRef.children) {
      return Promise.resolve({success: true});
    }
    const fd = new FormData();
    fd.append("parent", treeNode.props.dataRef.key);
    fd.append("propConsts", "nomenIndex");
    return getObjListNew(fd)
      .then(res => {
        if (res.success) {
          treeNode.props.dataRef.children = res.data.map(o => ({
            key: o.id,
            title: o.name[this.lng],
            isLeaf: !o.hasChild,
            nomenIndex: o.nomenIndex && o.nomenIndex[this.lng]
          }));
          this.setState({
            treeData: [...this.state.treeData]
          });
          return {success: true};
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}/>;
    });
  };
  onCheck = (checkedKeys, e) => {
    const lastCheckedKeys = checkedKeys.filter(
      key => e.checkedNodes.find(o => o.key === key).props.isLeaf
    );
    this.setState({checkedKeys: lastCheckedKeys});
  };
  addCaseChild = () => {
    const newData = this.props.data.slice();
    const key = this.props.selectedNode.key;

    const row = getObject(newData, key);
    //do not know selected Node, so I can not find row

    if (!row.children) row.children = [];
    this.state.checkedKeys.forEach(key => {
      const branch = getObject(this.state.treeData, key);
      if (branch) {
        row.children.push({
          key,
          caseTitle: branch.title,
          objClass: "caseList",
          parent: row.key,
          fundIndex: branch.nomenIndex,
          caseNomenItem: {value: key, label: branch.title},
          caseInventory: this.props.lInv.id,
          title: (
            <span>
              {branch.title}
              {/*<a style={{marginLeft: '5px', right: '20px'}} onClick={() => this.editable(key)}><Icon type="edit"/></a>*/}
              <Popconfirm
                title={this.props.t('CONFIRM_REMOVE')}
                onConfirm={() => {
                  this.props.remove(key)
                }}>
              <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
            </Popconfirm>
          </span>)
        });
      }
    });
    this.props.addNewCase(newData);
  };

  render() {
    const {closer} = this.props;
    this.lng = localStorage.getItem('i18nextLng');
    return (
      <div className="card" style={{width: this.state.width}}>
        <div className={classnames('handleBar', {'mouse-down': this.state.mouseDown})}
             onMouseDown={this.handleMouseDown}
             onMouseUp={this.handleMouseUp}
             onMouseMove={this.handleMouseMove}
             onMouseLeave={this.handleMouseLeave}
             style={{left: this.state.handleBarLeft}}
        >
          <div className="handleBar-bar"/>
        </div>
        {closer}
        <Tree
          checkable
          loadData={this.onLoadData}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
        >
          {this.renderTreeNodes(this.state.treeData)}
        </Tree>
        <div className="ant-form-btns">
          <Button onClick={this.addCaseChild}>
            Сформировать
          </Button>
        </div>
      </div>
    )
  }
}

export default SiderCardLegalEntities;
