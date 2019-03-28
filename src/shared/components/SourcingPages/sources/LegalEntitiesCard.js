import React from 'react';
import {Link} from 'react-router-dom';

class LegalEntitiesCard extends React.PureComponent {

  render() {
    return (
      <div className="LegalEntitiesCard">
        <Link to="/sourcing/sourcesMaintenance/legalEntities/123/nmDocs"><div className="LegalEntitiesCard_card">Нормативно-методические документы</div></Link>
        <Link to="/sourcing/sourcesMaintenance/legalEntities/123/storageConditions"><div className="LegalEntitiesCard_card">Условия хранения документов</div></Link>
        <Link to="/sourcing/sourcesMaintenance/legalEntities/123/docsInfo"><div className="LegalEntitiesCard_card">Сведения о документах</div></Link>
        <Link to="/sourcing/sourcesMaintenance/legalEntities/123/inventories"><div className="LegalEntitiesCard_card">Описи</div></Link>
        <Link to="/sourcing/sourcesMaintenance/legalEntities/123/nomenclature"><div className="LegalEntitiesCard_card">Номенклатура дел</div></Link>
      </div>
    )
  }
}

export default LegalEntitiesCard;