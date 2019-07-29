import React, { Component } from 'react'
import {Dropdown, Menu, Select, Input, Icon, Form, InputNumber, message} from 'antd';
import {connect} from 'react-redux';
import ArchiveManagementsCard from './ArchiveManagementsCard';
import {
    getCube,
} from '../../../actions/actions';
import {onSaveCubeData, onSaveCubeData3, parseCube_new, parseForTable} from "../../../utils/cubeParser";
import {
    CUBE_FOR_AF_CASE,
    CUBE_FOR_FUND_AND_IK,
    DO_FOR_CASE, DP_FOR_CASE,
    DT_FOR_FUND_AND_IK
} from "../../../constants/tofiConstants";
import moment from "moment";

const { Option } = Select;
 class ArchiveManagements extends Component {

     constructor(props){
         super(props);

         this.state = {
             loading:false,
             data: {},
             newData: {},
             date: '',
             new_date: '',
             selected_id: 0
         };
     }

     componentDidMount() {
         this.getCubeAct();
     };

     getCubeAct = async ids => {

         const filters = {
             filterDPAnd: [
                 {
                     dimConst: "dpCubeArchive",
                     concatType: "and",
                     conds: [
                         {
                             consts:"publicGuidebook,publicDirectoryAdm,publicDirectoryHistory,publicDirectoryOther,booksBrochures,newspapers,journal,typePrintedProducts,archiveBuildings,specialRooms,fittedRooms,archivalUtilRate,buildSecAlarm,fireBuildEquipment,lengthMetalShelving,lengthWoodenShelving,outlinedDocuments"
                         }
                     ]
                 }
             ],
             filterDOAnd: [
                 {
                     dimConst: "doCubeArchive",
                     concatType: "and",
                     conds: [
                         {
                             clss: "archive"
                         }
                     ]
                 }
             ],
             filterDTOr: [
                 {
                     dimConst: "dtCubeArchive",
                     concatType: "and",
                     conds: [
                         {
                             ids:
                                 this.state.date
                         }
                     ]
                 }
             ]

         };

         await this.props.getCube("cubeArchive", JSON.stringify(filters), {
             customKey: "cubeArchive"
         });

         const parsedCube = parseCube_new(this.props.cubeArchive['cube'],
             [],
             'dp',
             'do',
             this.props.cubeArchive['do_' + this.props.tofiConstants['doCubeArchive'].id],
             this.props.cubeArchive['dp_' + this.props.tofiConstants['dpCubeArchive'].id],
             'do_' + this.props.tofiConstants['doCubeArchive'].id,
             'dp_' + this.props.tofiConstants['dpCubeArchive'].id
         ).map(this.renderTableData);

         this.setState({
             data: parsedCube,
         });

     };

     onChange = (obj) => {
         let publicGuidebook = !!obj.publicGuidebook ? obj.publicGuidebook.value : 0;
         let publicDirectoryAdm = !!obj.publicDirectoryAdm ? obj.publicDirectoryAdm.value : 0;
         let publicDirectoryHistory = !!obj.publicDirectoryHistory ? obj.publicDirectoryHistory.value : 0;
         let publicDirectoryOther = !!obj.publicDirectoryOther ? obj.publicDirectoryOther.value : 0;
         let summa = publicGuidebook + publicDirectoryAdm + publicDirectoryHistory + publicDirectoryOther;
         obj.summa = {value:summa};
         this.setState({
             newData: obj,
             selected_id: obj.id,
             new_date: new Date().getFullYear()
         });
     };

     onChangeYear = async (objY) => {
         if(this.state.selected_id !== 0){
             const year = objY + '0101' + objY + '1231';
             this.setState({
                 date: year
             },async () => {
                await this.getCubeAct();
                let out_data = this.state.newData;
                let data = this.state.data;
                let newObject = data.find(el => el.id === out_data.id);debugger
                if(!!newObject){
                    let publicGuidebook = !!newObject.publicGuidebook ? newObject.publicGuidebook.value : 0;
                    let publicDirectoryAdm = !!newObject.publicDirectoryAdm ? newObject.publicDirectoryAdm.value : 0;
                    let publicDirectoryHistory = !!newObject.publicDirectoryHistory ? newObject.publicDirectoryHistory.value : 0;
                    let publicDirectoryOther = !!newObject.publicDirectoryOther ? newObject.publicDirectoryOther.value : 0;
                    let summa = publicGuidebook + publicDirectoryAdm + publicDirectoryHistory + publicDirectoryOther;
                    newObject.summa = {value:summa};
                    this.setState({
                        newData: newObject,
                        new_date: objY
                    })
                }
             });
         }else{
             console.log('select');
         }
     };

     renderTableData = (item, idx) => {
        const constArr = ["publicGuidebook","publicDirectoryAdm","publicDirectoryHistory","publicDirectoryOther","booksBrochures","newspapers","journal",
            "typePrintedProducts","archiveBuildings","specialRooms","fittedRooms","archivalUtilRate","buildSecAlarm","fireBuildEquipment","lengthMetalShelving",
            "lengthWoodenShelving","outlinedDocuments"];
        const result = {
            idss: idx + 1,
            id: item.id,
            name: item.name,

        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


     loadOptions = c => {
         return () => {
             if (!this.props[c + "Options"]) {
                 this.setState({
                     filter: { ...this.state.filter, [c + "Loading"]: true }
                 });
                 this.props.getPropVal(c).then(() =>
                     this.setState({
                         filter: {
                             ...this.state.filter,
                             [c + "Loading"]: false
                         }
                     })
                 );
             }
         };
     };

     saveProps = async (c, v, t = this.props.tofiConstants, objData, key) => {
         let hideLoading;
         try {
             if (!c.cube) c.cube = {
                 cubeSConst: "cubeArchive",
                 doConst: "doCubeArchive",
                 dpConst: "dpCubeArchive",
             };
             if (!c.cube.data) c.cube.data = this.props.cubeArchive;
             c["obj"] = {
                 doItem: key
             }
             hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
             let save_date = this.state.new_date + '-01-01';
             const resSave = await onSaveCubeData3(c, v, t, objData,'11',save_date);
             hideLoading();
             if (!resSave.success) {
                 message.error(this.props.t('PROPS_UPDATING_ERROR'));
                 resSave.errors.forEach(err => {
                     message.error(err.text)
                 });
                 return Promise.reject(resSave);
             }
             message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
             this.setState({loading: true, openCard: false});
             await this.getCubeAct();
             return resSave;
         }
         catch (e) {
             typeof hideLoading === 'function' && hideLoading();
             this.setState({loading: false});
             console.warn(e);
         }
     };

    render() {
        let data = [...this.state.data]
        const lng = localStorage.getItem('i18nextLng');
        const {tofiConstants: { archive, fundmakerArchive}} = this.props;
        let yearFull = new Date().getFullYear();
        const newArr = [2,1,0];
       let selectYear = newArr.map((el) => {
            return yearFull - el;
       });

        return (
            <div className="archiveManagement" style={{margin:".5vw"}}>
                <div className="title"><h2>{archive.name[lng]}</h2></div>
                <div className="label-select">
                        <Select
                            style={{width:"15%", marginBottom:".5vw"}}
                            name="fundmakerArchive"
                            isSearchable={false}
                            onChange={this.onChange}
                        >
                            {data.map( el => <Option value={el}>{el.name[lng]}</Option> )}
                        </Select>
                        <Select
                            style={{width:"10%", marginBottom:".5vw", marginLeft: '15px'}}
                            name="fundmakerArchiveYear"
                            isSearchable={false}
                            onChange={this.onChangeYear}
                            value={this.state.new_date}
                        >
                            {selectYear.map( el => <Option value={el}>{el}</Option> )}
                        </Select>
                </div>
                <ArchiveManagementsCard
                    {...this.props}
                    initialValues={this.state.newData} saveProps={this.saveProps}
                />
            </div>
        )
    }
}

                    
function mapStateToProps(state) {
    return {
        cubeForWorks: state.cubes.requests,
        user: state.auth.user,
        tofiConstants: state.generalData.tofiConstants,
        fundmakerArchiveOptions: state.generalData.fundmakerArchive,
        cubeArchive : state.cubes.cubeArchive
    }
}

export default connect(mapStateToProps, {getCube})(ArchiveManagements);
