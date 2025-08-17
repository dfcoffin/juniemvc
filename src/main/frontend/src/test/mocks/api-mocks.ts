import {vi} from 'vitest';
import {Beer, BeerDto, BeerPage, BeerStyle} from '../../types/beer';
import {Customer, CustomerPage} from '../../types/customer';
import {BeerOrderDto, BeerOrderPage, BeerOrderStatus} from '../../types/beerOrder';

// Mock beer data
export const mockBeers: Beer[] = [
  {
    id: '1',
    version: 1,
    beerName: 'Galaxy Cat',
    beerStyle: BeerStyle.PALE_ALE,
    upc: '123456789012',
    price: 12.99,
    quantityOnHand: 200,
    createdDate: '2023-01-01T12:00:00Z',
    updatedDate: '2023-01-01T12:00:00Z'
  },
  {
    id: '2',
    version: 1,
    beerName: 'Pinball Porter',
    beerStyle: BeerStyle.PORTER,
    upc: '234567890123',
    price: 11.99,
    quantityOnHand: 150,
    createdDate: '2023-02-01T12:00:00Z',
    updatedDate: '2023-02-01T12:00:00Z'
  },
];

// Mock beer page response
export const mockBeerPage: BeerPage = {
  content: mockBeers,
  pageable: {
    pageNumber: 0,
    pageSize: 25,
    sort: {
      empty: false,
      sorted: true,
      unsorted: false
    }
  },
  totalPages: 1,
  totalElements: 2,
  last: true,
  size: 25,
  number: 0,
  sort: {
    empty: false,
    sorted: true,
    unsorted: false
  },
  numberOfElements: 2,
  first: true,
  empty: false
};

// Mock customer data
export const mockCustomers: Customer[] = [
  {
    id: 1,
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    createdDate: '2023-01-01T12:00:00Z',
    updatedDate: '2023-01-01T12:00:00Z'
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    createdDate: '2023-02-01T12:00:00Z',
    updatedDate: '2023-02-01T12:00:00Z'
  }
];

// Mock customer page response
export const mockCustomerPage: CustomerPage = {
  content: mockCustomers,
  pageable: {
    pageNumber: 0,
    pageSize: 25,
    sort: {
      empty: false,
      sorted: true,
      unsorted: false
    }
  },
  totalPages: 1,
  totalElements: 2,
  last: true,
  size: 25,
  number: 0,
  sort: {
    empty: false,
    sorted: true,
    unsorted: false
  },
  numberOfElements: 2,
  first: true,
  empty: false
};

// Mock beer order data
export const mockBeerOrders: BeerOrderDto[] = [
  {
    id: 1,
    version: 1,
    createdDate: '2023-01-01T12:00:00Z',
    updateDate: '2023-01-01T12:00:00Z',
    customerRef: 'John Doe',
    paymentAmount: 24.98,
    status: BeerOrderStatus.NEW,
    beerOrderLines: [
      {
        id: 1,
        beerId: 1,
        beerName: 'Galaxy Cat',
        beerStyle: BeerStyle.PALE_ALE,
        upc: '123456789012',
        orderQuantity: 2,
        quantityAllocated: 0
      }
    ]
  },
  {
    id: 2,
    version: 1,
    createdDate: '2023-02-01T12:00:00Z',
    updateDate: '2023-02-01T12:00:00Z',
    customerRef: 'Jane Smith',
    paymentAmount: 35.97,
    status: BeerOrderStatus.PAID,
    beerOrderLines: [
      {
        id: 2,
        beerId: 2,
        beerName: 'Pinball Porter',
        beerStyle: BeerStyle.PORTER,
        upc: '234567890123',
        orderQuantity: 3,
        quantityAllocated: 3
      }
    ],
    shipments: [
      {
        id: 1,
        shipmentDate: '2023-02-02T12:00:00Z',
        carrier: 'FedEx',
        trackingNumber: 'FDX123456789'
      }
    ]
  }
];

// Mock beer order page response
export const mockBeerOrderPage: BeerOrderPage = {
  content: mockBeerOrders,
  pageable: {
    pageNumber: 0,
    pageSize: 25,
    sort: {
      empty: false,
      sorted: true,
      unsorted: false
    }
  },
  totalPages: 1,
  totalElements: 2,
  last: true,
  size: 25,
  number: 0,
  sort: {
    empty: false,
    sorted: true,
    unsorted: false
  },
  numberOfElements: 2,
  first: true,
  empty: false
};

