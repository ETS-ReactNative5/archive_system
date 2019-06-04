import React, {Component} from 'react';

import AntTabs from "../../AntTabs";
import {
    Button,
    Spin,
    Form,
    Input,
    Icon,
    DatePicker,
    Upload,
    Select,
    Collapse
} from "antd";
import axios from "axios"
import moment from "moment";
import SourcesMaintenanceForm from "./Characteristic_IK";
import PiNMD_IK from "./PiNMD_IK";
import Contact_IK from "./Contact_IK";

class Card extends Component {
    state = {
        dataoption: {},
        fileList: [],
        reportTypeOptions: [],

        loading: false
    }


    render() {
        const {t, tofiConstants, saveProps, initialValues,dateIncludeOfIk} = this.props;
        return <Spin spinning={this.state.loading}>
            <AntTabs
            tabs={[
                {
                    tabKey: 'mainInfo',
                    tabName: 'Характеристика',
                    tabContent: <SourcesMaintenanceForm
                    t={t}
                    selectedIK={initialValues}
                    tofiConstants={tofiConstants}

                    />
                },
                {
                    tabKey: 'Contact',
                    tabName: 'Контакт',
                    tabContent: <Contact_IK
                    t={t}
                    selectedIK={initialValues}
                    tofiConstants={tofiConstants}
                    dateIncludeOfIk={dateIncludeOfIk}

                    />
                },
                {
                    tabKey: 'PiNMD',
                    tabName: 'ПиНМД',
                    tabContent: <PiNMD_IK
                    t={t}
                    selectedIK={initialValues}
                    tofiConstants={tofiConstants}
                    dateIncludeOfIk={dateIncludeOfIk}
                    />
                }
            ]}
            />
        </Spin>
    }
}

export default Card;