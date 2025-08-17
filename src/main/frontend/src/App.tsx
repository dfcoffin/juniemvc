import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {ToastProvider} from './components/ui/dialog';
import MainLayout from './components/layout/MainLayout';
import BeerListPage from './pages/beers/BeerListPage';
import BeerDetailPage from './pages/beers/BeerDetailPage';
import BeerFormPage from './pages/beers/BeerFormPage';
import CustomerListPage from './pages/customers/CustomerListPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';
import CustomerFormPage from './pages/customers/CustomerFormPage';
import OrderListPage from './pages/orders/OrderListPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import OrderFormPage from './pages/orders/OrderFormPage';
import OrderUpdatePage from './pages/orders/OrderUpdatePage';

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <div className="p-4">Dashboard Coming Soon</div>
      },
      {
        path: '/beers',
        element: <BeerListPage />
      },
      {
        path: '/beers/new',
        element: <BeerFormPage />
      },
      {
        path: '/beers/:id',
        element: <BeerDetailPage />
      },
      {
        path: '/customers',
        element: <CustomerListPage />
      },
      {
        path: '/customers/new',
        element: <CustomerFormPage />
      },
      {
        path: '/customers/:id',
        element: <CustomerDetailPage />
      },
      {
        path: '/orders',
        element: <OrderListPage />
      },
      {
        path: '/orders/:id',
        element: <OrderDetailPage />
      },
      {
        path: '/orders/new',
        element: <OrderFormPage />
      },
      {
        path: '/orders/:id/edit',
        element: <OrderUpdatePage />
      },
      {
        path: '/inventory',
        element: <div className="p-4">Inventory Coming Soon</div>
      },
      {
        path: '/settings',
        element: <div className="p-4">Settings Coming Soon</div>
      },
      {
        path: '*',
        element: <div className="p-4">Page Not Found</div>
      }
    ]
  }
]);

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App
