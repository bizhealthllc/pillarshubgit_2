import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import parse from 'html-react-parser';
import DataLoading from '../components/dataLoading';
import DataError from '../components/dataError';

const CorporateMenu = () => {
  const location = useLocation();
  const { data, loading, error } = useFetch('/api/v1/Menus');

  if (loading) return <DataLoading />
  if (error) return <DataError error={error} />



  const icons = true;
  //const toolsExpanded = location.pathname == '/tools/adjustments' || location.pathname == '/schedule' || location.pathname == '/media';
  //const inventoryExpanded = location.pathname.startsWith('/inventory/');
  //const commissionsExpanded = location.pathname.startsWith('/commissions/');

  const menu = data?.find(items => items.id == "CO");

  return (<>
    <ul className="navbar-nav">
      {menu?.items && menu.items.map((menu) => {
        let visible = menu.status == 'Enabled' || menu.status == 'Corporate';
        const customersExpanded = location.pathname.startsWith(menu.url);
        let activeClass =  (customersExpanded || location.pathname == menu.url) ? 'active' : '';

        if (visible) {
          if (menu.url) {
            return <li key={menu.title} className={`nav-item ${activeClass}`}>
              <Link className="nav-link" to={menu.url} >
                {icons && <span className="nav-link-icon d-md-none d-lg-inline-block">
                  {menu.icon && parse(menu.icon)}
                </span>}
                <span className="nav-link-title">
                  {menu.title}
                </span>
              </Link>
            </li>
          } else {
            return <li key={menu.title} className="sidebar-header">{menu.title}</li>
          }
        }
      })}

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