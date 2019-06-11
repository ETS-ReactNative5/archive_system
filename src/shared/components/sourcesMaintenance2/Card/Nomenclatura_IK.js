import React from "react"
import {onSaveCubeData, parseCube_new, parseForTable} from "../../../utils/cubeParser";
import axios from "axios";
import {getIdGetObj} from "../../../actions/actions";
import NomenTable from "./Nomenclaturs/NomenTable";
class Nomenclatura_IK extends React.Component {

    state = {
        data: {},
        cubeData: {},
        listIdOfNomen: []
    };

    buildComponent = () => {
        this.setState({
            iconLoading: false,
            loading: true
        });
        const filters = {
            filterDPAnd: [
                {
                    dimConst: 'dpForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            consts: "nomen"
                        }
                    ]
                }
            ],
            filterDOAnd: [
                {
                    dimConst: 'doForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            ids: String(this.props.selectedIK.id)
                        }
                    ]
                }
            ],
            filterDTOr: [
                {
                    dimConst: 'dtForFundAndIK',
                    conds: [
                        {
                            ids: String(this.props.dateIncludeOfIk.slice(-4)) + '0101' + String(this.props.dateIncludeOfIk.slice(-4)) + '1231'
                        }
                    ]
                }
            ]
        };

        const fd = new FormData();
        fd.append("cubeSConst", 'cubeForFundAndIK');
        fd.append("filters", JSON.stringify(filters));
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
            var cubeData = res.data.data;
            const parsedCube = parseCube_new(
            cubeData["cube"],
            [],
            "dp",
            "do",
            cubeData['do_' + this.props.tofiConstants.doForFundAndIK.id],
            cubeData['dp_' + this.props.tofiConstants.dpForFundAndIK.id],
            ['do_' + this.props.tofiConstants.doForFundAndIK.id],
            ['dp_' + this.props.tofiConstants.dpForFundAndIK.id]
            );


            var tableData = parsedCube.map(this.renderTableData);


            if (tableData[0] && tableData[0].nomen && tableData[0].nomen) {
                var listArray = [];
                let i = 0;
                for (i; i < tableData[0].nomen.length; i++) {
                    getIdGetObj(tableData[0].nomen[i].value, 'dimObjNomen').then(res2 => {
                        listArray.push(res2.data.idDimObj);
                        if (i == tableData[0].nomen.length) {
                            this.callBackForNom(listArray, tableData[0].nomen)
                        }
                    });

                }
            }
        });
    };


    callBackForNom = (listArr, stock) => {
        if (listArr.length == stock.length) {
            this.setState({
                listIdOfNomen: listArr
            })
        }
    };



    componentDidMount() {
        this.buildComponent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedIK.id !== this.props.selectedIK.id) {
            this.buildComponent();
        }
    }

    renderTableData = (item, idx) => {
        const result = {};
        const constArr = ['nomen'];
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    render() {
        const {t, tofiConstants, initialValues, dateIncludeOfIk} = this.props;
        return (<div><br/><br/>
            <NomenTable
            listIdOfNomen={this.state.listIdOfNomen}
            t={t}
            selectedIK={this.props.selectedIK}
            tofiConstants={tofiConstants}
            dateIncludeOfIk={dateIncludeOfIk}
            />
        </div> )

    }

}

export default Nomenclatura_IK;