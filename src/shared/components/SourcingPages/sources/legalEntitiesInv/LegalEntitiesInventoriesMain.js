import React from 'react';
import {Button, Table, Tree, Icon, Popconfirm, message} from 'antd';
import {CSSTransition} from 'react-transition-group';
import SiderCardLegalEntities from '../SiderCardLegalEntities';
import {isEmpty, map} from 'lodash';

import {SYSTEM_LANG_ARRAY} from '../../../../constants/constants';
import {connect} from 'react-redux';
import {
  createObj,
  getCube,
  getObjFromProp,
  getObjListNew,
  getPropVal,
  updateCubeData
} from '../../../../actions/actions';
import moment from 'moment';
import {getPropMeta, parseCube_new} from '../../../../utils/cubeParser';
import {CUBE_FOR_AF_CASE, CUBE_FOR_AF_INV, DO_FOR_CASE, DO_FOR_INV} from '../../../../constants/tofiConstants';
import LegalEntitiesInventoryProps from './LegalEntitiesInventoryProps';

/*eslint eqeqeq:0*/

class LegalEntitiesInventoriesMain extends React.Component {

  //=============================================================columns===================================================
  buildTableColumns = (invType, documentType) => {
    const {
      invTypePerm, uprDoc, uprNTD, invTypeVideo, videoDoc, movieDoc, invTypeMovie, movieVariant, formatAndBase,
      numberOfMovieItems, movieNegative, doubleNegative, phonogramNegative, phonogramMagnetic,
      intermediatePositive, positive, colorPassports, playingTime, invTypeAlbum, photoDoc,
      invTypeLS, LSDoc,
      fundNumber, caseDbeg, caseDend, caseNumberOfPages, caseOCD, fundIndex, caseNotes, uprDocType, documentAuthor,
      addressee, question, terrain, documentDate, inaccurateDate, inaccurateDateFeature, day, month, year,
      numberOfOriginals, typeOfPaperCarrier, caseNomenItem, objectCode, projectName, projectStage, projectPartName,
      volumeNumber, yearOfCompletion, accountingUnitNumber, authorTitle, cameraOperator, artistOfTheWork,
      documentLanguage, dateOfRecording, timingOfVideoRecording, TypeAndFormatOfRecording, copy, original, numberOfVideoItems,
      compositionOfTextDocumentation, photoDescription, documentShootAuthor, shootingDate, numberOfPhotoPrints,
      externalFeatures, shootPlace
    } = this.props.tofiConstants;
    switch (true) {
      case (invType == invTypePerm.id && documentType == uprDoc.id):
        return [
          {
            key: 'fundNumber',
            title: fundNumber.name[this.lng],
            dataIndex: 'fundNumber',
            width: '6%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundIndex',
            title: fundIndex.name[this.lng],
            dataIndex: 'fundIndex',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 20;
              }
              return obj;
            }
          },
          {
            key: 'cases',
            title: 'Заголовок дела',
            dataIndex: 'cases',
            width: '12%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'uprDocType',
            title: uprDocType.name[this.lng],
            dataIndex: 'uprDocType',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'documentAuthor',
            title: documentAuthor.name[this.lng],
            dataIndex: 'documentAuthor',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'addressee',
            title: addressee.name[this.lng],
            dataIndex: 'addressee',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'question',
            title: question.name[this.lng],
            dataIndex: 'question',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'terrain',
            title: terrain.name[this.lng],
            dataIndex: 'terrain',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'documentDate',
            title: documentDate.name[this.lng],
            dataIndex: 'documentDate',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value && value.format('DD-MM-YYYY'),
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            title: inaccurateDate.name[this.lng],
            children: [
              {
                key: 'inaccurateDateFeature',
                title: inaccurateDateFeature.name[this.lng],
                dataIndex: 'inaccurateDateFeature',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: value && value.label,
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  }
                  return obj;
                }
              },
              {
                key: 'day',
                title: day.name[this.lng],
                dataIndex: 'day',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: value,
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  }
                  return obj;
                }
              },
              {
                key: 'month',
                title: month.name[this.lng],
                dataIndex: 'month',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: value,
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  }
                  return obj;
                }
              },
              {
                key: 'year',
                title: year.name[this.lng],
                dataIndex: 'year',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: value,
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  }
                  return obj;
                }
              }
            ]
          },
          {
            key: 'caseDbeg',
            title: caseDbeg.name[this.lng],
            dataIndex: 'caseDbeg',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value && value.format('DD-MM-YYYY'),
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseDend',
            title: caseDend.name[this.lng],
            dataIndex: 'caseDend',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value && value.format('DD-MM-YYYY'),
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNumberOfPages',
            title: caseNumberOfPages.name[this.lng],
            dataIndex: 'caseNumberOfPages',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseOCD',
            title: caseOCD.name[this.lng],
            dataIndex: 'caseOCD',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value && value.label,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNotes',
            title: caseNotes.name[this.lng],
            dataIndex: 'caseNotes',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'numberOfOriginals',
            title: numberOfOriginals.name[this.lng],
            dataIndex: 'numberOfOriginals',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'typeOfPaperCarrier',
            title: typeOfPaperCarrier.name[this.lng],
            dataIndex: 'typeOfPaperCarrier',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value && value.label,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNomenItem',
            title: caseNomenItem.name[this.lng],
            dataIndex: 'caseNomenItem',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value && value.label,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
        ];
      case (invType == invTypePerm.id && documentType == uprNTD.id):
        return [
          {
            key: 'fundNumber',
            title: fundNumber.name[this.lng],
            dataIndex: 'fundNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundIndex',
            title: fundIndex.name[this.lng],
            dataIndex: 'fundIndex',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 20;
              }
              return obj;
            }
          },
          {
            key: 'cases',
            title: 'Заголовок дела',
            dataIndex: 'cases',
            width: '12%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'objectCode',
            title: objectCode.name[this.lng],
            dataIndex: 'objectCode',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'projectName',
            title: projectName.name[this.lng],
            dataIndex: 'projectName',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'projectStage',
            title: projectStage.name[this.lng],
            dataIndex: 'projectStage',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'projectPartName',
            title: projectPartName.name[this.lng],
            dataIndex: 'projectPartName',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'volumeNumber',
            title: volumeNumber.name[this.lng],
            dataIndex: 'volumeNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'documentAuthor',
            title: documentAuthor.name[this.lng],
            dataIndex: 'documentAuthor',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'yearOfCompletion',
            title: yearOfCompletion.name[this.lng],
            dataIndex: 'yearOfCompletion',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'caseDbeg',
            title: caseDbeg.name[this.lng],
            dataIndex: 'caseDbeg',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseDend',
            title: caseDend.name[this.lng],
            dataIndex: 'caseDend',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNumberOfPages',
            title: caseNumberOfPages.name[this.lng],
            dataIndex: 'caseNumberOfPages',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'caseNotes',
            title: caseNotes.name[this.lng],
            dataIndex: 'caseNotes',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'numberOfOriginals',
            title: numberOfOriginals.name[this.lng],
            dataIndex: 'numberOfOriginals',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'typeOfPaperCarrier',
            title: typeOfPaperCarrier.name[this.lng],
            dataIndex: 'typeOfPaperCarrier',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNomenItem',
            title: caseNomenItem.name[this.lng],
            dataIndex: 'caseNomenItem',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
        ]
      case (invType == invTypeVideo.id && documentType == videoDoc.id):
        return [
          {
            key: 'accountingUnitNumber',
            title: accountingUnitNumber.name[this.lng],
            dataIndex: 'accountingUnitNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundNumber',
            title: fundNumber.name[this.lng],
            dataIndex: 'fundNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundIndex',
            title: fundIndex.name[this.lng],
            dataIndex: 'fundIndex',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 20;
              }
              return obj;
            }
          },
          {
            key: 'cases',
            title: 'Заголовок дела',
            dataIndex: 'cases',
            width: '12%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'authorTitle',
            title: authorTitle.name[this.lng],
            dataIndex: 'authorTitle',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'cameraOperator',
            title: cameraOperator.name[this.lng],
            dataIndex: 'cameraOperator',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'artistOfTheWork',
            title: artistOfTheWork.name[this.lng],
            dataIndex: 'artistOfTheWork',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'documentLanguage',
            title: documentLanguage.name[this.lng],
            dataIndex: 'documentLanguage',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'dateOfRecording',
            title: dateOfRecording.name[this.lng],
            dataIndex: 'dateOfRecording',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'timingOfVideoRecording',
            title: timingOfVideoRecording.name[this.lng],
            dataIndex: 'timingOfVideoRecording',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'TypeAndFormatOfRecording',
            title: TypeAndFormatOfRecording.name[this.lng],
            dataIndex: 'TypeAndFormatOfRecording',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            title: numberOfVideoItems.name[this.lng],
            children: [
              {
                key: 'original',
                title: original.name[this.lng],
                dataIndex: 'original',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = value
                  }
                  return obj;
                }
              },
              {
                key: 'copy',
                title: copy.name[this.lng],
                dataIndex: 'copy',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = value
                  }
                  return obj;
                }
              }
            ]
          },
          {
            key: 'compositionOfTextDocumentation',
            title: compositionOfTextDocumentation.name[this.lng],
            dataIndex: 'compositionOfTextDocumentation',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          /*{
            key: 'typeOfPaperCarrier',
            title: typeOfPaperCarrier.name[this.lng],
            dataIndex: 'typeOfPaperCarrier',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },*/
          {
            key: 'caseNomenItem',
            title: caseNomenItem.name[this.lng],
            dataIndex: 'caseNomenItem',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
        ]
      case (invType == invTypeMovie.id && documentType == movieDoc.id):
        return [
          {
            key: 'accountingUnitNumber',
            title: accountingUnitNumber.name[this.lng],
            dataIndex: 'accountingUnitNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundNumber',
            title: fundNumber.name[this.lng],
            dataIndex: 'fundNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundIndex',
            title: fundIndex.name[this.lng],
            dataIndex: 'fundIndex',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 20;
              }
              return obj;
            }
          },
          {
            key: 'cases',
            title: 'Заголовок дела',
            dataIndex: 'cases',
            width: '12%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'authorTitle',
            title: authorTitle.name[this.lng],
            dataIndex: 'authorTitle',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'cameraOperator',
            title: cameraOperator.name[this.lng],
            dataIndex: 'cameraOperator',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'shootingDate',
            title: shootingDate.name[this.lng],
            dataIndex: 'shootingDate',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value && value.format('DD-MM-YYYY')
              }
              return obj;
            }
          },
          {
            key: 'shootPlace',
            title: shootPlace.name[this.lng],
            dataIndex: 'shootPlace',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'documentLanguage',
            title: documentLanguage.name[this.lng],
            dataIndex: 'documentLanguage',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'movieVariant',
            title: movieVariant.name[this.lng],
            dataIndex: 'movieVariant',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'formatAndBase',
            title: formatAndBase.name[this.lng],
            dataIndex: 'formatAndBase',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            title: numberOfMovieItems.name[this.lng],
            children: [
              {
                key: 'movieNegative',
                title: movieNegative.name[this.lng],
                dataIndex: 'movieNegative',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = value
                  }
                  return obj;
                }
              },
              {
                key: 'doubleNegative',
                title: doubleNegative.name[this.lng],
                dataIndex: 'doubleNegative',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = value
                  }
                  return obj;
                }
              },
              {
                key: 'phonogramNegative',
                title: phonogramNegative.name[this.lng],
                dataIndex: 'phonogramNegative',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = value
                  }
                  return obj;
                }
              },
              {
                key: 'phonogramMagnetic',
                title: phonogramMagnetic.name[this.lng],
                dataIndex: 'phonogramMagnetic',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = value
                  }
                  return obj;
                }
              },
              {
                key: 'intermediatePositive',
                title: intermediatePositive.name[this.lng],
                dataIndex: 'intermediatePositive',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = value
                  }
                  return obj;
                }
              },
              {
                key: 'positive',
                title: positive.name[this.lng],
                dataIndex: 'positive',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = value
                  }
                  return obj;
                }
              },
              {
                key: 'colorPassports',
                title: colorPassports.name[this.lng],
                dataIndex: 'colorPassports',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if (rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = value
                  }
                  return obj;
                }
              }
            ]
          },
          {
            key: 'playingTime',
            title: playingTime.name[this.lng],
            dataIndex: 'playingTime',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'compositionOfTextDocumentation',
            title: compositionOfTextDocumentation.name[this.lng],
            dataIndex: 'compositionOfTextDocumentation',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'caseNotes',
            title: caseNotes.name[this.lng],
            dataIndex: 'caseNotes',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'numberOfOriginals',
            title: numberOfOriginals.name[this.lng],
            dataIndex: 'numberOfOriginals',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'caseNomenItem',
            title: caseNomenItem.name[this.lng],
            dataIndex: 'caseNomenItem',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
        ];
      case (invType == invTypeAlbum.id && documentType == photoDoc.id):
        return [
          {
            key: 'fundNumber',
            title: fundNumber.name[this.lng],
            dataIndex: 'fundNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'cases',
            title: 'Заголовок дела',
            dataIndex: 'cases',
            width: '12%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'photoDescription',
            title: photoDescription.name[this.lng],
            dataIndex: 'photoDescription',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'documentShootAuthor',
            title: documentShootAuthor.name[this.lng],
            dataIndex: 'documentShootAuthor',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'caseDbeg',
            title: caseDbeg.name[this.lng],
            dataIndex: 'caseDbeg',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value && value.format('DD-MM-YYYY')
              }
              return obj;
            }
          },
          {
            key: 'caseDend',
            title: caseDend.name[this.lng],
            dataIndex: 'caseDend',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value && value.format('DD-MM-YYYY')
              }
              return obj;
            }
          },
          {
            key: 'shootPlace',
            title: shootPlace.name[this.lng],
            dataIndex: 'shootPlace',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'numberOfPhotoPrints',
            title: numberOfPhotoPrints.name[this.lng],
            dataIndex: 'numberOfPhotoPrints',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'compositionOfTextDocumentation',
            title: compositionOfTextDocumentation.name[this.lng],
            dataIndex: 'compositionOfTextDocumentation',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'externalFeatures',
            title: externalFeatures.name[this.lng],
            dataIndex: 'externalFeatures',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNotes',
            title: caseNotes.name[this.lng],
            dataIndex: 'caseNotes',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'numberOfOriginals',
            title: numberOfOriginals.name[this.lng],
            dataIndex: 'numberOfOriginals',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'formatAndBase',
            title: formatAndBase.name[this.lng],
            dataIndex: 'formatAndBase',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'caseNomenItem',
            title: caseNomenItem.name[this.lng],
            dataIndex: 'caseNomenItem',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
        ];
      case (invType == invTypeLS.id && documentType == LSDoc.id):
        return [
          {
            key: 'fundNumber',
            title: fundNumber.name[this.lng],
            dataIndex: 'fundNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundIndex',
            title: fundIndex.name[this.lng],
            dataIndex: 'fundIndex',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'cases',
            title: 'Заголовок дела',
            dataIndex: 'cases',
            width: '12%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'caseDbeg',
            title: caseDbeg.name[this.lng],
            dataIndex: 'caseDbeg',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value && value.format('DD-MM-YYYY')
              }
              return obj;
            }
          },
          {
            key: 'caseDend',
            title: caseDend.name[this.lng],
            dataIndex: 'caseDend',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value && value.format('DD-MM-YYYY')
              }
              return obj;
            }
          },
          {
            key: 'caseNumberOfPages',
            title: caseNumberOfPages.name[this.lng],
            dataIndex: 'caseNumberOfPages',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNotes',
            title: caseNotes.name[this.lng],
            dataIndex: 'caseNotes',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'numberOfOriginals',
            title: numberOfOriginals.name[this.lng],
            dataIndex: 'numberOfOriginals',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'typeOfPaperCarrier',
            title: typeOfPaperCarrier.name[this.lng],
            dataIndex: 'typeOfPaperCarrier',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = value
              }
              return obj;
            }
          },
          {
            key: 'caseNomenItem',
            title: caseNomenItem.name[this.lng],
            dataIndex: 'caseNomenItem',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if (rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
        ];
      default:
        return []
    }
  };
  //=============================================================columns===================================================

  state = {
    data: [],
    loading: false,
    formData: {},
    expandedKeys: [],
    lInv: {},
    openPropsForm: true,
  };

  componentDidMount() {
    this.setState({loading: true});
    const filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_INV,
          concatType: "and",
          conds: [
            {
              ids: this.props.match.params.invId
            }
          ]
        }
      ]
    };
    this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters), {nodeWithChilds: 1});
  }

  componentDidUpdate(prevProps) {
    if(isEmpty(this.props.tofiConstants)) return;
    if (prevProps.CubeForAF_Inv !== this.props.CubeForAF_Inv) {
      const {tofiConstants: {doForInv, dpForInv}} = this.props;
      const parsedCube = parseCube_new(
        this.props.CubeForAF_Inv['cube'],
        [],
        'dp',
        'do',
        this.props.CubeForAF_Inv[`do_${doForInv.id}`],
        this.props.CubeForAF_Inv[`dp_${dpForInv.id}`],
        `do_${doForInv.id}`,
        `dp_${dpForInv.id}`
      );
      const lInv = parsedCube.find(el => !Number(el.parent));
      let data = [];
      let initialValues = {};
      let checkedKeys = [];
      const initChildren = el => {
        return {
          key: el.id,
          parent: el.parent,
          objClass: 'structuralSubdivisionList',
          fundIndex: el.name[this.lng],
          caseTitle: el.name[this.lng],
          title: el.name[this.lng],
          children: parsedCube.filter(elem => elem.parent == el.id).map(initChildren)
        }
      };
      if (lInv && parsedCube.length >= 1) {
        data = parsedCube
          .filter(el => el.parent == lInv.id)
          .map(initChildren);
        const invNumberObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invNumber.id);
        const invTypeObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invType.id);
        const documentTypeObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.documentType.id);
        const fundNumberOfCasesObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.fundNumberOfCases.id);
        const invDatesObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invDates.id);
        const invNomenObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invNomen.id);
        const invCaseSystemObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invCaseSystem.id);
        // const casesQuantityObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.casesQuantity.id);
        const invDeadlineObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invDeadline.id);
        const invAgreementDateObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invAgreementDate.id);
        const invAgreement2DateObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invAgreement2Date.id);
        const invApprovalDate1Obj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invApprovalDate1.id);
        const invApprovalDate2Obj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.invApprovalDate2.id);
        const agreementProtocolObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.agreementProtocol.id);
        const agreement2ProtocolObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.agreement2Protocol.id);
        const approvalProtocolObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.approvalProtocol.id);
        const nomenLastChangeDateObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenLastChangeDate.id);
        const expertObj = lInv.props.find(doProp => doProp.prop == this.props.tofiConstants.expert.id);
        const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === lInv.accessLevel);

        initialValues = {
          key: lInv.id,
          invNumber: invNumberObj ? invNumberObj.value : '',
          name: lInv.name[this.lng],
          accessLevel: accessLevelObj && {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]},
          invType: invTypeObj && invTypeObj.refId ? {value: invTypeObj.refId, label: invTypeObj.value} : null,
          documentType: documentTypeObj && documentTypeObj.refId ? {
            value: documentTypeObj.refId,
            label: documentTypeObj.value
          } : null,
          fundNumberOfCases: fundNumberOfCasesObj ? fundNumberOfCasesObj.value : '',
          invDates: invDatesObj && invDatesObj.values ? invDatesObj.values.map(str => ({value: str})) : [],
          invCaseSystem: invCaseSystemObj && invCaseSystemObj.refId ? {
            value: invCaseSystemObj.refId,
            label: invCaseSystemObj.value
          } : null,
          // casesQuantity: casesQuantityObj ? casesQuantityObj.value : '',
          invNomen: invNomenObj && invNomenObj.values ? invNomenObj.values : [],
          agreementProtocol: agreementProtocolObj && agreementProtocolObj.values ? agreementProtocolObj.values : [],
          agreement2Protocol: agreement2ProtocolObj && agreement2ProtocolObj.values ? agreement2ProtocolObj.values : [],
          approvalProtocol: approvalProtocolObj && approvalProtocolObj.values ? approvalProtocolObj.values : [],
          invDeadline: invDeadlineObj && invDeadlineObj.value ? moment(invDeadlineObj.value, "DD-MM-YYYY") : null,
          invAgreementDate: invAgreementDateObj && invAgreementDateObj.value ? moment(invAgreementDateObj.value, "DD-MM-YYYY") : null,
          invAgreement2Date: invAgreement2DateObj && invAgreement2DateObj.value ? moment(invAgreement2DateObj.value, "DD-MM-YYYY") : null,
          invApprovalDate2: invApprovalDate2Obj && invApprovalDate2Obj.value ? moment(invApprovalDate2Obj.value, "DD-MM-YYYY") : null,
          invApprovalDate1: invApprovalDate1Obj && invApprovalDate1Obj.value ? moment(invApprovalDate1Obj.value, "DD-MM-YYYY") : null,
          nomenLastChangeDate: nomenLastChangeDateObj && nomenLastChangeDateObj.value ? moment(nomenLastChangeDateObj.value, "DD-MM-YYYY") : null,
          expert: expertObj && expertObj.cube && expertObj.cube.idRef ? {
            value: expertObj.cube.idRef,
            label: expertObj.value
          } : {},
        }
      }
      this.setState({
        lInv,
        data,
        formData: initialValues,
        checkedKeys,
        loading: false
      });
    }
  }

  getObject = (theObject, key) => {
    let result = null;
    if (theObject instanceof Array) {
      for (let i = 0; i < theObject.length; i++) {
        result = this.getObject(theObject[i], key);
        if (result) return result;
      }
    }
    else if (theObject instanceof Object) {
      if (theObject.key == key) {
        return theObject;
      }
      result = this.getObject(theObject.children, key);
    } else return null;
    return result;
  };
  removeObject = (theObject, key) => {
    let result = null;
    if (theObject instanceof Array) {
      for (let i = 0; i < theObject.length; i++) {
        result = this.removeObject(theObject[i], key);
        if (result) {
          // eslint-disable-next-line
          theObject.forEach((item, idx) => {
            if (item.key === result.key) {
              theObject.splice(idx, 1);
              return;
            }
          });
        }
      }
    }
    else if (theObject instanceof Object) {
      if (theObject.key === key) {
        return theObject;
      }
      result = this.removeObject(theObject.children, key);
    } else return null;
    return result;
  };

  stopPropagation = e => {
    e.stopPropagation();
  };
  remove = key => {
    const newData = this.state.data.slice();
    this.removeObject(newData, key);
    this.setState({data: newData});
  };
  cancel = key => {
    const newData = this.state.data.slice();
    if (key.includes('newData')) {
      this.removeObject(newData, key);
      this.setState({data: newData});
      return;
    }
    const target = this.getObject(newData, key);
    if (target) {
      delete target.editable;
      this.setState({data: newData});
    }
  };

  loadOptions = c => {
    return () => {
      if (!this.props[c + 'Options']) {
        this.props.getPropVal(c)
      }
    }
  };

  onExpand = (expanded, record) => {
    if (expanded && record.children.length === 0) {
      this.setState({loading: true, expandedKeys: this.state.expandedKeys.concat(record.key)});
      const filters = {
        filterDOAnd: [
          {
            dimConst: DO_FOR_CASE,
            concatType: "and",
            conds: [
              {
                data: {
                  valueRef: {
                    id: record.key
                  }
                }
              }
            ]
          }
        ]
      };
      this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters))
        .then(res => {
          if (res.cube) {
            const newData = this.state.data.slice();
            const target = this.getObject(newData, record.key);
            if (target) {
              const {doForCase, dpForCase} = this.props.tofiConstants;
              target.children = parseCube_new(
                res.cube['cube'],
                [],
                'dp',
                'do',
                res.cube[`do_${doForCase.id}`],
                res.cube[`dp_${dpForCase.id}`],
                `do_${doForCase.id}`,
                `dp_${dpForCase.id}`
              ).map(this.renderTableData);
              this.setState({
                data: newData,
                loading: false
              });
            }
          }
        })
    } else if(!expanded) {
      this.setState({ expandedKeys: this.state.expandedKeys.filter(k => k !== record.key) })
    }
  };

  onRowDoubleClick = (rec) => {
    if(rec.objClass === 'caseList') {
      this.props.history.push({
        pathname: `/sourcing/sourcesMaintenance/legalEntities/${this.props.match.params.id}/inventories`,
        state: {
          record: this.props.location.state.record,
          fromTable: {
            expandedKeys: this.state.expandedKeys,
            data: this.state.data,
            formData: this.state.formData,
            lInv: this.state.lInv,
            selectedNode: rec
          }
        }
      })
    }
  };

  //get all values from cube and populate related ones only
  renderTableData = (item) => {
    //adding some extra values to be able to switch form variant easily
    const result = {
      key: item.props.find(dp => `_P_${dp.prop}` === this.props.tofiConstants.caseNomenItem.cod).cube.idRef,
      caseKey: item.id,
      cases: item.name[this.lng],
      caseTitle: item.name[this.lng],
      title: item.name[this.lng],
      objClass: 'caseList'
    };
    item.props.forEach(dp => {
      const c = Object.keys(this.props.tofiConstants).find(c => this.props.tofiConstants[c].cod === `_P_${dp.prop}`);
      if (c) {
        if (dp.isUniq === 1 && dp.value) {
          switch (dp.typeProp) {
            case 11: {
              result[c] = {value: dp.refId, label: dp.value};
              break;
            }
            case 312: {
              result[c] = moment(dp.value, 'DD-MM-YYYY');
              break;
            }
            case 41: {
              result[c] = {value: dp.cube.idRef, label: dp.value};
              break;
            }
            default: {
              result[c] = dp.value;
              break;
            }
          }
        } else if (dp.isUniq === 2 && dp.values) {
          switch (dp.typeProp) {
            default:
              result[c] = dp.values;
          }
        }
      }
    });
    return result;
  };

  onSaveCubeData = (objVerData, {agreementProtocol, agreement2Protocol, approvalProtocol, ...values}, doItemProp, objDataProp) => {
    let datas = [];
    try {
      datas = [{
        own: [{doConst: objVerData.cube.doConst, doItem: doItemProp, isRel: "0", objData: objDataProp}],
        props: map(values, (val, key) => {
          const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
          let value = val;
          if ((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {
            kz: val,
            ru: val,
            en: val
          };
          if (val && typeof val === 'object' && val.value) value = String(val.value);
          if (val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
          if (propMetaData.isUniq === 2 && val[0] && val[0].value) {
            propMetaData.mode = val[0].mode;
            value = val.map(v => String(v.value)).join(",");
          }
          return {
            propConst: key,
            val: value,
            typeProp: String(propMetaData.typeProp),
            periodDepend: String(propMetaData.periodDepend),
            isUniq: String(propMetaData.isUniq),
            mode: propMetaData.mode,
            parent: propMetaData.parent
          }
        }),
        periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
      }];
    } catch (err) {
      console.error(err);
      return Promise.reject();
    }
    const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 100);
    return updateCubeData(objVerData.cube.cubeSConst, moment().format('YYYY-MM-DD'), JSON.stringify(datas), {}, {
      approvalProtocol,
      agreementProtocol,
      agreement2Protocol
    })
      .then(res => {
        hideLoading();
        if (res.success) {
          this.setState(state => ({ formData: {...state.formData, ...values} }) );
          message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
          if (this.filters) {
            this.setState({loading: true});
            return this.props.getCube(objVerData.cube.cubeSConst, JSON.stringify(this.filters))
              .then(() => {
                this.setState({loading: false});
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
      .catch(err => {
        console.error(err);
        return Promise.reject();
      })
  };

  render() {
    if (isEmpty(this.props.tofiConstants)) return null;
    const {data, lInv, formData, openPropsForm, loading} = this.state;
    const {t, invTypeOptions, invCaseSystemOptions, documentTypeOptions, tofiConstants} = this.props;

    this.lng = localStorage.getItem('i18nextLng');
    const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === 1);
    return (
      <div className="LegalEntitiesInventoriesMain">
        <CSSTransition
          in={openPropsForm}
          timeout={300}
          classNames="card"
          unmountOnExit={false}
        >
          <div className="LegalEntitiesInventoriesMain__property">
            <LegalEntitiesInventoryProps
              tofiConstants={tofiConstants}
              lng={this.lng}
              user={this.props.user}
              createNewObj={this.createNewObj}
              onSaveCubeData={this.onSaveCubeData}
              t={t}
              getNomenOptions={() => {
                const fd = new FormData();
                fd.append('objId', this.props.location.state.record.key.split('_')[1]);
                fd.append('propConst', 'nomen');
                getObjFromProp(fd)
                  .then(res => {
                    if (res.success) {
                      this.setState({
                        nomenOptions: res.data.length !== 0 ? res.data.map(option => ({
                          value: option.id,
                          label: option.name[this.lng]
                        })) : []
                      })
                    }
                  })
              }}
              record={this.props.location && this.props.location.state && this.props.location.state.record}
              nomenOptions={this.state.nomenOptions}
              initialValues={{
                accessLevel: {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]},
                ...formData
              }}
              invTypeOptions={invTypeOptions}
              documentTypeOptions={documentTypeOptions}
              invCaseSystemOptions={invCaseSystemOptions}
              loadOptions={this.loadOptions}
            />
          </div>
        </CSSTransition>
        <div className="LegalEntitiesInventoriesMain__table">
          <Button
            id="trigger"
            size="small"
            shape="circle"
            icon={openPropsForm ? "arrow-left" : "arrow-right"}
            onClick={() =>
              this.setState({openPropsForm: !this.state.openPropsForm})
            }
          />
          {/*<div className="LegalEntitiesInventoriesMain__table__heading">
            <div className="table-header">
              {lInv.name && <h3 style={{
                textAlign: 'right',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                paddingRight: '10px'
              }}>{lInv.name.kz}</h3>}
            </div>
          </div>*/}
          <div className="LegalEntitiesInventoriesMain__table__body">
            <div className="LegalEntitiesInventoriesMain__table__body--main">
              <Table
                columns={[
                  ...this.buildTableColumns(formData.invType && formData.invType.value, formData.documentType && formData.documentType.value),
                  {
                    key: 'action',
                    title: 'action',
                    dataIndex: 'a',
                    width: '2%',
                    render: (text, record) => {
                      return (
                        <span className="editable-row-operations">
                          <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                            <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}
                               onClick={this.stopPropagation}><Icon type="delete" className="editable-cell-icon"/></a>
                          </Popconfirm>
                      </span>
                      );
                    }
                  }
                ]}
                onRowDoubleClick={this.onRowDoubleClick}
                onExpand={this.onExpand}
                size="small"
                loading={loading}
                bordered
                dataSource={data}
                onRowClick={this.onRowClick}
                scroll={{y: '100%'}}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV],
    CubeForAF_Case: state.cubes[CUBE_FOR_AF_CASE],
    invTypeOptions: state.generalData.invType,
    invCaseSystemOptions: state.generalData.invCaseSystem,
    documentTypeOptions: state.generalData.documentType,
    typeOfPaperCarrierOptions: state.generalData.typeOfPaperCarrier,
    inaccurateDateFeatureOptions: state.generalData.inaccurateDateFeature,
    uprDocTypeOptions: state.generalData.uprDocType,
    accessLevelOptions: state.generalData.accessLevel
  }
}

export default connect(mapStateToProps, {getPropVal, getCube})(LegalEntitiesInventoriesMain);