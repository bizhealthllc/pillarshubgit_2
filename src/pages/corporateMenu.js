import React from 'react';
import { Link, useLocation } from "react-router-dom";

const CorporateMenu = () => {
  const location = useLocation();

  const icons = true;
  //const toolsExpanded = location.pathname == '/tools/adjustments' || location.pathname == '/schedule' || location.pathname == '/media';
  const customersExpanded = location.pathname.startsWith('/customers');
  //const inventoryExpanded = location.pathname.startsWith('/inventory/');
  //const commissionsExpanded = location.pathname.startsWith('/commissions/');

  return (<>
    <ul className="navbar-nav">
      {/* <li className="nav-item">
        <Link className="nav-link" to="/">
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><polyline points="5 12 3 12 12 3 21 12 19 12"></polyline><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path></svg>
          </span>
          <span className="nav-link-title">
            Dashboard
          </span>
        </Link>
      </li> */}
      <li className={`nav-item ${customersExpanded ? 'active' : ''}`}>
        <Link className="nav-link" to="/customers" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="9" cy="7" r="4"></circle><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path><path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path></svg>
          </span>}
          <span className="nav-link-title">
            Customers
          </span>
        </Link>
      </li>
      <li className={`nav-item ${location.pathname == '/reports' ? 'active' : ''}`}>
        <Link className="nav-link" to="/reports" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chart-bar" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path><path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path><path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path><path d="M4 20l14 0"></path></svg>
          </span>}
          <span className="nav-link-title">
            Reports
          </span>
        </Link>
      </li>

      <li className="sidebar-header">Commissions</li>
      {/* <li className="nav-item">
        <a href="#commissions-menu" className="nav-link" data-bs-toggle="collapse" aria-expanded={commissionsExpanded}>
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-coin" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="12" r="9"></circle><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"></path><path d="M12 7v10"></path></svg>
          </span>
          <span className="nav-link-title">Commissions</span>
          <span className="nav-link-toggle"></span>
        </a>
        <ul className={`dropdown-menu-column collapse ${commissionsExpanded ? 'show' : ''}`} id="commissions-menu"> */}
      <li className={`nav-item ${location.pathname == '/commissions/periods' ? 'active' : ''}`}>
        <Link className="nav-link" to="/commissions/periods" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-dollar" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 21h-7a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v3" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h12.5" /><path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" /><path d="M19 21v1m0 -8v1" /></svg>
          </span>}
          Commission Periods
        </Link>
      </li>
      <li className={`nav-item ${location.pathname == '/commissions/payables' ? 'active' : ''}`}>
        <Link className="nav-link" to="/commissions/payables" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-coin" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="12" r="9"></circle><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"></path><path d="M12 7v10"></path></svg>
          </span>}
          Payables
        </Link>
      </li>
      <li className={`nav-item ${location.pathname == '/commissions/paid' ? 'active' : ''}`}>
        <Link className="nav-link" to="/commissions/paid" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-wallet" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" /><path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" /></svg>
          </span>}
          Paid
        </Link>
      </li>
      {/*  </ul>
      </li> */}



      <li className="sidebar-header">Inventory</li>
      {/* <li className="nav-item">
        <a href="#reports-menu" className="nav-link" data-bs-toggle="collapse" aria-expanded={inventoryExpanded}>
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-package" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline><line x1="12" y1="12" x2="20" y2="7.5"></line><line x1="12" y1="12" x2="12" y2="21"></line><line x1="12" y1="12" x2="4" y2="7.5"></line><line x1="16" y1="5.25" x2="8" y2="9.75"></line></svg>
          </span>
          <span className="nav-link-title">Inventory</span>
          <span className="nav-link-toggle"></span>
        </a>
        <ul className={`dropdown-menu-column collapse ${inventoryExpanded ? 'show' : ''}`} id="reports-menu"> */}
      <li className={`nav-item ${location.pathname == '/inventory/products' ? 'active' : ''}`}>
        <Link className="nav-link" to="/inventory/products" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-qrcode" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M7 17l0 .01" /><path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M7 7l0 .01" /><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M17 7l0 .01" /><path d="M14 14l3 0" /><path d="M20 14l0 .01" /><path d="M14 14l0 3" /><path d="M14 20l3 0" /><path d="M17 17l3 0" /><path d="M20 17l0 3" /></svg>
          </span>}
          Products
        </Link>
      </li>
      {/* <div className="dropdown-divider"></div> */}
      <li className={`nav-item ${location.pathname == '/inventory/categories' ? 'active' : ''}`}>
        <Link className="nav-link" to="/inventory/categories" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-tag" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z" /></svg>
          </span>}
          Categories
        </Link>
      </li>
      <li className={`nav-item ${location.pathname == '/inventory/stores' ? 'active' : ''}`}>
        <Link className="nav-link" to="/inventory/stores" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-building-store" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 21l18 0" /><path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" /><path d="M5 21l0 -10.15" /><path d="M19 21l0 -10.15" /><path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" /></svg>
          </span>}
          Stores
        </Link>
      </li>

      {/* <a className="dropdown-item" href="/Inventory/Stock" >
                        Stock Levels
                    </a>
                    <a className="dropdown-item" href="/Inventory/Shipping" >
                        Shipping
                    </a>
                    <a className="dropdown-item" href="/Inventory/RMA" >
                        RMA
                    </a>
                    <a className="dropdown-item" href="/Inventory/Receiving" >
                        Receiving
                    </a> */}
      {/*<a className="dropdown-item" href="/Inventory/Warehouses" >
                        Warehouses
                    </a>*/}
      {/*<a className="dropdown-item" href="/Inventory/Transfers" >
                        Transfers
                    </a>
                    <a className="dropdown-item" href="/Inventory/PurchaseOrders" >
                        Purchase Orders
                    </a>
                    <a className="dropdown-item" href="/Inventory/Vendors" >
                        Vendors
                    </a>*/}
      {/*  </ul>
      </li>
 */}



      <li className="sidebar-header">Tools</li>
      {/*  <li className="nav-item">
        <a href="#tools-menu" className="nav-link" data-bs-toggle="collapse" aria-expanded={toolsExpanded}>
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-tools" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4"></path><line x1="14.5" y1="5.5" x2="18.5" y2="9.5"></line><polyline points="12 8 7 3 3 7 8 12"></polyline><line x1="7" y1="8" x2="5.5" y2="9.5"></line><polyline points="16 12 21 17 17 21 12 16"></polyline><line x1="16" y1="17" x2="14.5" y2="18.5"></line></svg>
          </span>
          <span className="nav-link-title">Tools</span>
          <span className="nav-link-toggle"></span>
        </a>
        <ul className={`dropdown-menu-column collapse ${toolsExpanded ? 'show' : ''}`} id="tools-menu"> */}
      <li className={`nav-item ${location.pathname == '/tools/adjustments' ? 'active' : ''}`}>
        <Link className="nav-link" to="/tools/adjustments" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-playlist-add" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 8h-14" /><path d="M5 12h9" /><path d="M11 16h-6" /><path d="M15 16h6" /><path d="M18 13v6" /></svg>
          </span>}
          Adjustments
        </Link>
      </li>
      <li className={`nav-item ${location.pathname == '/schedule' ? 'active' : ''}`}>
        <Link className="nav-link" to="/schedule" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M11 15h1" /><path d="M12 15v3" /></svg>
          </span>}
          Calendar
        </Link>
      </li>
      <li className={`nav-item ${location.pathname == '/media' ? 'active' : ''}`}>
        <Link className="nav-link" to="/media" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-library-photo" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" /><path d="M17 7h.01" /><path d="M7 13l3.644 -3.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" /><path d="M15 12l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l2.644 2.644" /></svg>
          </span>}
          Documents &amp; Media
        </Link>
      </li>
      {/*  </ul>
      </li>
 */}

      <li className={`nav-item ${location.pathname == '/settings/company' ? 'active' : ''}`}>
        <Link className="nav-link" to="/settings/company" >
          {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-adjustments-horizontal" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 6l8 0" /><path d="M16 6l4 0" /><path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 12l2 0" /><path d="M10 12l10 0" /><path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 18l11 0" /><path d="M19 18l1 0" /></svg>
          </span>}
          <span className="nav-link-title">
            Settings
          </span>
        </Link>
      </li>

    </ul>
  </>
  )
};

export default CorporateMenu;