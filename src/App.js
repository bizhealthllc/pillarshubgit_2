import React from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useToken from './features/authentication/hooks/useToken';
import { TokenProvider } from './features/authentication/hooks/useToken';

import Layout from "./pages/layout";

import Login from './pages/account/login';
import EnvironmentList from './pages/account/environmentList';
import Home from "./pages/home/home";
import Customers from "./pages/customers/customers";
import CustomerDetail from "./pages/customers/customerDetail";
import Users from "./pages/settings/users";
import CustomerTree from "./pages/customers/customerTree";
import Statuses from "./pages/settings/statuses";
import NoPage from "./pages/nopage";
import Company from "./pages/settings/company";
import SalesTax from "./pages/settings/salesTax";
import Currency from "./pages/settings/currency";
import Countries from "./pages/settings/countries";
import Regions from "./pages/settings/regions";
import Payments from "./pages/settings/payments";
import RegionDetail from "./pages/settings/regionDetail";
import Stores from "./pages/inventory/stores";
import Categories from "./pages/inventory/categories";
import Products from "./pages/inventory/products";
import ProductDetail from "./pages/inventory/productDetail";
import ProductData from "./pages/inventory/productData";
import ProductPricing from "./pages/inventory/productPricing";
import ProductImages from "./pages/inventory/productImages";
import ProductVariants from "./pages/inventory/productVariants";
import ProductBom from "./pages/inventory/productBom";
import Periods from "./pages/commissions/periods";
import PeriodDetail from "./pages/commissions/periodDetail";
import NewCustomer from "./pages/customers/newCustomer";
import EditCustomer from "./pages/customers/editCustomer";
import CustomerOrders from "./pages/customers/customerOrders";
import OrderDetail from "./pages/customers/orderDetail";
import NewProduct from "./pages/inventory/newProduct";
import CustomerProfile from "./pages/customers/account/profile"
import Shop from "./pages/customers/shop";
import Checkout from "./pages/customers/checkout";
import Adjustments from "./pages/tools/adjustments";
import CommissionsDetail from "./pages/customers/commissionsDetail";
import Profile from "./pages/account/profile";
import CustomerSecurity from "./pages/customers/account/security";
import CustomerMoneyOut from "./pages/customers/account/moneyOut";
import CustomerMoneyIn from "./pages/customers/account/moneyIn";
import Payables from "./pages/commissions/payables";
import PaymentHistory from "./pages/commissions/paymentHistory";
import VolumeSummary from "./pages/commissions/volumesummary";
import CommissionsBonusDetail from "./pages/customers/commissionsBonusDetail";
import CustomerTreeSettings from "./pages/customers/account/treeSettings";
import ForgotPassword from "./pages/account/forgotPassword";
import ResetPassword from "./pages/account/resetpassword";
import Reports from "./pages/reports/reports";
import Report from "./pages/reports/report";
import MediaList from "./pages/tools/mediaList";
import Schedule from "./pages/tools/schedule";
import Theme from "./pages/settings/theme";
import Navigation from "./pages/settings/navigation";
import DashboardSettings from "./pages/settings/dashboard";
import WidgetSettings from "./pages/settings/widgets";
import EditWidget from "./pages/settings/editWidget";
import Dashboard from "./pages/customers/dashboard";
import PaymentHistoryDetail from "./pages/commissions/paymentHistoryDetail";
import PlacementRules from "./pages/settings/placementRules";
import Training from "./pages/tools/training";
import Course from "./pages/customers/course";
import EditCourse from "./pages/tools/editCourse";

