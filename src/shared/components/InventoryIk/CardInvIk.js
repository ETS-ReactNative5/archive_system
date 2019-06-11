import React from 'react';
import AntTabs from "../AntTabs";
import MainInfoInvForm from "./MainInfoInvForm";

class InventoriesListCard extends React.Component {

    render() {
        const { t, tofiConstants, onSaveCubeData, initialValues, onCreateObj } = this.props;
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
                    /*{
                      tabKey: 'descriptiveInfo',
                      tabName: t('DESCRIPTIVE_INFO'),
                      tabContent: <DescriptiveInfo
                        tofiConstants={tofiConstants}
                        initialValues={initialValues}
                        t={t}
                      />
                    }*/
                ]}
            />
        )
    }
}

export default InventoriesListCard;