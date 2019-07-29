import React from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {Breadcrumb, DatePicker} from 'antd';
import AntTabs from '../../AntTabs'
import moment from 'moment';
import {Link, Route, Switch} from 'react-router-dom';
import {getCube, getObjByObjVal} from '../../../actions/actions';
import {isEmpty} from 'lodash';
// Главная страница (табы) пункта меню "источники комплектования"
import SizeFile from "./Sizefile"
import SizeDetal from "./SizeDetal"
class Size extends React.PureComponent {

    state = {
        loading: false,
        date: moment()
    };
    render() {
        const {t, tofiConstants, saveProps, selectedIK,dateIncludeOfIk} = this.props;
        return (
            <div className="SourcesMaintenancePage" style={{marginTop:10}}>

                <AntTabs
                    tabs={[
                        {
                            tabKey: 'Size1',
                            tabName: t('SIZEDETAL'),
                            tabContent:<SizeDetal
                                t={t}
                                selectedIK={selectedIK}
                                tofiConstants={tofiConstants}
                                dateIncludeOfIk={dateIncludeOfIk}
                            />

                        },
                        {
                            tabKey: 'individuals',
                            tabName: t('SIZEFILE'),
                            tabContent:
                                <SizeFile
                                    t={t}
                                    selectedIK={selectedIK}
                                    tofiConstants={tofiConstants}
                                    dateIncludeOfIk={dateIncludeOfIk}
                                />

                        }
                    ]}

                />
            </div>
        )
    }
}


export default Size;