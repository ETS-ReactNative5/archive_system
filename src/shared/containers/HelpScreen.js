import React, { Component } from 'react';
import { translate } from 'react-i18next';

import Sider2 from '../components/Sider2';
import FAQPage from '../components/HelpScreenPages/FAQPage';
import Instructions from '../components/HelpScreenPages/Instructions';
import Header from '../components/Header';

class  CollectionsLayout extends Component {
  constructor(props) {
    super(props);
    const { t } = this.props;

    this.state = {
      collections: [
        {
          name: t('FAQ'),
          link: 'FAQPage'
        },
        {
          name: t('INSTRUCTIONS'),
          link: 'Instructions'
        }
      ],

      siderIsOpen: true,


    }

  }

  siderToggle = () => {
    this.setState({
      siderIsOpen: !this.state.siderIsOpen
    });
  };

  renderCollections = () => {
    return this.state.collections.map( (item, idx) => {
      return (
        <li key={idx}>
          <span onClick={() => document.getElementsByClassName(`${item.link}`)[0].scrollIntoView({behavior: 'smooth'})} className="sider-nav">{ item.name }</span>
        </li>);
    });
  };


  render() {

    const { siderIsOpen } = this.state;
    const { t } = this.props;

    return (
      <div className="main-layout">
        <Header />
        <div className="collections content">
          {/*<Sider2 siderIsOpen={siderIsOpen} siderToggle={this.siderToggle}>
            <h3 className="SiderMenu__header">
              Помощь
            </h3>
            <ul className="SiderMenu__collectionsList">
              {this.renderCollections()}
            </ul>
          </Sider2>*/}
          <div className={`collections__content ${ siderIsOpen ? 'collections__content-pushed' : '' }`}>
            <FAQPage
              t={t}
              questions={[
                  {
                      title: t('HOWTOSIGNUP'),
                      body: t('HOWTOSIGNUP_ANSWER')
                  },
                  {
                      title: t('HOWTOORDERCASES'),
                      body: t('HOWTOORDERCASES_ANSWER'),
                  },
                  {
                      title: t('HOWTOVIEWORDERS'),
                      body: t('HOWTOVIEWORDERS_ANSWER')
                  }
              ]
              }
              translations={
                {
                  FAQ: t('FAQ')
                }
              }
            />
            <Instructions
            />
          </div>
        </div>
      </div>
    );
  }
}

export default translate('helpScreen')(CollectionsLayout);
