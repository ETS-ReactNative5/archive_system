import React from 'react';
import {Link} from 'react-router-dom';

class LegalEntitiesCard extends React.PureComponent {

  render() {
    return (
      <div className="LegalEntitiesCard">
        <Link to="123/providerInfo"><div className="LegalEntitiesCard_card">Сведения о комплектовании фонда</div></Link>
        <Link to="123/acts"><div className="LegalEntitiesCard_card">Акты</div></Link>
        <Link to="123/inventories"><div className="LegalEntitiesCard_card">Описи</div></Link>
      </div>
    )
  }
}

export default LegalEntitiesCard;