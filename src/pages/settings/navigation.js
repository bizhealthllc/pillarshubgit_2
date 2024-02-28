import React from "react-dom/client";
import PageHeader from "../../components/pageHeader";
import SettingsNav from "./settingsNav";

const Navigation = () => {

  const menuItems = [{
    name: "Corporate", links: [
      {
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>,
        name: "Customers",
        url: "/customers"
      },
      {
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>,
        name: "Inventory",
        links: [
          {
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>,
            name: "Products",
            url: "/customers"
          },
          {
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>,
            name: "Categories",
            url: "/customers"
          },
          {
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>,
            name: "Stores",
            url: "/customers"
          }
        ]
      },
      {
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>,
        name: "Commissions",
        links: [
          {
            name: "Commission Periods",
            url: "/commissions/periods"
          },
          {
            name: "Payables",
            url: "/commissions/payables"
          },
          {
            name: "Paid",
            url: "/commissions/paid"
          }
        ]
      },
      {
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>,
        name: "Tools",
        links: [
          {
            name: "Adjustments",
            url: "/commissions/periods"
          },
          {
            name: "Calendar",
            url: "/commissions/payables"
          },
          {
            name: "Documents & Media",
            url: "/commissions/paid"
          }
        ]
      }
    ]
  }, {
    name: "Back Office", links: [
      {
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>,
        name: "Dashboard",
        url: "/"
      },
      {
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>,
        name: "Team",
        url: "/customers"
      }
    ]
  }]

  return <PageHeader title="Settings">
    <SettingsNav title="Navigation" loading={false} pageId="navigation">
      <div className="table-responsive">
        <table className="table table-vcenter table-border table-nowrap card-table">
          <thead>
            <tr>
              <td className="text-center">
              </td>
              <td className="text-center">
              </td>
              <td className="w-1">
              </td>
            </tr>
          </thead>
          <tbody>
            {menuItems && menuItems.map((m) => {
              return <><tr key={m.name} className="bg-light">
                <th colSpan="4" className="subheader">{m.name}</th>
              </tr>
                {m.links && m.links.map((l) => {
                  return <>
                    <tr>
                      <td>{l.svg} {l.name}</td>
                      <td>{l.url}</td>
                      <td>
                        <button className="btn btn-ghost-secondary btn-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>
                        </button>
                        <button className="btn btn-ghost-secondary btn-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>
                        </button>
                      </td>
                    </tr>
                    {l.links && l.links.map((subLink) => {
                      return <tr key={subLink.id}>
                        <td><span className="ms-4" >{subLink.svg} {subLink.name}</span></td>
                        <td>{subLink.url}</td>
                        <td>
                          <button className="btn btn-ghost-secondary btn-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>
                          </button>
                          <button className="btn btn-ghost-secondary btn-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>
                          </button>
                        </td>
                      </tr>
                    })}
                  </>
                })}
              </>
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-end">
                <a href="#" className="btn btn-primary">Add Navigation</a>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </SettingsNav>
  </PageHeader >
}

export default Navigation;