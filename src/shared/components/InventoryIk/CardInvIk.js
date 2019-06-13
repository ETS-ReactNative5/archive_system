import React from 'react';
import AntTabs from "../AntTabs";
import MainInfoInvForm from "./MainInfoInvForm";
import StricturaInv from "./StruturInv"
class InventoriesListCard extends React.Component {

    render() {
        const { t, tofiConstants,icConst, onSaveCubeData, initialValues, onCreateObj } = this.props;
        return (
            <AntTabs
                tabs={[
                    {
                        tabKey: 'mainInfo',
                        tabName: t('MAIN_INFO'),
                        tabContent: <MainInfoInvForm
                            tofiConstants={tofiConstants}
                            onSaveCubeData={onSaveCubeData}
                            t={t}
                            initialValues={initialValues}
                            onCreateObj={onCreateObj}
                        />
                    },
                    {
                      tabKey: 'StricturaInv',
                      tabName: "Структура описи",
                      tabContent: <StricturaInv
                        tofiConstants={tofiConstants}
                        initialValues={initialValues}
                        t={t}
                        icConst={icConst}
                      />
                    }
                ]}
            />
        )
    }
}

export default InventoriesListCard;