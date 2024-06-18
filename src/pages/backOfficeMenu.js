import React from 'react';
import parse from 'html-react-parser';
import { Link, useLocation } from "react-router-dom";
import { GetScope } from "../features/authentication/hooks/useToken"
import { useFetch } from "../hooks/useFetch";
import DataLoading from '../components/dataLoading';
import DataError from '../components/dataError';

const BackOfficeMenu = () => {
  const location = useLocation();
  const { data, loading, error } = useFetch('/api/v1/Menus');

  if (loading) return <DataLoading />
  if (error) return <DataError error={error} />

  let customerId = GetScope();
  const menu = data?.find(items => items.id == "BO");

  return (<>
    <ul className="navbar-nav">

      {menu?.items && menu.items.map((menu) => {
        let visible = menu.status == 'Enabled' || menu.status == 'Customer';
        var url = menu?.url?.replace('{customerId}', customerId);
        let activeClass = (location.pathname == url) ? 'active' : '';

        if (visible) {
          if (url) {
            return <li key={menu.title} className={`nav-item ${activeClass}`}>
              <Link className="nav-link" to={url} >
                <span className="nav-link-icon d-md-none d-lg-inline-block">
                  {menu.icon && parse(menu.icon)}
                </span>
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
    </ul>
  </>
  )
};

export default BackOfficeMenu;