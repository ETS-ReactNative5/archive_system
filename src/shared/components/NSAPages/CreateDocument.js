import React from 'react'
import {
    Button,
    Table as AntTable,
    Input,
    Checkbox,
    InputNumber,
    Icon,
    message,
    Popconfirm,
    DatePicker,
    Modal
} from 'antd'
import SelectVirt from "../SelectVirt";
//import SelectVirt from "react-virtualized-select";
import Select from '../Select';
import PropTypes from 'prop-types';
import SiderCard from './SiderCardCreateDocument';
import CSSTransition from "react-transition-group/CSSTransition";
//import AntTable from '../AntTable';
import {isEmpty, isEqual, orderBy, map, pickBy, forOwn} from 'lodash';
import moment from "moment";
import connect from "react-redux/es/connect/connect";
import {
    createObj,
    getAllObjOfCls,
    getCube,
    updateCubeData,
    getObjByProp,
    getObjByObjVal,
    getPropVal,
    dObj
} from "../../actions/actions";
import {getPropMeta, parseCube_new, onSaveCubeData} from '../../utils/cubeParser';
import {FUND_MAKER_ARCHIVE} from '../../constants/tofiConstants';
import {SYSTEM_LANG_ARRAY} from '../../constants/constants';
import {deflate} from 'zlib';

const EditableCell = ({editable, value, onChange}) => (
<div>
    {editable
    ? <Input style={{margin: '-5px 0'}} value={value}
             onChange={e => onChange(e.target.value)}/>
    : value
    }
</div>
);
const EditableCheckbox = ({editable, value, onChange, tofiConstants}) => (
<div>
    {editable
    ? <Checkbox checked={value} onChange={e => onChange(e.target.checked)}/>
    : <Checkbox checked={value === tofiConstants.yes.id} readOnly/>
    }
</div>
);
const EditableNumber = ({editable, value, min, max, onChange}) => (
<div>
    {editable
    //? <InputNumber min={min} max={max>0?max:null} value={value} onChange={value => onChange(value)}/>
    ? <InputNumber value={value} onChange={value => onChange(value)}/>
    : value
    }
</div>
);
const EditableSelect = ({editable, value, onChange, options}) => (
<div>
    {editable
    ? <Select
    style={{margin: '-5px 0'}}
    value={value}
    onChange={e => onChange(e)}
    options={options}
    optionHeight={40}
    />
    : value ? value.label : ''
    }
</div>
);
const EditableDatePicker = ({editable, value, onChange}) => (
<div>
    {editable
    ? <DatePicker style={{margin: '-5px 0'}} format="DD-MM-YYYY"
                  value={value ? moment(value, 'DD-MM-YYYY') : null}
                  onChange={e => onChange(e)}/>
    : value && value.format('DD-MM-YYYY')
    }
</div>
);

class CreateDocument extends React.Component {

    state = {
        loading: false,
        filterLoading: {},
        filter: {
            fundmakerArchive: null,
            fundType: null,
            fundOrg: null,
            invList: null,
            caseList: null,
            author: null,
        },
        openNewRec: false,
        newFragment: false,
        openCard: false,
        openModal: true,
        currentTablePage: null,
        selectedRow: {},
        selectedRowKey: '',
        changedRow: {},
        flagSave: false,
        expandedRowKeys: [],
        tableData: [],
        fundOrgOptions: [],
        invListOptions: [],
        caseListOptions: [],
        sidebarActiveKey: 'header',
    };

    onChangeFundmakerArchive = (item) => {
        const {filter} = this.state;
        this.setState({
            filter: {
                ...filter,
                fundmakerArchive: item,
                fundType: null,
                fundOrg: null,
                invList: null,
                caseList: null
            },
            fundOrgOptions: [],
            invListOptions: [],
            caseListOptions: [],
            tableData: [],
        })
    }
    onChangeFundType = (item) => {
        const {filter} = this.state;
        this.setState({
            filter: {
                ...filter,
                fundType: item,
                fundOrg: null,
                invList: null,
                caseList: null
            },
            fundOrgOptions: [],
            invListOptions: [],
            caseListOptions: [],
            tableData: [],
        })
    }
    onChangeFundOrg = (item) => {
        const {filter} = this.state;
        this.setState({
            filter: {...filter, fundOrg: item, invList: null, caseList: null},
            invListOptions: [],
            caseListOptions: [],
            tableData: [],
        })
    };
    onChangeInvList = (item) => {
        const {filter} = this.state;
        this.setState({
            filter: {...filter, invList: item, caseList: null},
            caseListOptions: [],
            tableData: [],
        })
        //console.log('invList in CreateDocument', item);
    };

    onChangeCaseList = (item) => {
        const {filter} = this.state;
        this.setState({filter: {...filter, caseList: item}, tableData: []},
        () => this.getRegistry()
        );
    };

    // Загрузка куба при выборе дела
    getRegistry() {
        if (!this.state.filter.caseList) return;
        this.setState({loading: true});
        const pseudo_id = String(this.state.filter.caseList.value);
        this.filters = {
            filterDOAnd: [
                {
                    dimConst: 'doDocuments',
                    concatType: "and",
                    conds: [
                        {
                            data: {
                                valueRef: {
                                    id: `wa_${pseudo_id}`
                                }
                            }
                        }
                    ]
                }
            ]
        };
        this.props.getCube('cubeDocuments', JSON.stringify(this.filters));
    }

    componentWillReceiveProps(nextProps) {
        if (!isEmpty(nextProps.cubeDocuments) && !isEmpty(nextProps.tofiConstants) && this.props.cubeDocuments !== nextProps.cubeDocuments) {
            const {doDocuments, dpDocuments} = nextProps.tofiConstants;
            const parseCubeData = orderBy(parseCube_new(
            nextProps.cubeDocuments['cube'],
            [],
            'dp',
            'do',
            nextProps.cubeDocuments[`do_${doDocuments.id}`],
            nextProps.cubeDocuments[`dp_${dpDocuments.id}`],
            `do_${doDocuments.id}`,
            `dp_${dpDocuments.id}`).map(this.renderTableData), 'orderIndex', 'asc');

            this.setState({
                tableData: getChildren('0', parseCubeData),
                loading: false,
            });

            function getChildren(parentId, array) {
                let children = [];
                array.forEach((item) => {
                    if (item.parent === parentId) {
                        let child = item;
                        let myChildren = getChildren(item.key, array)
                        if (myChildren.length > 0) child.children = myChildren;
                        children.push(child);
                    }
                });
                return children;
            }
        } else if (nextProps.cubeDocuments && typeof nextProps.cubeDocuments === 'object') {
            this.setState({
                loading: false
            })
        }
    }

