import React, { Component } from 'react';
import AntTable from "../../../AntTable";
import {CSSTransition} from "react-transition-group";
import SiderCard from "../../../SiderCard";
import {Button} from "antd";
import CardDoc from "./CardDoc";

class Table_invTypePerm_urpDoc extends Component {

  render() {

    const {lng, loading, changeSelectedRow, openCardDoc, tofiConstants: {
      fundNumber, caseDbeg, caseDend, pageNumberStart, turnoverSheetStart, pageNumberEnd,
      turnoverSheetEnd, documentPapers
    } } = this.props;
    return (
      <div>
        <AntTable
          columns={[
            {
              key: 'fundNumber',
              title: fundNumber.name[lng],
              dataIndex: 'fundNumber',
              width: '10%'
            },
            {
              key: 'pageNumberStart',
              title: pageNumberStart.name[lng],
              dataIndex: 'pageNumberStart',
              width: '10%'
            },
            {
              key: 'turnoverSheetStart',
              title: turnoverSheetStart.name[lng],
              dataIndex: 'turnoverSheetStart',
              width: '10%'
            },
            {
              key: 'pageNumberEnd',
              title: pageNumberEnd.name[lng],
              dataIndex: 'pageNumberEnd',
              width: '10%'
            },
            {
              key: 'turnoverSheetEnd',
              title: turnoverSheetEnd.name[lng],
              dataIndex: 'turnoverSheetEnd',
              width: '10%'
            },
            {
              key: 'documentPapers',
              title: documentPapers.name[lng],
              dataIndex: 'documentPapers',
              width: '10%',
              render: obj => obj && obj.label
            },
            {
              key: 'caseDbeg',
              title: caseDbeg.name[lng],
              dataIndex: 'caseDbeg',
              width: '10%',
              render: obj => obj && obj.label
            },
            {
              key: 'caseDend',
              title: caseDend.name[lng],
              dataIndex: 'caseDend',
              width: '10%',
              render: obj => obj && obj.label
            }
          ]}
          loading={ loading }
          dataSource={ this.filteredData }
          openedBy='Cases'
          changeSelectedRow={changeSelectedRow}
        />
        <CSSTransition
          in={openCardDoc}
          timeout={300}
          classNames="left card"
          unmountOnExit
        >
          <SiderCard
            closer={<Button type='danger' className='left' onClick={() => this.setState({ openCardDoc: false })} shape="circle" icon="arrow-left"/>}
          >
            <CardDoc
              /*onSaveCubeData={onSaveCubeData}
              initialValues={this.state.docInitialValues}
              tofiConstants={tofiConstants}
              t={t}*/
            />
          </SiderCard>
        </CSSTransition>
      </div>
    )
  }
}

export default Table_invTypePerm_urpDoc;