function App() {
  const { token, setToken, clearToken } = useToken();

  if (window.location.pathname == '/account/forgotPassword') { return <ForgotPassword /> }
  if (window.location.pathname == '/account/resetpassword') { return <ResetPassword /> }
  if (window.location.pathname == '/account/environments') { return <EnvironmentList setToken={setToken} clearToken={clearToken} /> }

  if (!token) {
    return <Login setToken={setToken} />
  }

  if (!token.environmentId) {
    return <EnvironmentList setToken={setToken} clearToken={clearToken} />
  }

  return (
    <BrowserRouter>
      <TokenProvider clearToken={clearToken}>
        <Routes>
          <Route path="/" element={<Layout clearToken={clearToken} />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/new" element={<NewCustomer />} />
            <Route path="customers/:customerId/edit" element={<EditCustomer />} />
            <Route path="customers/:customerId/summary" element={<CustomerDetail />} />
            <Route path="customers/:customerId/dashboard" element={<Dashboard />} />
            <Route path="customers/:customerId/orders" element={<CustomerOrders />} />
            <Route path="customers/:customerId/orders/:orderId" element={<OrderDetail />} />
            <Route path="customers/:customerId/shop" element={<Shop />} />
            <Route path="customers/:customerId/checkout" element={<Checkout />} />
            <Route path="customers/:customerId/training" element={<Training />} />
            <Route path="customers/:customerId/training/:courseId" element={<Course />} />
            <Route path="customers/:customerId/account/profile" element={<CustomerProfile />} />
            <Route path="customers/:customerId/account/security" element={<CustomerSecurity />} />
            <Route path="customers/:customerId/account/moneyin" element={<CustomerMoneyIn />} />
            <Route path="customers/:customerId/account/moneyout" element={<CustomerMoneyOut />} />
            <Route path="customers/:customerId/account/treesettings" element={<CustomerTreeSettings />} />
            <Route path="customers/:customerId/commissions" element={<CommissionsDetail />} />
            <Route path="customers/:customerId/commissions/:bonusId" element={<CommissionsBonusDetail />} />
            <Route path="customers/:customerId/tree/:treeId" element={<CustomerTree />} />
            <Route path="inventory/stores" element={<Stores />} />
            <Route path="inventory/categories" element={<Categories />} />
            <Route path="inventory/products" element={<Products />} />
            <Route path="inventory/products/new" element={<NewProduct />} />
            <Route path="inventory/products/:productId/general" element={<ProductDetail />} />
            <Route path="inventory/products/:productId/data" element={<ProductData />} />
            <Route path="inventory/products/:productId/pricing" element={<ProductPricing />} />
            <Route path="inventory/products/:productId/variants" element={<ProductVariants />} />
            <Route path="inventory/products/:productId/images" element={<ProductImages />} />
            <Route path="inventory/products/:productId/bom" element={<ProductBom />} />
            <Route path="commissions/periods" element={<Periods />} />
            <Route path="commissions/periods/:periodId/summary" element={<PeriodDetail />} />
            <Route path="commissions/periods/:periodId/volumesummary" element={<VolumeSummary />} />
            <Route path="commissions/payables" element={<Payables />} />
            <Route path="commissions/paid" element={<PaymentHistory />} />
            <Route path="commissions/paid/:batchId" element={<PaymentHistoryDetail />} />
            <Route path="media" element={<MediaList />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="training" element={<Training />} />
            <Route path="training/:courseId" element={<EditCourse />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/:reportId" element={<Report />} />
            <Route path="tools/adjustments" element={<Adjustments />} />
            <Route path="settings/users" element={<Users />} />
            <Route path="settings/theme" element={<Theme />} />
            <Route path="settings/navigation" element={<Navigation />} />
            <Route path="settings/dashboard" element={<DashboardSettings />} />
            <Route path="settings/widgets" element={<WidgetSettings />} />
            <Route path="settings/widgets/:widgetId" element={<EditWidget />} />
            <Route path="settings/payments" element={<Payments />} />
            <Route path="settings/regions" element={<Regions />} />
            <Route path="settings/regions/:regionId" element={<RegionDetail />} />
            <Route path="settings/countries" element={<Countries />} />
            <Route path="settings/currency" element={<Currency />} />
            <Route path="settings/salestax" element={<SalesTax />} />
            <Route path="settings/statuses" element={<Statuses />} />
            <Route path="settings/company" element={<Company />} />
            <Route path="settings/trees" element={<PlacementRules />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </TokenProvider>
    </BrowserRouter>
  );
}

export default App;
