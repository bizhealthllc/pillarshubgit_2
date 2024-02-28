import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { GetScope } from "../features/authentication/hooks/useToken"

var GET_DATA = gql`query{
    trees{
        id
        name
    }
}`;

const BackOfficeMenu = () => {
  const location = useLocation();
  const { data } = useQuery(GET_DATA, {
    variables: {},
  });

  let customerId = GetScope();
  const customersExpanded = location.pathname == '/customers';
  

  return (<>
    <ul className="navbar-nav">
      <li className={`nav-item ${location.pathname == `/customers/${customerId}/dashboard` ? 'active' : ''}`}>
        <Link className="nav-link" to="/" >
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-layout-dashboard" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 4h6v8h-6z"></path><path d="M4 16h6v4h-6z"></path><path d="M14 12h6v8h-6z"></path><path d="M14 4h6v4h-6z"></path></svg>
          </span>
          <span className="nav-link-title">
            Dashboard
          </span>
        </Link>
      </li>

      <li className={`nav-item ${customersExpanded ? 'active' : ''}`}>
        <Link className="nav-link" to="/customers" >
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="9" cy="7" r="4"></circle><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path><path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path></svg>
          </span>
          <span className="nav-link-title">
            Team
          </span>
        </Link>
      </li>

      <li className={`nav-item ${location.pathname == `/customers/${customerId}/orders` ? 'active' : ''}`}>
        <Link className="nav-link" to={`/customers/${customerId}/orders`}>
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-invoice" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path><path d="M9 7l1 0"></path><path d="M9 13l6 0"></path><path d="M13 17l2 0"></path></svg>
          </span>
          <span className="nav-link-title">
            Order History
          </span>
        </Link>
      </li>
      {/* <li className="nav-item">
                <Link className="nav-link" to={`/customers/${customerId}/autoships`}>
                    <span className="nav-link-title">
                        Autoships
                    </span>
                </Link>
            </li> */}

      <li className={`nav-item ${location.pathname == `/customers/${customerId}/commissions` ? 'active' : ''}`}>
        <Link className="nav-link" to={`/customers/${customerId}/commissions`}>
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M16 6m-5 0a5 3 0 1 0 10 0a5 3 0 1 0 -10 0"></path><path d="M11 6v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path><path d="M11 10v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path><path d="M11 14v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path><path d="M7 9h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path><path d="M5 15v1m0 -8v1"></path></svg>
          </span>
          <span className="nav-link-title">
            Earnings
          </span>
        </Link>
      </li>
      {/* <li className="nav-item">
                <Link className="nav-link" to={`/customers/${customerId}/reports`}>
                    <span className="nav-link-title">
                        Reports
                    </span>
                </Link>
            </li> */}

      <li className={`nav-item ${location.pathname == `/media` ? 'active' : ''}`}>
        <Link className="nav-link" to={`/media`}>
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 3v4a1 1 0 0 0 1 1h4"></path><path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z"></path><path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"></path></svg>
          </span>
          <span className="nav-link-title">
            Documents
          </span>
        </Link>
      </li>

      <li className="sidebar-header">Trees</li>
      {data?.trees && data?.trees.map((tree) => {
        return <li key={tree.id} className={`nav-item ${location.pathname == `/customers/${customerId}/tree/${tree.id}` ? 'active' : ''}`}>
          <Link className="nav-link" to={`/customers/${customerId}/tree/${tree.id}`}>
            <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 15m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path><path d="M15 15m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path><path d="M6 15v-1a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v1"></path><path d="M12 9l0 3"></path></svg>
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-binary-tree" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" /><path d="M16 4a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" /><path d="M16 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" /><path d="M11 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" /><path d="M21 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" /><path d="M5.058 18.306l2.88 -4.606" /><path d="M10.061 10.303l2.877 -4.604" /><path d="M10.065 13.705l2.876 4.6" /><path d="M15.063 5.7l2.881 4.61" /></svg> */}
            </span>
            <span className="nav-link-title">
              {tree.name} Tree
            </span>
          </Link>
        </li>
      })}
    </ul>
  </>
  )
};

export default BackOfficeMenu;