// Mock Beer Service
export const mockBeerService = {
  getBeers: vi.fn().mockResolvedValue(mockBeerPage),
  getBeerById: vi.fn().mockImplementation((id: string) => {
    const beer = mockBeers.find(b => b.id === id);
    if (beer) {
      return Promise.resolve(beer);
    }
    return Promise.reject(new Error('Beer not found'));
  }),
  createBeer: vi.fn().mockImplementation((beerDto: BeerDto) => {
    const newBeer: Beer = {
      ...beerDto,
      id: '3',
      version: 1,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    return Promise.resolve(newBeer);
  }),
  updateBeer: vi.fn().mockImplementation((id: string, beerDto: BeerDto) => {
    const updatedBeer: Beer = {
      ...beerDto,
      id,
      version: 2,
      updatedDate: new Date().toISOString()
    };
    return Promise.resolve(updatedBeer);
  }),
  patchBeer: vi.fn().mockImplementation((id: string, beerPatchDto: Partial<BeerDto>) => {
    const beer = mockBeers.find(b => b.id === id);
    if (!beer) {
      return Promise.reject(new Error('Beer not found'));
    }
    const updatedBeer: Beer = {
      ...beer,
      ...beerPatchDto,
      version: (beer.version || 0) + 1,
      updatedDate: new Date().toISOString()
    };
    return Promise.resolve(updatedBeer);
  }),
  deleteBeer: vi.fn().mockResolvedValue(undefined),
  uploadBeerImage: vi.fn().mockImplementation((id: string, file: File) => {
    const beer = mockBeers.find(b => b.id === id);
    if (!beer) {
      return Promise.reject(new Error('Beer not found'));
    }
    const updatedBeer: Beer = {
      ...beer,
      imageUrl: 'https://example.com/images/beer.jpg',
      version: (beer.version || 0) + 1,
      updatedDate: new Date().toISOString()
    };
    return Promise.resolve(updatedBeer);
  })
};

// Mock Customer Service
export const mockCustomerService = {
  getCustomers: vi.fn().mockResolvedValue(mockCustomerPage),
  getCustomerById: vi.fn().mockImplementation((id: number) => {
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
      return Promise.resolve(customer);
    }
    return Promise.reject(new Error('Customer not found'));
  }),
  createCustomer: vi.fn().mockImplementation((customerDto: Partial<Customer>) => {
    const newCustomer: Customer = {
      ...customerDto,
      id: 3,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    } as Customer;
    return Promise.resolve(newCustomer);
  }),
  updateCustomer: vi.fn().mockImplementation((id: number, customerDto: Partial<Customer>) => {
    const updatedCustomer: Customer = {
      ...customerDto,
      id,
      version: 2,
      updatedDate: new Date().toISOString()
    } as Customer;
    return Promise.resolve(updatedCustomer);
  }),
  deleteCustomer: vi.fn().mockResolvedValue(undefined)
};

// Mock Beer Order Service
export const mockBeerOrderService = {
  getBeerOrders: vi.fn().mockResolvedValue(mockBeerOrderPage),
  getBeerOrderById: vi.fn().mockImplementation((id: number) => {
    const order = mockBeerOrders.find(o => o.id === id);
    if (order) {
      return Promise.resolve(order);
    }
    return Promise.reject(new Error('Order not found'));
  }),
  createBeerOrder: vi.fn().mockImplementation((orderDto: BeerOrderDto) => {
    const newOrder: BeerOrderDto = {
      ...orderDto,
      id: 3,
      version: 1,
      createdDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      status: BeerOrderStatus.NEW
    };
    return Promise.resolve(newOrder);
  }),
  updateBeerOrder: vi.fn().mockImplementation((id: number, orderDto: BeerOrderDto) => {
    const updatedOrder: BeerOrderDto = {
      ...orderDto,
      id,
      version: (orderDto.version || 0) + 1,
      updateDate: new Date().toISOString()
    };
    return Promise.resolve(updatedOrder);
  }),
  updateBeerOrderStatus: vi.fn().mockImplementation((id: number, status: BeerOrderStatus) => {
    const order = mockBeerOrders.find(o => o.id === id);
    if (!order) {
      return Promise.reject(new Error('Order not found'));
    }
    const updatedOrder: BeerOrderDto = {
      ...order,
      status,
      version: (order.version || 0) + 1,
      updateDate: new Date().toISOString()
    };
    return Promise.resolve(updatedOrder);
  }),
  deleteBeerOrder: vi.fn().mockResolvedValue(undefined),
  createBeerOrderShipment: vi.fn().mockImplementation((orderId: number, shipmentData: any) => {
    const order = mockBeerOrders.find(o => o.id === orderId);
    if (!order) {
      return Promise.reject(new Error('Order not found'));
    }
    const shipment = {
      id: 2,
      ...shipmentData,
      createdDate: new Date().toISOString(),
      updateDate: new Date().toISOString()
    };
    const updatedOrder: BeerOrderDto = {
      ...order,
      status: BeerOrderStatus.COMPLETE,
      shipments: [...(order.shipments || []), shipment],
      version: (order.version || 0) + 1,
      updateDate: new Date().toISOString()
    };
    return Promise.resolve(updatedOrder);
  }),
  allocateBeerOrder: vi.fn().mockImplementation((orderId: number) => {
    const order = mockBeerOrders.find(o => o.id === orderId);
    if (!order) {
      return Promise.reject(new Error('Order not found'));
    }
    const updatedLines = order.beerOrderLines.map(line => ({
      ...line,
      quantityAllocated: line.orderQuantity
    }));
    const updatedOrder: BeerOrderDto = {
      ...order,
      beerOrderLines: updatedLines,
      status: BeerOrderStatus.INPROCESS,
      version: (order.version || 0) + 1,
      updateDate: new Date().toISOString()
    };
    return Promise.resolve(updatedOrder);
  }),
  deallocateBeerOrder: vi.fn().mockImplementation((orderId: number) => {
    const order = mockBeerOrders.find(o => o.id === orderId);
    if (!order) {
      return Promise.reject(new Error('Order not found'));
    }
    const updatedLines = order.beerOrderLines.map(line => ({
      ...line,
      quantityAllocated: 0
    }));
    const updatedOrder: BeerOrderDto = {
      ...order,
      beerOrderLines: updatedLines,
      status: BeerOrderStatus.NEW,
      version: (order.version || 0) + 1,
      updateDate: new Date().toISOString()
    };
    return Promise.resolve(updatedOrder);
  })
};