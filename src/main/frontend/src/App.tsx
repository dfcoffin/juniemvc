import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ToastProvider, useInitializeToast} from "./components/ui/dialog";
import MainLayout from "./components/layout/MainLayout";
import BeerListPage from "./pages/beers/BeerListPage";
import BeerDetailPage from "./pages/beers/BeerDetailPage";
import BeerFormPage from "./pages/beers/BeerFormPage";
import CustomerListPage from "./pages/customers/CustomerListPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import CustomerFormPage from "./pages/customers/CustomerFormPage";
import OrderListPage from "./pages/orders/OrderListPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import OrderFormPage from "./pages/orders/OrderFormPage";
import OrderUpdatePage from "./pages/orders/OrderUpdatePage";
import {ErrorBoundary, ErrorPage} from "./components/errors";

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <div className="p-4">Dashboard Coming Soon</div>,
      },
      {
        path: "/beers",
        element: <BeerListPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/beers/new",
        element: <BeerFormPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/beers/:id",
        element: <BeerDetailPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/customers",
        element: <CustomerListPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/customers/new",
        element: <CustomerFormPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/customers/:id",
        element: <CustomerDetailPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/orders",
        element: <OrderListPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/orders/:id",
        element: <OrderDetailPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/orders/new",
        element: <OrderFormPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/orders/:id/edit",
        element: <OrderUpdatePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/inventory",
        element: <div className="p-4">Inventory Coming Soon</div>,
      },
      {
        path: "/settings",
        element: <div className="p-4">Settings Coming Soon</div>,
      },
      {
        path: "*",
        element: <div className="p-4">Page Not Found</div>,
      },
    ],
  },
]);

function App() {
  // Initialize toast system with custom hook
  useInitializeToast();

  return (
    <ErrorBoundary>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