    renderTableData = (item, idx) => {
        const {
            invNumber, pageNumberStart, turnoverSheetStart, pageNumberEnd, turnoverSheetEnd, start, end,
            documentPapers, dateForming, nomenLastChangeDate, archiveCipher, surnameOriginator,
            documentType, fundOrg, fundLP, invType,
            objVidNTD, objVidUD, objVidLPD,
            documentAuthor, addressee, question, event, person,
            eventLocation, documentFile,
            nameOrPrimaryWords, documentContent, peopleMentioned, organizationsMentioned, documentKeywords,
            propAuthenticity, typeOfPaperCarrier,
            objectCode, projectName, projectStage, projectPartName, drawingName, volumeNumber, documentNTDFIO, yearOfCompletion,
            dateEvent, inaccurateDate, inaccurateDateFeature, day, month, year,
            linkToKatalog, linkToUkaz, linkToObzor
        } = this.props.tofiConstants;

        //console.log(item);

// complex
        const pageNumberStartObj = item.props.find(element => element.prop === pageNumberStart.id);
        const turnoverSheetStartObj = item.props.find(element => element.prop === turnoverSheetStart.id);
        const pageNumberEndObj = item.props.find(element => element.prop === pageNumberEnd.id);
        const turnoverSheetEndObj = item.props.find(element => element.prop === turnoverSheetEnd.id);
        const startObj = item.props.find(element => element.prop === start.id);
        const endObj = item.props.find(element => element.prop === end.id);
// complex
        const invNumberObj = item.props.find(element => element.prop === invNumber.id);
        const documentPapersObj = item.props.find(element => element.prop === documentPapers.id);
        const dateFormingObj = item.props.find(element => element.prop === dateForming.id);
        const nomenLastChangeDateObj = item.props.find(element => element.prop === nomenLastChangeDate.id);
        const archiveCipherObj = item.props.find(element => element.prop === archiveCipher.id);
        const surnameOriginatorObj = item.props.find(element => element.prop === surnameOriginator.id);

        const documentTypeObj = item.props.find(element => element.prop === documentType.id); // undefined
        const fundOrgObj = item.props.find(element => element.prop === fundOrg.id); // undefined
        const fundLPObj = item.props.find(element => element.prop === fundLP.id);   // undefined
        const invTypeObj = item.props.find(element => element.prop === invType.id);   // undefined
        const objVidNTDObj = item.props.find(element => element.prop === objVidNTD.id);   // undefined
        const objVidUDObj = item.props.find(element => element.prop === objVidUD.id);     // undefined
        const objVidLPDObj = item.props.find(element => element.prop === objVidLPD.id);   // undefined

        const documentAuthorObj = item.props.find(element => element.prop === documentAuthor.id);
        const addresseeObj = item.props.find(element => element.prop === addressee.id);
        const questionObj = item.props.find(element => element.prop === question.id);
        const eventObj = item.props.find(element => element.prop === event.id);
        const personObj = item.props.find(element => element.prop === person.id);

        const nameOrPrimaryWordsObj = item.props.find(element => element.prop === nameOrPrimaryWords.id);
        const documentContentObj = item.props.find(element => element.prop === documentContent.id);
        const peopleMentionedObj = item.props.find(element => element.prop === peopleMentioned.id);
        const organizationsMentionedObj = item.props.find(element => element.prop === organizationsMentioned.id);
        const documentKeywordsObj = item.props.find(element => element.prop === documentKeywords.id);

        const propAuthenticityObj = item.props.find(element => element.prop === propAuthenticity.id);
        const typeOfPaperCarrierObj = item.props.find(element => element.prop === typeOfPaperCarrier.id);

        const objectCodeObj = item.props.find(element => element.prop === objectCode.id);
        const projectNameObj = item.props.find(element => element.prop === projectName.id);
        const projectStageObj = item.props.find(element => element.prop === projectStage.id);
        const projectPartNameObj = item.props.find(element => element.prop === projectPartName.id);
        const drawingNameObj = item.props.find(element => element.prop === drawingName.id);
        const volumeNumberObj = item.props.find(element => element.prop === volumeNumber.id);
        const documentNTDFIOObj = item.props.find(element => element.prop === documentNTDFIO.id);
        const yearOfCompletionObj = item.props.find(element => element.prop === yearOfCompletion.id);

        const eventLocationObj = item.props.find(element => element.prop === eventLocation.id);
        const documentFileObj = item.props.find(element => element.prop === documentFile.id);

        const dateEventObj = item.props.find(element => element.prop === dateEvent.id);
        const inaccurateDateObj = item.props.find(element => element.prop === inaccurateDate.id);
        const inaccurateDateFeatureObj = item.props.find(element => element.prop === inaccurateDateFeature.id);
        const dayObj = item.props.find(element => element.prop === day.id);
        const monthObj = item.props.find(element => element.prop === month.id);
        const yearObj = item.props.find(element => element.prop === year.id);

        const linkToKatalogObj = item.props.find(element => element.prop === linkToKatalog.id);
        const linkToUkazObj = item.props.find(element => element.prop === linkToUkaz.id);
        const linkToObzorObj = item.props.find(element => element.prop === linkToObzor.id);
        return {
            key: item.id,
            parent: item.parent && item.parent !== 'null' ? item.parent : '0',
            //
            invNumber: !!invNumberObj && invNumberObj.values ? invNumberObj.values.value : '',
            orderIndex: parseInt(!!invNumberObj && !!invNumberObj.values && invNumberObj.values.value ? invNumberObj.values.value : '0') * 1000,
            //start, end
            pageNumberStart: startObj && startObj.values.idDataPropVal && pageNumberStartObj && pageNumberStartObj.complexChildValues.parentDataPropVal == [startObj.values.idDataPropVal] && pageNumberStartObj.complexChildValues.value,
            turnoverSheetStart: startObj && startObj.values.idDataPropVal && turnoverSheetStartObj && turnoverSheetStartObj.complexChildValues.parentDataPropVal == [startObj.values.idDataPropVal] && turnoverSheetStartObj.complexChildValues.value,
            pageNumberEnd: endObj && endObj.values.idDataPropVal && pageNumberEndObj && pageNumberEndObj.complexChildValues.parentDataPropVal == [endObj.values.idDataPropVal] && pageNumberEndObj.complexChildValues.value,
            turnoverSheetEnd: endObj && endObj.values.idDataPropVal && turnoverSheetEndObj && turnoverSheetEndObj.complexChildValues.parentDataPropVal == [endObj.values.idDataPropVal] && turnoverSheetEndObj.complexChildValues.value,
            //pageNumberEnd
            //turnoverSheetEnd
            documentPapers: !!documentPapersObj && documentPapersObj.values ? documentPapersObj.values.value : '',
            dateForming: !!dateFormingObj && dateFormingObj.values ? moment(dateFormingObj.values.value, 'DD-MM-YYYY') : null,
            nomenLastChangeDate: !!nomenLastChangeDateObj && nomenLastChangeDateObj.values ? moment(nomenLastChangeDateObj.values.value, 'DD-MM-YYYY') : null,
            surnameOriginator: !!surnameOriginatorObj && surnameOriginatorObj.values ? {
                value: surnameOriginatorObj.values.value,
                label: surnameOriginatorObj.values.label
            } : null,
            //
            documentType: !!documentTypeObj && documentTypeObj.values ? {
                value: documentTypeObj.values.value,
                label: documentTypeObj.values.label
            } : null,
            fundOrg: !!fundOrgObj && fundOrgObj.values ? {
                value: fundOrgObj.values.value,
                label: fundOrgObj.values.label
            } : null,
            fundLP: !!fundLPObj && fundLPObj.values ? {
                value: fundLPObj.values.value,
                label: fundLPObj.values.label
            } : null,
            invType: !!invTypeObj && invTypeObj.values ? {
                value: invTypeObj.values.value,
                label: invTypeObj.values.label
            } : null,
            //objVidNTD: !!objVidNTDObj && objVidNTDObj.refId ? {value:objVidNTDObj.refId, label:objVidNTDObj.value} : null,
            //objVidUD: !!objVidUDObj && objVidUDObj.refId ? {value:objVidUDObj.refId, label:objVidUDObj.value} : null,
            //objVidLPD: !!objVidLPDObj && objVidLPDObj.refId ? {value:objVidLPDObj.refId, label:objVidLPDObj.value} : null,
            //
            documentAuthor: !!documentAuthorObj ? documentAuthorObj.values : '',
            addressee: !!addresseeObj ? addresseeObj.values : '',
            question: !!questionObj ? questionObj.values || '' : '',
            event: !!eventObj ? eventObj.values || '' : '',
            person: !!personObj ? personObj.values : [],
            //
            nameOrPrimaryWords: !!nameOrPrimaryWordsObj ? nameOrPrimaryWordsObj.values || '' : '',
            documentContent: !!documentContentObj ? documentContentObj.values || '' : '',
            peopleMentioned: !!peopleMentionedObj ? peopleMentionedObj.values || '' : '',
            organizationsMentioned: !!organizationsMentionedObj ? organizationsMentionedObj.values || '' : '',
            documentKeywords: !!documentKeywordsObj ? documentKeywordsObj.values || '' : '',
            //
            propAuthenticity: !!propAuthenticityObj && propAuthenticityObj.values ? {
                value: propAuthenticityObj.values.value,
                label: propAuthenticityObj.values.label
            } : null,
            typeOfPaperCarrier: !!typeOfPaperCarrierObj && typeOfPaperCarrierObj.values ? {
                value: typeOfPaperCarrierObj.values.value,
                label: typeOfPaperCarrierObj.values.label
            } : null,
            //
            objectCode: !!objectCodeObj && objectCodeObj.value ? objectCodeObj.values : '',
            projectName: !!projectNameObj && projectNameObj.value ? projectNameObj.values : '',
            projectStage: !!projectStageObj && projectStageObj.value ? projectStageObj.values : '',
            projectPartName: !!projectPartNameObj && projectPartNameObj.value ? projectPartNameObj.values : '',
            drawingName: !!drawingNameObj && drawingNameObj.value ? drawingNameObj.values : '',
            volumeNumber: !!volumeNumberObj && volumeNumberObj.value ? volumeNumberObj.values : '',
            documentNTDFIO: !!documentNTDFIOObj && documentNTDFIOObj.value ? documentNTDFIOObj.values : '',
            yearOfCompletion: !!yearOfCompletionObj && yearOfCompletionObj.value ? yearOfCompletionObj.values : '',
            //
            documentFile: !!documentFileObj && documentFileObj.values ? documentFileObj.values : [],
            //eventLocation: !!eventLocationObj && eventLocationObj.refId ? {value:eventLocationObj.refId, label:eventLocationObj.value} : null,
            eventLocation: !!eventLocationObj && eventLocationObj.values ? eventLocationObj.values : null,
            //
            //inaccurateDate
            inaccurateDateFeature: !!inaccurateDateFeatureObj ? inaccurateDateFeatureObj.values : '',
            day: !!dayObj ? dayObj.value : '',
            month: !!monthObj ? monthObj.value : '',
            year: !!yearObj ? yearObj.value : '',
            //
            linkToKatalog: !!linkToKatalogObj && linkToKatalogObj.values ? linkToKatalogObj.values : [],
            linkToUkaz: !!linkToUkazObj && linkToUkazObj.values ? linkToUkazObj.values : [],
            linkToObzor: !!linkToObzorObj && linkToObzorObj.values ? linkToObzorObj.values : [],
            //
        };
    };

