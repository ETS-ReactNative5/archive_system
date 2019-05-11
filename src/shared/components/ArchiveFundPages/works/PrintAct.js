import React from 'react';
import AntTabs from '../../AntTabs';
import {getCube, getIdGetObj} from "../../../actions/actions";
import * as axios from "../../../utils/axios_config";
import {Button, Col, Row} from "antd";
import DamageAct from "./acts/DamageAct";
import IrrDamageAct from "./acts/IrrDamageAct";
import LightToDestroy from "./acts/LightToDestroy";
import CrashedAct from "./acts/CrashedAct";





class PrintAct extends React.Component {
    componentDidMount() {

    }

    componentDidUpdate(prevProps) {

    }

    getActType = typeAct => {
        const {
            workId,
            tofiConstants,
            initialValues,
            type,
            actNumber
        } = this.props;
        switch(typeAct) {
            case 'damage':
                return (<DamageAct workId={workId} tofiConstants={tofiConstants}
                                   initialValues={initialValues} type={type} actNumber={actNumber}/>);
            case 'irrDamage':
                return (<IrrDamageAct workId={workId} tofiConstants={tofiConstants}
                                      initialValues={initialValues} type={type}  actNumber={actNumber}/>);
            case 'lightToDestroy':
                return (<LightToDestroy workId={workId} tofiConstants={tofiConstants}
                                      initialValues={initialValues} type={type}  actNumber={actNumber}/>);
            case 'crashedAct':
                return (<CrashedAct workId={workId} tofiConstants={tofiConstants}
                                        initialValues={initialValues} type={type}  actNumber={actNumber}/>)


        }
    };

    render() {
        return (

        <div>

        {this.getActType(this.props.type)}</div>
        )
    }
}

export default PrintAct;