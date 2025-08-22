import {
    type Beer,
    type BeerOrderDto,
    type BeerOrderPage,
    BeerOrderStatus,
    type BeerPage,
    BeerStyle,
    type Customer,
    type CustomerPage
} from "@/types";

// Mock beer data
export const mockBeers: Beer[] = [
  {
    id: "1",
    version: 1,
    beerName: "Galaxy Cat",
    beerStyle: BeerStyle.PALE_ALE,
    upc: "123456789012",
    price: 12.99,
    quantityOnHand: 200,
    createdDate: "2023-01-01T12:00:00Z",
    updatedDate: "2023-01-01T12:00:00Z",
  },
  {
    id: "2",
    version: 1,
    beerName: "Pinball Porter",
    beerStyle: BeerStyle.PORTER,
    upc: "234567890123",
    price: 11.99,
    quantityOnHand: 150,
    createdDate: "2023-02-01T12:00:00Z",
    updatedDate: "2023-02-01T12:00:00Z",
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
      unsorted: false,
    },
  },
  totalPages: 1,
  totalElements: 2,
  last: true,
  size: 25,
  number: 0,
  sort: {
    empty: false,
    sorted: true,
    unsorted: false,
  },
  numberOfElements: 2,
  first: true,
  empty: false,
};

// Mock customer data
export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "John Doe",
    customerName: "John Doe",
    email: "john@example.com",
    phoneNumber: "123-456-7890",
    addressLine1: "123 Main St",
    city: "Boston",
    state: "MA",
    postalCode: "02108",
    createdDate: "2023-01-01T12:00:00Z",
    updateDate: "2023-01-01T12:00:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    customerName: "Jane Smith",
    email: "jane@example.com",
    phoneNumber: "987-654-3210",
    addressLine1: "456 Elm St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    createdDate: "2023-02-01T12:00:00Z",
    updateDate: "2023-02-01T12:00:00Z",
  },
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
      unsorted: false,
    },
  },
  totalPages: 1,
  totalElements: 2,
  last: true,
  size: 25,
  number: 0,
  sort: {
    empty: false,
    sorted: true,
    unsorted: false,
  },
  numberOfElements: 2,
  first: true,
  empty: false,
};

// Mock beer order data
export const mockBeerOrders: BeerOrderDto[] = [
  {
    id: 1,
    version: 1,
    createdDate: "2023-01-01T12:00:00Z",
    updateDate: "2023-01-01T12:00:00Z",
    customerRef: "John Doe",
    paymentAmount: 24.98,
    status: BeerOrderStatus.NEW,
    beerOrderLines: [
      {
        id: 1,
        beerId: 1,
        beerName: "Galaxy Cat",
        beerStyle: BeerStyle.PALE_ALE,
        upc: "123456789012",
        orderQuantity: 2,
        quantityAllocated: 0,
      },
    ],
  },
  {
    id: 2,
    version: 1,
    createdDate: "2023-02-01T12:00:00Z",
    updateDate: "2023-02-01T12:00:00Z",
    customerRef: "Jane Smith",
    paymentAmount: 35.97,
    status: BeerOrderStatus.PAID,
    beerOrderLines: [
      {
        id: 2,
        beerId: 2,
        beerName: "Pinball Porter",
        beerStyle: BeerStyle.PORTER,
        upc: "234567890123",
        orderQuantity: 3,
        quantityAllocated: 3,
      },
    ],
    shipments: [
      {
        id: 1,
        shipmentDate: "2023-02-02T12:00:00Z",
        carrier: "FedEx",
        trackingNumber: "FDX123456789",
      },
    ],
  },
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
      unsorted: false,
    },
  },
  totalPages: 1,
  totalElements: 2,
  last: true,
  size: 25,
  number: 0,
  sort: {
    empty: false,
    sorted: true,
    unsorted: false,
  },
  numberOfElements: 2,
  first: true,
  empty: false,
};

// Note: The mock service objects (mockBeerService, mockCustomerService, mockBeerOrderService)
// were previously defined here but have been removed as they were not being used in any tests.
// The tests are directly mocking the apiService instead of using these service mocks.
// Only the mock data is being used.
