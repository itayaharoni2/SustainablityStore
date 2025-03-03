import AuthLayout from "@/routes/_auth/auth-layout";
import SignInPage from "@/routes/_auth/sign-in/page";
import SignUpPage from "@/routes/_auth/sign-up/page";
import MainLayout from "@/routes/_main/main-layout";
import SettingsPage from "@/routes/_main/settings/page";
import CartPage from "@/routes/_root/_protected/cart/page";
import ProtectedLayout from "@/routes/_root/_protected/protected-layout";
import ThankyouPage from "@/routes/_root/_protected/thank-you/page";
import AboutPage from "@/routes/_root/about/page";
import ContactPage from "@/routes/_root/contact/page";
import HomePage from "@/routes/_root/home/page";
import LearnMorePage from "@/routes/_root/learn-more/page";
import ProductIdPage from "@/routes/_root/productId/page";
import RootLayout from "@/routes/_root/root-layout";
import ShopPage from "@/routes/_root/shop/page";
import { Route, Routes } from "react-router-dom";
import UserActivities from "./routes/_admin/activities/page";
import AdminLayout from "./routes/_admin/admin-layout";
import AddProduct from "./routes/_admin/product/add/page";
import EditProduct from "./routes/_admin/product/edit/page";
import ManageProductPage from "./routes/_admin/products/page";
import SearchResults from "./routes/_root/search/page";
import CarbonFootprintCalculatorPage from "./routes/_root/CarbonFootprintCalculator/page";
import WaterUsageCalculatorPage from "./routes/_root/WaterUsageCalculator/page";
import CurrentUserActivitiesPage from "./routes/_main/activities/page";
import OrdersPage from "./routes/_main/order/page";
import TestimonialsPage from "./routes/_root/testimonials/page";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />

        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductIdPage />} />
        <Route path="/search" element={<SearchResults />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/carbon-footprint-calculator"
            element={<CarbonFootprintCalculatorPage />}
          />
          <Route
            path="/water-usage-calculator"
            element={<WaterUsageCalculatorPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/thank-you" element={<ThankyouPage />} />
        </Route>
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/activities" element={<CurrentUserActivitiesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<ManageProductPage />} />
        <Route path="/admin/product/add" element={<AddProduct />} />
        <Route path="/admin/product/edit/:id" element={<EditProduct />} />
        <Route path="/admin/user/activities" element={<UserActivities />} />
      </Route>
    </Routes>
  );
}

export default App;
