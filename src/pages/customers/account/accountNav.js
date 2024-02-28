import React from 'react';
import PropTypes from 'prop-types';

const AccountNav = ({ customerId, pageId }) => {

  return <><h4 className="subheader">Business settings</h4>
    <div className="list-group list-group-transparent">
      <a href={`/customers/${customerId}/account/profile`} className={`list-group-item list-group-item-action d-flex align-items-center ${activeClass(pageId, 'profile')}`}>My Account</a>
      {/*<a href="#" className={`list-group-item list-group-item-action d-flex align-items-center`}>My Notifications</a> */}
      <a href={`/customers/${customerId}/account/security`} className={`list-group-item list-group-item-action d-flex align-items-center ${activeClass(pageId, 'security')}`}>Security</a>
      {/* <a href={`/customers/${customerId}/account/moneyin`} className={`list-group-item list-group-item-action d-flex align-items-center ${activeClass(pageId, 'moneyin')}`}>Payment Preferences</a> */}
      <a href={`/customers/${customerId}/account/moneyout`} className={`list-group-item list-group-item-action d-flex align-items-center ${activeClass(pageId, 'moneyout')}`}>Funds Transfer</a>
      <a href={`/customers/${customerId}/account/treesettings`} className={`list-group-item list-group-item-action d-flex align-items-center ${activeClass(pageId, 'treesettings')}`}>Placement Rules</a>
    </div>
    {/* <h4 className="subheader mt-4">Experience</h4>
    <div className="list-group list-group-transparent">
        <a href="#" className="list-group-item list-group-item-action">Give Feedback</a>
    </div> */}
  </>

}

function activeClass(current, pageId) {
  if (current == pageId) return 'active';
  return '';
}

export default AccountNav;

AccountNav.propTypes = {
  customerId: PropTypes.string.isRequired,
  pageId: PropTypes.string.isRequired
}