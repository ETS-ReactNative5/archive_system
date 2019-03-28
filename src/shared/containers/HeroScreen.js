import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
import {listObjByProp, getObjChilds, getObjChildsById} from "../actions/actions";
import Bookshelf from "../components/Bookshelf";

const TreeNode = Tree.TreeNode;

class HeroScreen extends Component {

  state = {
    loading: false,
    treeData: [],
    selectedNode: null,
    fundGuidebookDescription: {},
    cases: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    getObjChilds('guidebookGAPO')
      .then(res => {
        this.setState({ loading: false })
        if(res.success) {
          this.setState({
            treeData: res.data.map(o => ({
              key: o.id,
              title: o.name[this.lng],
              isLeaf: !o.hasChild
            }))
          })
        }
      })
      .catch(err => {
        console.warn(err);
      })
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
      return <TreeNode {...item} dataRef={item}/>;
    });
  };
  onLoadData = (treeNode) => {
    if(treeNode.props.dataRef.children) {
      return Promise.resolve({success: true})
    }
    return getObjChildsById(treeNode.props.dataRef.key)
      .then(res => {
        if(res.success) {
          treeNode.props.dataRef.children = res.data.map(o => ({
            key: o.id,
            title: o.name[this.lng],
            isLeaf: !o.hasChild,
          }));
          this.setState({
            treeData: [...this.state.treeData],
          });
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };

  onSelect = (selectedKeys, info) => {
    if(info.node.props.dataRef.isLeaf) {
      this.setState({selectedNode: info.node.props.dataRef, loading: true, fundGuidebookDescription: {}, cases: []});
      const fd = new FormData();
      fd.append('clsConst', 'fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP');
      fd.append('propConst', 'fundToGuidbook');
      fd.append('withProps', 'fundGuidebookDescription,fundNumber');
      fd.append('value', String(info.node.props.dataRef.key));
      listObjByProp(fd)
        .then(res => {
          if(res.success) {
            this.setState({ cases: res.data, loading: false })
          } else {
            throw res
          }
        }).catch(err => console.warn(err))
    } else {
      this.setState({selectedNode: null, fundGuidebookDescription: {}});
    }
  };
  handleMouseEnter = (name, fundGuidebookDescription) => {
    this.setState({fundGuidebookDescription});
  };
  render() {
    this.lng = localStorage.getItem('i18nextLng');
    return (
      <div className="hero">
        <div className="hero-content">
          {this.state.loading && <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>}
          <div className="hero-content__tree">
            <Tree
              loadData={this.onLoadData}
              onSelect={this.onSelect}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </div>
          {this.state.selectedNode ? <div className="hero-content__viewer">
            <div className="hero-content__viewer_header">
              <Bookshelf cases={this.state.cases} handleMouseEnter={this.handleMouseEnter}/>
            </div>
            <div
              className="hero-content__viewer_body"
              dangerouslySetInnerHTML={{ __html: this.state.fundGuidebookDescription[this.lng] }}
            />
          </div> :
          <iframe title="guide" src={`${process.env.PUBLIC_URL}/Предисловие.pdf#toolbar=0`} frameBorder="0" width='100%'/>}
        </div>
      </div>
    );
  }
}

export default HeroScreen;