    loadOptionsProp = c => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({filterLoading: {...this.state.filterLoading, [c]: true}});
                this.props.getPropVal(c)
                .then(() => this.setState({
                    filterLoading: {
                        ...this.state.filterLoading,
                        [c]: false
                    }
                }))
            }
        }
    };

    loadOptions = (c, propConsts, dte = moment().format('YYYY-MM-DD')) => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({filterLoading: {...this.state.filterLoading, [c]: true}});
                this.props.getAllObjOfCls(c, dte, propConsts)
                .then(() => this.setState({
                    filterLoading: {
                        ...this.state.filterLoading,
                        [c]: false
                    }
                }))
            }
        }
    };

    onTableExpand = (expanded, record) => {
        const {expandedRowKeys} = this.state;
        if (expanded) {
            expandedRowKeys.push(record.key);
        } else {
            for (let i = 0; i < expandedRowKeys.length; i++) {
                if (expandedRowKeys[i] === record.key) {
                    delete expandedRowKeys.splice(i, 1);
                    i -= 1;
                }
            }
        }
        this.setState({expandedRowKeys})
    };

    closeCard = () => {
        this.setState({openCard: false})
    };

    addNewDocument = () => {
        if (this.state.filter.invList.docConst === undefined) {
            message.error('У описи "' + `${this.state.filter.invList.label}` + '" не определен тип документа. Невозможно создать документ!');
            return
        }
        let newNumber = 0;
        this.state.tableData.forEach((item) => {
            if (newNumber < parseInt(item.invNumber)) {
                newNumber = parseInt(item.invNumber)
            }
        });
        newNumber += 1;
        this.setState({
            openNewRec: true,
            newFragment: false,
            openCard: false,
            selectedRowKey: `newData_${this.state.tableData.length}`,
            tableData: [
                ...this.state.tableData,
                {
                    key: `newData_${this.state.tableData.length}`,
                    editable: true,
                    invNumber: String(newNumber),
                    pageNumberStart: 0,
                    pageNumberEnd: 0,
                    turnoverSheetStart: false,
                    turnoverSheetEnd: false,
                    parent: '0',
                }
            ]
        }, () => this.setState({
            currentTablePage: this.state.tableData.length % 20 + 1,
        }))
    };

    addNewFragment = () => {
        const {selectedRow, selectedRowKey, tableData} = this.state;
        if (!selectedRow || !selectedRowKey) return;

        const newRec = {
            key: `newData_${this.state.tableData.length}`,
            editable: true,
            invNumber: 0,
            pageNumberStart: 0,
            pageNumberEnd: 0,
            turnoverSheetStart: false,
            turnoverSheetEnd: false,
            parent: selectedRowKey,
        }

        let parentFound = false;
        const newData = tableData.map((item) => {
            if (item.key === selectedRowKey) {
                if (!item.children) item.children = [];
                parentFound = true;
                newRec.invNumber = item.invNumber + '.' + (item.children.length + 1);
                newRec.key = `newData_${newRec.invNumber}`;
                item.children.push(newRec);
            }
            return item;
        })
        if (parentFound === false) return;

        const {expandedRowKeys} = this.state;
        for (let i = 0; i < expandedRowKeys.length; i++) {
            if (expandedRowKeys[i] === selectedRowKey) {
                delete expandedRowKeys.splice(i, 1);
                i -= 1;
            }
        }
        expandedRowKeys.push(selectedRowKey);

        this.setState({
            openNewRec: true,
            newFragment: true,
            openCard: false,
            selectedRowKey: newRec.key,
            tableData: newData,
            expandedRowKeys: expandedRowKeys,
        })
    };

    cancel = (key, parent) => {
        const newData = [...this.state.tableData];
        if (this.state.newFragment === true) {
            const {expandedRowKeys} = this.state;
            const tableData = newData.map((item) => {
                if (item.children && item.key === parent) {
                    item.children = item.children.filter(item => item.key !== key);
                    if (item.children.length === 0) {
                        delete item.children
                        for (let i = 0; i < expandedRowKeys.length; i++) {
                            if (expandedRowKeys[i] === parent) {
                                delete expandedRowKeys.splice(i, 1);
                                i -= 1;
                            }
                        }
                    }
                }
                return item;
            });
            this.setState({
                tableData,
                expandedRowKeys,
                selectedRowKey: '',
                selectedRow: null,
                openNewRec: false,
                newFragment: false,
            });
        } else {
            this.setState({
                tableData: newData.filter(item => item.key !== key),
                selectedRowKey: '',
                selectedRow: null,
                openNewRec: false
            });
        }
    };

    remove = (key, parentKey) => {
        if (parentKey !== '0') {
            const newData = this.state.tableData;
            newData.forEach((item) => {
                if (item.key === parentKey) {
                    if (!item.children) return;
                    item.children = item.children.filter(child => child.key !== key);
                }
            })
            this.setState({tableData: newData});
        } else {
            const newData = this.state.tableData.filter(item => item.key !== key);
            this.setState({tableData: newData});
        }
    }

    handleChange(value, key, column, parentKey) {
        if (this.state.newFragment) {
            const newData = [...this.state.tableData];
            const parentObj = newData.find(item => item.key === parentKey);
            if (parentObj && parentObj.children) {
                parentObj.children.forEach((item) => {
                    if (item.key === key) {
                        item[column] = value;
                        this.setState({tableData: newData});
                    }
                })
            }
        } else {
            const newData = [...this.state.tableData];
            const target = newData.find(item => key === item.key);
            if (target) {
                target[column] = value;
                this.setState({tableData: newData});
            }
        }
    };

    /*
     create(key) {
     const newData = [...this.state.tableData];
     const target = newData.find(item => key === item.key);
     if (target) {
     target.documentPapers = String(parseInt(target.pageNumberEnd) - parseInt(target.pageNumberStart) +1 );
     target.dateForming = moment();
     target.nomenLastChangeDate = moment();
     delete target.editable;
     this.setState({
     openNewRec: false,
     tableData: newData,
     });
     }
     };
     */

    save(key, parentKey) {
        this.setState({openNewRec: false});
        const newData = [...this.state.tableData];
        let target = {};
        let parentObj = {};
        if (this.state.newFragment) {
            parentObj = newData.find(item => item.key === parentKey);
            if (parentObj && parentObj.children) {
                parentObj.children.forEach((item) => {
                    if (item.key === key) {
                        target = item;
                    }
                })
            }
        } else {
            target = newData.find(item => key === item.key);
        }
        if (!target) return;

        const {filter} = this.state;
        let provenance = '';
        switch(filter.fundType.value) {
            case 'fundOrg':
            case 'collectionOrg':
            case 'joinOrg':
                provenance = {
                    value: 'fundOrg',
                    valueLng: {ru: 'fundOrg', kz: 'fundOrg', en: 'fundOrg'}
                };
                break;
            case 'fundLP':
            case 'collectionLP':
            case 'joinLP':
                provenance = {
                    value: 'fundLP',
                    valueLng: {ru: 'fundLP', kz: 'fundLP', en: 'fundLP'}
                };
                break;
        }

        const name = {};
        const cipherDocument = `${target.pageNumberStart}-${target.pageNumberEnd}`;
        let archiveCipher = {};
        const documLang = {
            kz: ', іс парақтары ',
            ru: ', страницы дела ',
            en: ', pages of case '
        };
        ['kz', 'ru', 'en'].map(lang => {
            archiveCipher[lang] = filter.caseList.archiveCipher[lang] + documLang[lang] + cipherDocument;
            name[lang] = archiveCipher[lang]
        });

        target.nomenLastChangeDate = moment();

        let newValue = target.invNumber;
        target.invNumber = {
            value: newValue,
            valueLng: {ru: newValue, kz: newValue, en: newValue}
        };

        let newValuepageNumberStart = target.pageNumberStart;
        target.pageNumberStart = {
            value: newValuepageNumberStart,
            valueLng: {
                ru: newValuepageNumberStart,
                kz: newValuepageNumberStart,
                en: newValuepageNumberStart
            }
        };

        let newValuepageNumberEnd = target.pageNumberEnd;
        target.pageNumberEnd = {
            value: newValuepageNumberEnd,
            valueLng: {
                ru: newValuepageNumberEnd,
                kz: newValuepageNumberEnd,
                en: newValuepageNumberEnd
            }
        };

/*        let newValueturnoverSheetEnd = target.turnoverSheetEnd;
        target.turnoverSheetEnd = {
            value: newValueturnoverSheetEnd,
            valueLng: {
                ru: newValueturnoverSheetEnd,
                kz: newValueturnoverSheetEnd,
                en: newValueturnoverSheetEnd
            }
        };*/


        let newValuenomenLastChangeDate = target.nomenLastChangeDate;
        target.nomenLastChangeDate = {value: moment().format('DD-MM-YYYY')};

        let newValuearchiveCipher = {
            value: archiveCipher.ru,
            valueLng: {ru: archiveCipher.ru, en: archiveCipher.en, kz: archiveCipher.kz}
        };
        archiveCipher = newValuearchiveCipher;
        let newValuedocumentPapers = target.documentPapers;

        let newValuedateForming = dateFormingVal ? {value: moment(dateFormingVal, 'DD-MM-YYYY').format('MM-DD-YYYY')} :
        {value: moment()};


        const dateForming = newValuedateForming;

        archiveCipher = newValuearchiveCipher;


        const {invNumber, pageNumberStart, pageNumberEnd, nomenLastChangeDate, turnoverSheetStart, turnoverSheetEnd, dateForming: dateFormingVal, editable, parent} = target;
        const documentPapersVal = String(parseInt(pageNumberEnd.value) - parseInt(pageNumberStart.value) + 1);
        const documentPapers = {
            value: documentPapersVal,
            valueLng: {
                ru: documentPapersVal,
                kz: documentPapersVal,
                en: documentPapersVal
            }
        };


        let fragmentRest = {};
        if (this.state.newFragment) {
            fragmentRest = {
                //
                dateForming: parentObj.dateForming ? parentObj.dateForming.format('MM-DD-YYYY') : moment(),
                //
                documentAuthor: parentObj.documentAuthor,
                addressee: parentObj.addressee,
                question: parentObj.question,
                event: parentObj.event,
                person: parentObj.person,
                //
                objectCode: parentObj.objectCode,
                projectName: parentObj.projectName,
                projectStage: parentObj.projectStage,
                projectPartName: parentObj.projectPartName,
                drawingName: parentObj.drawingName,
                volumeNumber: parentObj.volumeNumber,
                documentNTDFIO: parentObj.documentNTDFIO,
                yearOfCompletion: parentObj.yearOfCompletion,
                //
                // documentFile: parentObj.documentFile,
            }
            if (parentObj.documentFile.length > 0) {
                fragmentRest.documentFile = parentObj.documentFile;
            }
        }
        //console.log(fragmentRest); return;
        const surnameOriginator = this.props.user ? {
            value: String(this.props.user.obj),
            valueLng: {
                ru: String(this.props.user.obj),
                kz: String(this.props.user.obj),
                en: String(this.props.user.obj)
            }
        } : '';
        const rest = {
            invNumber,
            dateForming,
            documentPapers,
            nomenLastChangeDate,
            surnameOriginator,
            documentCase: String(this.state.filter.caseList.value),
            ...fragmentRest,
        };
        //console.log(rest); return;
        const cube = {
            cubeSConst: 'cubeDocuments',
            doConst: 'doDocuments',
            dpConst: 'dpDocuments'
        };
        const obj = {
            name,
            fullName: name,
            clsConst: this.state.filter.invList.docConst,
        };
        if (this.state.newFragment) {
            obj.parent = parent.split("_")[1]
        }
        //console.log(obj); return;
        const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
        createObj(cube, obj)
        .then(res => {
            hideCreateObj();
            if (res.success) {
                // target.key = res.data.idItemDO;
                // this.setState({selectedRowKey: target.key});
                // this.onSaveCubeData({cube, obj}, rest, res.data.idItemDO, {}, {})
                //   .then(resp => {
                //     if(resp.success) {
                //       this.getRegistry()
                //       // delete target.editable;
                //       // console.log(newData)
                //       // this.setState({ tableData: newData });
                //     }
                //   }).catch(err => console.log(err));
                const {
                    pageNumberStart, turnoverSheetStart: turnoverSheetStartVal, pageNumberEnd, turnoverSheetEnd: turnoverSheetEndVal,
                    nomenLastChangeDate, dateForming: dateFormingVal
                } = target;
                const turnoverSheetStart = turnoverSheetStartVal ?
                {
                    value: String(this.props.tofiConstants.yes.id),
                    valueLng: {
                        ru: String(this.props.tofiConstants.yes.id),
                        kz: String(this.props.tofiConstants.yes.id),
                        en: String(this.props.tofiConstants.yes.id)
                    }
                }
                : {
                    value: String(this.props.tofiConstants.no.id),
                    valueLng: {
                        ru: String(this.props.tofiConstants.no.id),
                        kz: String(this.props.tofiConstants.no.id),
                        en: String(this.props.tofiConstants.no.id)
                    }
                };

                const turnoverSheetEnd = turnoverSheetEndVal ?
                {
                    value: String(this.props.tofiConstants.yes.id),
                    valueLng: {
                        ru: String(this.props.tofiConstants.yes.id),
                        kz: String(this.props.tofiConstants.yes.id),
                        en: String(this.props.tofiConstants.yes.id)
                    }
                }
                : {
                    value: String(this.props.tofiConstants.no.id),
                    valueLng: {
                        ru: String(this.props.tofiConstants.no.id),
                        kz: String(this.props.tofiConstants.no.id),
                        en: String(this.props.tofiConstants.no.id)
                    }
                };
                const dateForming = dateFormingVal ? {value: moment(dateFormingVal, 'DD-MM-YYYY').format('MM-DD-YYYY')} : {value: moment()};
                const cube = {
                    cubeSConst: 'cubeDocuments',
                    doConst: 'doDocuments',
                    dpConst: 'dpDocuments',
                    data: this.props.cubeDocuments
                }
                const obj = {
                    doItem: res.data.idItemDO
                }


                const complex = {
                    start: {
                        values: {pageNumberStart, turnoverSheetStart}
                    },
                    end: {
                        values: {pageNumberEnd, turnoverSheetEnd}
                    }
                }

                const values = {
                    invNumber,
                    documentPapers,
                    nomenLastChangeDate,
                    archiveCipher,
                    provenance,
                    dateForming,
                    surnameOriginator,
                    documentCase: {
                        value: String(this.state.filter.caseList.value),
                        valueLng: {
                            kz: String(this.state.filter.caseList.value),
                            en: String(this.state.filter.caseList.value),
                            ru: String(this.state.filter.caseList.value)
                        }, ...fragmentRest
                    }
                };
                //console.log(fragmentRest, values)
                onSaveCubeData({cube, obj}, {values, complex}, this.props.tofiConstants)
                .then(resp => {
                    if (resp.success) {
                        this.getRegistry()
                        // delete target.editable;
                        // console.log(newData)
                        // this.setState({ tableData: newData });
                    }
                }).catch(err => console.log(err));
            }
        }).catch(err => {
            hideCreateObj();
            console.log(err);
        });
    };

    onSaveCubeData = (objVerData, {method, protocol,documentFile, ...values}, doItemProp, objDataProp, valOld) => {
        let datas = [];

        let documentFileNew =[]
        if (!!documentFile){

            for (let val of documentFile){
                documentFileNew.push(val.value)
            }
            documentFile = documentFileNew
        }
        this.setState({loading: true})
        try {
            datas = [{
                own: [{
                    doConst: objVerData.cube.doConst,
                    doItem: doItemProp,
                    isRel: "0",
                    objData: objDataProp
                }],
                props: map(values, (val, key) => {
                    console.log(values, val, key)
                    const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
                    console.log(val, valOld, valOld[key], key);
                    let value = val;
                   // let oldValue = valOld[key];
                    if ((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val.value === 'string') {
                        value = {kz: val.value, ru: val.value, en: val.value};
                     /*   oldValue = oldValue && {
                            kz: valOld[key],
                            ru: valOld[key],
                            en: valOld[key]
                        };*/
                    }
                    if (propMetaData.typeProp === 312 && typeof value === 'string') {
                        if(value[4]!=='-'){
                            value = value.split('-').reverse().join('-');
                        }
                       // oldValue = oldValue && oldValue.split('-').reverse().join('-');
                    }
                    if (propMetaData.typeProp !== 315 && val && typeof val === 'object' && val.value) {
                        value = String(val.value);
                     //   oldValue = oldValue && String(valOld[key].value);
                    }
                    if (propMetaData.typeProp !== 315 && val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
                    if (propMetaData.isUniq === 2 && val[0] && val[0].value) {
                        propMetaData.mode = val[0].mode;
                        value = val.map(v => String(v.value)).join(",");
                       // oldValue = oldValue && valOld[key].map(v => String(v.value)).join(",");
                    }
                    return {
                        propConst: key,
                        val: value,
                       // oldValue,
                        typeProp: String(propMetaData.typeProp),
                        periodDepend: String(propMetaData.periodDepend),
                        isUniq: String(propMetaData.isUniq),
                     //   mode: propMetaData.mode
                    }
                }),
                periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
            }];
        } catch(err) {
            console.error(err);
            return err;
        }
        const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
        return updateCubeData(objVerData.cube.cubeSConst, moment().format('YYYY-MM-DD'), JSON.stringify(datas), {}, {
            method,
            protocol,
            documentFile
        })
        .then(res => {
            hideLoading();
            if (res.success) {
                message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                if (this.filters) {
                    this.setState({loading: true});
                    return this.props.getCube('cubeDocuments', JSON.stringify(this.filters))
                    .then(() => {
                        this.setState({loading: false, openCard: false, flagSave: false});
                        return {success: true}
                    })
                } else {
                    return {success: true}
                }
            } else {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                if (res.errors) {
                    res.errors.forEach(err => {
                        message.error(err.text);
                    });
                    return {success: false}
                }
            }
        })
    };

    changeSelectedRow = (rec, openAtOnce) => {
        if (rec.editable) {
            if (this.state.openCard) {
                this.setState({openCard: false});
            }
            return;
        }

        let boolEditable = false;
        this.state.tableData.forEach((item) => {
            if (item.editable) {
                boolEditable = true;
            }
        });
        if (boolEditable) return;

        const extraInfo = {
            invTypeName: this.state.filter.invList.invTypeName,
            docType: this.state.filter.invList.docType,
            docTypeName: this.state.filter.invList.docTypeName,
            docConst: this.state.filter.invList.docConst,
        }
        if (openAtOnce === true) {
            this.setState({
                selectedRow: {...rec, extraInfo},
                changedRow: {...rec, extraInfo},
                selectedRowKey: rec.key,
                openCard: true,
                sidebarActiveKey: 'header'
            })
            return;
        }

        this.setState({
            selectedRow: {...rec, extraInfo},
            changedRow: {...rec, extraInfo},
            selectedRowKey: rec.key
        })
    };

    onEditRecordChange = (label, data) => {
        const {changedRow, selectedRow} = this.state;
        if (typeof label !== 'string' && label.documentFile) {
            changedRow.documentFile = label.documentFile;
        } else {
            switch(label) {
                case 'reference_clsKatalog':
                    changedRow.linkToKatalog = data;
                    break;
                case 'reference_clsUkaz':
                    changedRow.linkToUkaz = data;
                    break;
                case 'reference_clsObzor':
                    changedRow.linkToObzor = data;
                    break;
                default:
                    changedRow[label] = data;
            }
        }
        this.setState({
            changedRow: changedRow,
            flagSave: !isEqual(selectedRow, changedRow),
        });
    };

    refreshRecord = () => {
        const values = pickBy(this.state.changedRow, (val, key) => !isEqual(val, this.state.selectedRow[key]))
        const surnameOriginator = this.props.user ? String(this.props.user.obj) : '';
        const nomenLastChangeDate = moment().format('YYYY-MM-DD');
        const cube = {
            cubeSConst: 'cubeDocuments',
            doConst: 'doDocuments',
            dpConst: 'dpDocuments',
        };
        return this.onSaveCubeData({cube}, {
            ...values,
            surnameOriginator,
            nomenLastChangeDate
        }, this.state.selectedRowKey, {}, this.state.selectedRow)
    };

    renderColumns(text, record, column) {
        return (
        <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column, record.parent)}
        />
        );
    }

    renderCheckbox(text, record, column) {
        return (
        <EditableCheckbox
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column, record.parent)}
        tofiConstants={this.props.tofiConstants}
        />
        );
    }

    renderNumber(text, record, column) {
        return (
        <EditableNumber
        editable={record.editable}
        value={text}
        min={record.sheetMin}
        max={record.sheetMax}
        onChange={value => this.handleChange(value, record.key, column, record.parent)}
        />
        );
    }

    renderSelectColumns(text, record, column) {
        const {clsPutev, clsKatalog, clsUkaz, clsObzor} = this.props.tofiConstants;
        const referenceTypes = [clsPutev, clsKatalog, clsUkaz, clsObzor];
        return (
        <EditableSelect
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column, record.parent)}
        idRef={this.props.tofiConstants.isActiveTrue.id}
        getObjByObjVal={this.props.getObjByObjVal}
        options={referenceTypes ? referenceTypes.map(o => ({
            value: o.id,
            label: o.name[this.lng],
            constName: o.constName
        })) : []}
        />
        );
    };

    renderDateColumns = (text, record, column) => {
        return (
        <EditableDatePicker
        editable={record.editable && !this.state.newFragment}
        value={text}
        onChange={value => this.handleChange(value ? value.format('DD-MM-YYYY') : '', record.key, column, record.parent)}
        />
        )
    };

    invListFilter = (list) => {
        const result = list.filter(option => option.invType.idRef === this.props.tofiConstants['invTypePerm'].id);
        return result.map(option => {
            const cls = [
                {docType: 'uprDoc', docConst: 'docUprList'},
                {docType: 'uprNTD', docConst: 'docNTDList'}
            ];
            const r = cls.find(c => this.props.tofiConstants[c.docType].id === option.documentType.idRef);
            return {
                value: option.id,
                label: `${option.invNumber[this.lng]} - ${option.name[this.lng]}`,
                invNumber: option.invNumber,
                docType: r && r.docType,
                docConst: r && r.docConst,
                docTypeName: r && this.props.tofiConstants[r.docType].name,
                invTypeName: this.props.tofiConstants['invTypePerm'].name,
            }
        });
    };

    onSideBarTabClick = (key) => {
        this.setState({sidebarActiveKey: key});
    };

    render() {
        const {
            tableData, selectedRow, openNewRec, openCard, filterLoading, filter,
            fundOrgOptions, invListOptions, caseListOptions
        } = this.state;
        const {t, tofiConstants, fundmakerArchiveOptions} = this.props;
        if (isEmpty(tofiConstants)) return null;

        const {fundmakerArchive, fundOrg, invList, caseList} = tofiConstants;

        const disabledFundmakerArchive = openCard || openNewRec;
        const disabledFundType = openCard || openNewRec || filter.fundmakerArchive === null;
        const disabledFundOrg = openCard || openNewRec || filter.fundmakerArchive === null || filter.fundType === null;
        const disabledInvList = openCard || openNewRec || filter.fundOrg === null;
        const disabledCases = openCard || openNewRec || filter.invList === null;
        const disabledAuthor = openCard || openNewRec || false;

        const disabledAddDocument = openNewRec || filter.caseList === null;
        const disabledAddFragment = openNewRec || filter.caseList === null || !(selectedRow && selectedRow.parent === '0');

        this.lng = localStorage.getItem('i18nextLng');

        return (
        <div className="CreateDocument">
            <div className="title">
                <h2>{ t('DESCRIPTION_DOCS') }</h2>
            </div>
            <div className="CreateDocument__heading">
                <div className="table-header">
                    <div className="label-select-10">
                        <Select
                        name="fundmakerArchive"
                        disabled={disabledFundmakerArchive}
                        //className="long-selected-menu"
                        isLoading={filterLoading.fundmakerArchive}
                        onFocus={this.loadOptionsProp('fundmakerArchive')}
                        value={filter.fundmakerArchive}
                        onChange={(item) => this.onChangeFundmakerArchive(item)}
                        options={fundmakerArchiveOptions ? fundmakerArchiveOptions.map(option => ({
                            value: option.id,
                            label: option.name[this.lng]
                        })) : []}
                        placeholder={fundmakerArchive.name[this.lng]}
                        />
                    </div>
                    <div className="label-select-10">
                        <Select
                        name="fundType"
                        disabled={disabledFundType}
                        value={filter.fundType && filter.fundType}
                        onChange={this.onChangeFundType}
                        options={['fundOrg', 'fundLP', 'collectionOrg', 'collectionLP', 'jointOrg', 'jointLP']
                        .map(c => ({value: c, label: tofiConstants[c].name[this.lng]}))}
                        placeholder={t('FUND_TYPE')}
                        />
                    </div>
                    <div className="label-select-30">
                        <SelectVirt
                        name="fundOrg"
                        isSearchable
                        disabled={disabledFundOrg}
                        optionHeight={40}
                        //className="long-selected-menu"
                        isLoading={filterLoading.fundOrg}
                        // onMenuOpen={this.loadOptions('fundOrg', 'fundNumber,fundIndex')}
                        onFocus={() => {
                            this.setState({
                                filterLoading: {
                                    ...this.state.filterLoading,
                                    fundOrg: true
                                }
                            });
                            const fd = new FormData();
                            fd.append('clsConsts', filter.fundType.value);
                            fd.append('propConst', 'fundArchive');
                            fd.append('withProps', 'fundNumber,fundIndex');
                            fd.append('value', this.state.filter.fundmakerArchive.value);
                            getObjByProp(fd)
                            .then(res => {
                                if (res.success) {
                                    this.setState({fundOrgOptions: res.data})
                                } else {
                                    this.setState({fundOrgOptions: []})
                                    throw res
                                }
                                this.setState({
                                    filterLoading: {
                                        ...this.state.filterLoading,
                                        fundOrg: false
                                    }
                                });
                            }).catch(err => console.log(err))
                        }}
                        value={filter.fundOrg && filter.fundOrg}
                        onChange={(item) => this.onChangeFundOrg(item)}
                        options={fundOrgOptions ? fundOrgOptions.map(option => ({
                            value: option.id,
                            label: `${option.fundNumber[this.lng]} - ${option.fundIndex[this.lng]} - ${option.name[this.lng]}`,
                            number: option.fundNumber,
                        })) : []}
                        placeholder={t('FUND')}
                        />
                    </div>
                    <div className="label-select-20">
                        <SelectVirt
                        disabled={disabledInvList}
                        isLoading={filterLoading.invList}
                        onFocus={() => {
                            this.setState({
                                filterLoading: {
                                    ...this.state.filterLoading,
                                    invList: true
                                }
                            });
                            const fd = new FormData();
                            fd.append('clsConsts', 'invList');
                            fd.append('propConst', 'invFund');
                            fd.append('withProps', 'invNumber, invType, documentType');
                            fd.append('value', this.state.filter.fundOrg.value);
                            getObjByProp(fd)
                            .then(res => {
                                if (res.success) {
                                    this.setState({invListOptions: res.data})
                                } else {
                                    throw res
                                }
                                this.setState({
                                    filterLoading: {
                                        ...this.state.filterLoading,
                                        invList: false
                                    }
                                });
                            }).catch(err => console.log(err))
                        }}
                        options={invListOptions ? this.invListFilter(invListOptions) : []}
                        value={filter.invList}
                        onChange={(item) => this.onChangeInvList(item)}
                        placeholder={invList.name[this.lng]}
                        />
                    </div>
                    <div className="label-select-30">
                        <SelectVirt
                        disabled={disabledCases}
                        isLoading={filterLoading.caseList}
                        onMenuOpen={() => {
                            this.setState({
                                filterLoading: {
                                    ...this.state.filterLoading,
                                    caseList: true
                                }
                            });
                            const fd = new FormData();
                            fd.append('clsConsts', 'caseList');
                            fd.append('propConst', 'caseInventory');
                            fd.append('withProps', 'caseOCD,caseFundOfUse,irreparablyDamaged,caseNumber,archiveCipher');
                            fd.append('value', this.state.filter.invList.value);
                            getObjByProp(fd)
                            .then(res => {
                                if (res.success) {
                                    this.setState({caseListOptions: res.data})
                                } else {
                                    throw res
                                }
                                this.setState({
                                    filterLoading: {
                                        ...this.state.filterLoading,
                                        caseList: false
                                    }
                                });
                            }).catch(err => console.log(err))
                        }}
                        options={caseListOptions ? caseListOptions.map(option => ({
                            value: option.id,
                            caseNumber: option.caseNumber,
                            label: `${option.caseNumber[this.lng]} - ${option.name[this.lng]}`,
                            caseOCD: option.caseOCD,
                            caseFundOfUse: option.caseFundOfUse,
                            irreparablyDamaged: option.irreparablyDamaged,
                            archiveCipher: option.archiveCipher
                        })) : []}
                        value={filter.caseList && filter.caseList}
                        onChange={(item) => this.onChangeCaseList(item)}
                        placeholder={caseList.name[this.lng]}
                        />
                    </div>
                </div>
                <div className="table-header">
                    <div className="label-select-10" style={{flex: 1}}>
                        <Button disabled={disabledAddDocument}
                                onClick={this.addNewDocument}>{t('ADD_DOCUMENT')}</Button>
                        <Button disabled={disabledAddFragment}
                                onClick={this.addNewFragment}>{t('ADD_FRAGMENT')}</Button>
                    </div>
                </div>
            </div>
            <div className="CreateDocument__body">
                <AntTable
                loading={this.state.loading}
                columns={[
                    {
                        key: 'invNumber',
                        title: '№',
                        dataIndex: 'invNumber',
                        width: '10%',
                        align: 'right',
                    },
                    {
                        key: 'group1',
                        dataIndex: '',
                        title: t('START'),
                        children: [
                            {
                                key: 'pageNumberStart',
                                title: t('SHEET'),
                                dataIndex: 'pageNumberStart',
                                width: '10%',
                                render: (obj, record) => this.renderNumber(obj, record, 'pageNumberStart'),
                            },
                            {
                                key: 'turnoverSheetStart',
                                title: t('TURNOVER'),
                                dataIndex: 'turnoverSheetStart',
                                width: '10%',
                                render: (obj, record) => this.renderCheckbox(obj, record, 'turnoverSheetStart'),
                            },
                        ]

                    },
                    {
                        key: 'group2',
                        dataIndex: '',
                        title: t('END'),
                        children: [
                            {
                                key: 'pageNumberEnd',
                                title: t('SHEET'),
                                dataIndex: 'pageNumberEnd',
                                width: '10%',
                                render: (obj, record) => this.renderNumber(obj, record, 'pageNumberEnd'),
                            },
                            {
                                key: 'turnoverSheetEnd',
                                title: t('TURNOVER'),
                                dataIndex: 'turnoverSheetEnd',
                                width: '10%',
                                render: (obj, record) => this.renderCheckbox(obj, record, 'turnoverSheetEnd'),
                            },
                        ]

                    },
                    {
                        key: 'documentPapers',
                        title: t('SHEETS_COUNT'),
                        dataIndex: 'documentPapers',
                        width: '10%',
                    },
                    {
                        key: 'dateForming',
                        title: t('DATE_CREATED'),
                        dataIndex: 'dateForming',
                        width: '15%',
                        render: val => val && moment(val).format('DD-MM-YYYY'),
                    },
                    {
                        key: 'nomenLastChangeDate',
                        title: t('DATE_CHANGED'),
                        dataIndex: 'nomenLastChangeDate',
                        width: '15%',
                        render: val =>   val &&  moment(val).format('DD-MM-YYYY')
                    },
                    {
                        key: 'action',
                        title: '',
                        dataIndex: '',
                        width: '10%',
                        render: (text, record) => {
                            const {editable} = record;
                            return (
                            <div className="editable-row-operations">
                                {
                                    editable ?
                                    <span>
                            <a onClick={() => this.save(record.key, record.parent)}><Icon
                            type="check"/></a>
                            <Popconfirm title="Отменить?"
                                        onConfirm={() => this.cancel(record.key, record.parent)}>
                              <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                            </Popconfirm>
                          </span>
                                    :
                                    <span>
                            <a><Icon type="edit" style={{fontSize: '14px'}}
                                     onClick={() => this.changeSelectedRow(record, true)}/></a>
                                        {!openNewRec &&
                                        <span>
                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')}
                                            onClick={e => e.stopPropagation()}
                                            onConfirm={() => {
                                                this.setState({openCard: false});
                                                const fd = new FormData();
                                                fd.append("cubeSConst", "cubeDocuments");
                                                fd.append("dimObjConst", "doDocuments");
                                                fd.append("objId", record.key.split('_')[1]);
                                                const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                                                dObj(fd)
                                                .then(res => {
                                                    hideLoading();
                                                    if (res.success) {
                                                        message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                                                        this.remove(record.key, record.parent)
                                                    } else {
                                                        throw res
                                                    }
                                                }).catch(err => {
                                                    console.error(err);
                                                    message.error(this.props.t('REMOVING_ERROR'))
                                                })
                                            }}>
                                  <a style={{
                                      color: '#f14c34',
                                      marginLeft: '10px',
                                      fontSize: '14px'
                                  }}><Icon type="delete" className="editable-cell-icon"/></a>
                                </Popconfirm>
                              </span>
                                        }
                          </span>
                                }
                            </div>
                            );
                        },
                    }
                ]}
                scroll={{y: '100%'}}
                pagination={{
                    pageSize: 20,
                    showQuickJumper: true,
                    current: this.state.currentTablePage
                }}
                dataSource={ tableData }
                rowClassName={record => this.state.selectedRowKey === record.key ? 'row-selected' : ''}
                onRowClick={this.changeSelectedRow}
                onRowDoubleClick={(record) => this.changeSelectedRow(record, true)}
                expandedRowKeys={this.state.expandedRowKeys}
                onExpand={this.onTableExpand}
                onChange={(pagination, filters, sorter, currentPageData) => this.setState({currentTablePage: pagination.current})}
                bordered
                />
                <CSSTransition
                in={openCard}
                timeout={300}
                classNames="card"
                unmountOnExit
                >
                    <SiderCard
                    t={t} tofiConstants={tofiConstants}
                    record={this.state.selectedRow}
                    caseList={this.state.filter.caseList}
                    flagSave={this.state.flagSave}
                    onSave={this.refreshRecord}
                    onEditRecordChange={this.onEditRecordChange}
                    onTabClick={this.onSideBarTabClick}
                    activeKey={this.state.sidebarActiveKey}
                    closer={<Button type='danger' onClick={this.closeCard} shape="circle"
                                    icon="arrow-right"/>}/>
                </CSSTransition>
            </div>
            <Modal
            visible={this.state.openModal}
            footer={<Button type="primary"
                            onClick={() => this.setState({openModal: false})}>OK</Button>}
            title={t('CHOISE_CASE')}
            >
                <div className="label-select-modal">
                    <div className="title-select">
                        {fundmakerArchive.name[this.lng] + ':'}
                    </div>
                    <Select
                    name="fundmakerArchive"
                    disabled={disabledFundmakerArchive}
                    isLoading={filterLoading.fundmakerArchive}
                    onFocus={this.loadOptionsProp('fundmakerArchive')}
                    value={filter.fundmakerArchive}
                    onChange={(item) => this.onChangeFundmakerArchive(item)}
                    options={fundmakerArchiveOptions ? fundmakerArchiveOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    placeholder={fundmakerArchive.name[this.lng]}
                    />
                </div>
                <div className="label-select-modal">
                    <div className="title-select">
                        {t('FUND_TYPE') + ':'}
                    </div>
                    <Select
                    name="fundType"
                    disabled={disabledFundType}
                    value={filter.fundType}
                    onChange={this.onChangeFundType}
                    options={['fundOrg', 'fundLP', 'collectionOrg', 'collectionLP', 'jointOrg', 'jointLP']
                    .map(c => ({value: c, label: tofiConstants[c].name[this.lng]}))}
                    placeholder={t('FUND_TYPE')}
                    />
                </div>
                <div className="label-select-modal">
                    <div className="title-select">
                        {t('FUND') + ':'}
                    </div>
                    <SelectVirt
                    name="fund"
                    isSearchable
                    disabled={disabledFundOrg}
                    optionHeight={40}
                    isLoading={filterLoading.fundOrg}
                    onFocus={() => {
                        this.setState({
                            filterLoading: {
                                ...this.state.filterLoading,
                                fundOrg: true
                            }
                        });
                        const fd = new FormData();
                        fd.append('clsConsts', filter.fundType.value);
                        fd.append('propConst', 'fundArchive');
                        fd.append('withProps', 'fundNumber, fundIndex');
                        fd.append('value', this.state.filter.fundmakerArchive.value);
                        getObjByProp(fd)
                        .then(res => {
                            if (res.success) {
                                this.setState({fundOrgOptions: res.data})
                            } else {
                                this.setState({fundOrgOptions: []})
                                throw res
                            }
                            this.setState({
                                filterLoading: {
                                    ...this.state.filterLoading,
                                    fundOrg: false
                                }
                            });
                        }).catch(err => console.log(err))
                    }}
                    value={filter.fundOrg}
                    onChange={(item) => this.onChangeFundOrg(item)}
                    options={fundOrgOptions ? fundOrgOptions.map(option => ({
                        value: option.id,
                        label: `${option.fundNumber[this.lng]} - ${option.fundIndex[this.lng]} - ${option.name[this.lng]}`,
                    })) : []}
                    placeholder={t('FUND')}
                    />
                </div>
                <div className="label-select-modal">
                    <div className="title-select">
                        {t('INVENTORY') + ':'}
                    </div>
                    <SelectVirt
                    name="inventory"
                    isSearchable
                    disabled={disabledInvList}
                    optionHeight={40}
                    isLoading={filterLoading.invList}
                    onFocus={() => {
                        this.setState({
                            filterLoading: {
                                ...this.state.filterLoading,
                                invList: true
                            }
                        });
                        const fd = new FormData();
                        fd.append('clsConsts', 'invList');
                        fd.append('propConst', 'invFund');
                        fd.append('withProps', 'invNumber, invType, documentType');
                        fd.append('value', this.state.filter.fundOrg.value);
                        getObjByProp(fd)
                        .then(res => {
                            if (res.success) {
                                this.setState({invListOptions: res.data})
                            } else {
                                this.setState({fundListOptions: []});
                                throw res
                            }
                            this.setState({
                                filterLoading: {
                                    ...this.state.filterLoading,
                                    invList: false
                                }
                            });
                        })
                        .catch(err => console.log(err))
                    }}
                    value={filter.invList}
                    onChange={(item) => this.onChangeInvList(item)}
                    options={invListOptions ? this.invListFilter(invListOptions) : []}
                    placeholder={t('INVENTORY')}/>
                </div>
                <div className="label-select-modal">
                    <div className="title-select">
                        {t('CASE') + ':'}
                    </div>
                    <SelectVirt
                    disabled={disabledCases}
                    isLoading={filterLoading.caseList}
                    onMenuOpen={() => {
                        this.setState({
                            filterLoading: {
                                ...this.state.filterLoading,
                                caseList: true
                            }
                        });
                        const fd = new FormData();
                        fd.append('clsConsts', 'caseList');
                        fd.append('propConst', 'caseInventory');
                        fd.append('withProps', 'caseOCD,caseFundOfUse,irreparablyDamaged,caseNumber,archiveCipher');
                        fd.append('value', this.state.filter.invList.value);
                        getObjByProp(fd)
                        .then(res => {
                            if (res.success) {
                                this.setState({caseListOptions: res.data})
                            } else {
                                throw res
                            }
                            this.setState({
                                filterLoading: {
                                    ...this.state.filterLoading,
                                    caseList: false
                                }
                            });
                        })
                        .catch(err => console.log(err))
                    }}
                    options={caseListOptions ? caseListOptions.map(option => ({
                        value: option.id,
                        caseNumber: option.caseNumber,
                        label: `${option.caseNumber[this.lng]} - ${option.name[this.lng]}`,
                        caseOCD: option.caseOCD,
                        caseFundOfUse: option.caseFundOfUse,
                        irreparablyDamaged: option.irreparablyDamaged,
                        archiveCipher: option.archiveCipher
                    })) : []}
                    value={filter.caseList && filter.caseList}
                    onChange={(item) => this.onChangeCaseList(item)}
                    placeholder={caseList.name[this.lng]}
                    />

                </div>

            </Modal>
        </div>
        )
    }
}

CreateDocument.propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

//const selector = formValueSelector('CreateDocument');

export default connect(state => {
    //const fundOrgValue = selector(state, 'fundOrg');
    return {
        //fundOrgValue,
        //fundOrgOptions: state.generalData.fundOrg,
        cubeDocuments: state.cubes.cubeDocuments,
        fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
        tofiConstants: state.generalData.tofiConstants || {},
        user: state.auth.user
    }
}, {getCube, getPropVal, getAllObjOfCls})(CreateDocument);