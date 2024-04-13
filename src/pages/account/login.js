import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Get } from '../../hooks/useFetch'
import useSubdomain from "../../hooks/useSubdomain";
import { useTheme } from '../../hooks/useTheme';
import DataLoading from '../../components/dataLoading';

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const { subdomain } = useSubdomain();
  const { theme, loading, error } = useTheme({ subdomain: subdomain });

  if (loading) return <DataLoading title="Loading Theme" />;
  if (error) return `Error! ${error}`;

  const handleSubmit = async e => {
    e.preventDefault();

    var errorElement = document.getElementById("loginError");
    errorElement.innerHTML = '';

    const envQueryString = (theme?.environmentId) ? '&environmentId=' + theme?.environmentId : '';

    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    const url = `/Authentication?username=${encodedUsername}&password=${encodedPassword}${envQueryString}`;

    Get(url, (response) => {
      setToken(response);
    }, (text, error) => {
      if (error == 401) {
        errorElement.innerHTML = 'Incorrect username or password';
      } else {
        errorElement.innerHTML = text;
      }
    })
  }

  if (theme?.favicon?.url) {
    const favicon = document.querySelector('link[rel="icon"]');

    if (favicon) {
      favicon.href = theme?.favicon?.url;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = theme?.favicon?.url;
      document.head.appendChild(newFavicon);
    }
  }

  return <>
    <div className="page-wrapper page-center" style={{ background: theme?.loginColor ?? '#f1f5f9', position: 'relative' }}>
      <div className="container container-tight py-4">
        <div className="card card-md box-shadow">
          <div className="card-body">
            <div className="text-center mb-4 d-print-none text-white">
              <img src={theme?.loginLogo?.url ?? `/images/logo-dark.png`} alt="Pillars" style={{ maxWidth: '300px', maxHeight: '165px' }} />
            </div>
            <h2 className="h2 text-center mb-4">Log into your account</h2>
            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" placeholder="Email" autoComplete="off" onChange={e => setUserName(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">
                  Password
                </label>
                <input type="password" className="form-control" placeholder="Password" autoComplete="off" onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-check">
                  <span className="form-label-description">
                    <a href="/account/forgotPassword">Forgot password</a>
                  </span>
                </label>
              </div>
              <span id="loginError" className="text-danger"></span>
              <div className="form-footer">
                <button type="submit" className="btn btn-primary w-100">Sign in</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <footer className="footer footer-transparent d-print-none">
      <div className="container-xl">
        <div className="row text-center align-items-center flex-row-reverse">
          <div className="col-lg-auto ms-lg-auto">
            <ul className="list-inline list-inline-dots mb-0">
              <li className="list-inline-item"><a href="https://pillars-hub.readme.io" className="link-secondary" target="blank">Documentation</a></li>
              <li className="list-inline-item"><a href="https://docs.commissionsportal.com/en/privacy-statement" className="link-secondary" target="blank">Privacy Statement</a></li>
              <li className="list-inline-item"><a href="https://github.com/commissionsportal/PillarsUI" className="link-secondary" target="blank">Source code</a></li>
            </ul>
          </div>
          <div className="col-12 col-lg-auto mt-3 mt-lg-0">
            <ul className="list-inline list-inline-dots mb-0">
              <li className="list-inline-item">
                © Copyright 2023. All Rights Reserved.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </>
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}