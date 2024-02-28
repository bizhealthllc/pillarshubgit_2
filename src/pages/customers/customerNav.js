import React from 'react';
import PropTypes from 'prop-types';
import { GetScope } from "../../features/authentication/hooks/useToken"
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

var GET_DATA = gql`query {
  trees{
    id
    name
  }
}`;

const CustomerNav = ({ customerId, pageId }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const periodId = queryParams.get("periodId");
  const { data } = useQuery(GET_DATA, {
    variables: {}
  });

  if (GetScope() == customerId) {
    return <></>;
  }

  return <>

    <ul className="navbar-nav">
      <li className={`nav-item ${activeClass(pageId, 'summary')}`}>
        <Link className="nav-link" to={`/customers/${customerId}/summary${periodId ? '?periodId=' + periodId : ''}`}>
          <span className="nav-link-title">Summary</span>
        </Link>
      </li>
      <li className={`nav-item ${activeClass(pageId, 'orders')}`}>
        <Link className="nav-link" to={`/customers/${customerId}/orders${periodId ? '?periodId=' + periodId : ''}`}>
          <span className="nav-link-title">Order History</span>
        </Link>
      </li>
      {/* <li className="nav-item">
                    <Link className="nav-link" to={`/customers/${customerId}/autoships${periodId ? '?periodId=' + periodId : ''}`}>
                        <span className="nav-link-title">
                            Autoships
                        </span>
                    </Link>
                </li> */}
      <li className={`nav-item ${activeClass(pageId, 'commissions')}`}>
        <Link className="nav-link" to={`/customers/${customerId}/commissions${periodId ? '?periodId=' + periodId : ''}`}>
          <span className="nav-link-title">Earnings</span>
        </Link>
      </li>
      {/* <li className="nav-item">
                    <Link className="nav-link" to={`/customers/${customerId}/reports${periodId ? '?periodId=' + periodId : ''}`}>
                        <span className="nav-link-title">
                            Reports
                        </span>
                    </Link>
                </li> */}
      {GetScope() == null &&
        <li className={`nav-item ${activeClass(pageId, 'dashboard')}`}>
          <Link className="nav-link" to={`/customers/${customerId}/dashboard${periodId ? '?periodId=' + periodId : ''}`}>
            <span className="nav-link-title">Dashboard</span>
          </Link>
        </li>
      }
      {GetScope() == null &&
        <li className={`nav-item ${activeClass(pageId, 'account')}`}>
          <Link className="nav-link" to={`/customers/${customerId}/account/profile${periodId ? '?periodId=' + periodId : ''}`}>
            <span className="nav-link-title">Account</span>
          </Link>
        </li>
      }
      <li className={`nav-item dropdown ${activeClass(pageId, 'tree')}`}>
        <a className="nav-link dropdown-toggle" href="#trees" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false" >
          <span className="nav-link-title">Trees</span>
        </a>
        <div className="dropdown-menu">
          {data?.trees && data?.trees.map((tree) => {
            return <a key={tree.id} className="dropdown-item" href={`/customers/${customerId}/tree/${tree.id}${periodId ? '?periodId=' + periodId : ''}`} >
              {tree.name} Tree
            </a>
          })}
        </div>
      </li>
    </ul>


  </>
}

function activeClass(current, pageId) {
  if (current == pageId) return 'active';
  return '';
}


export default CustomerNav;

CustomerNav.propTypes = {
  customerId: PropTypes.string.isRequired,
  pageId: PropTypes.string.isRequired,
  onSearch: PropTypes.func
}