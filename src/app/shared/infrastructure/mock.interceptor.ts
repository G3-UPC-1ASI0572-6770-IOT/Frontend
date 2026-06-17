import {HttpEvent, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';

const NOW = () => new Date().toISOString();
const DAYS_AGO = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
const HOURS_AGO = (n: number) => new Date(Date.now() - n * 3600000).toISOString();
const MINS_AGO = (n: number) => new Date(Date.now() - n * 60000).toISOString();

const MOCK_LOT = {
  id: 1, name: 'ParkingNow San Isidro', address: 'Av. Javier Prado Este 456',
  city: 'Lima', capacity: 20, totalSpaces: 20, freeSpaces: 13, occupiedSpaces: 7,
  occupied: 7, hourlyRate: 3.5, lotType: 'COVERED', ownerId: 1,
  latitude: -12.0894, longitude: -77.0339, nodeId: 'NODE-001', nodeOnline: true,
  iotNodes: 4, rating: 4.7, status: 'available', createdAt: DAYS_AGO(30)
};

const MOCK_SPACES = [
  {id: 1, label: 'E1', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(3)},
  {id: 2, label: 'E2', status: 'OCCUPIED', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(45)},
  {id: 3, label: 'E3', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(2)},
  {id: 4, label: 'E4', status: 'RESERVED', source: 'MANUAL', lotId: 1, lastUpdated: MINS_AGO(10)},
  {id: 5, label: 'E5', status: 'OCCUPIED', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(67)},
  {id: 6, label: 'E6', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(1)},
  {id: 7, label: 'E7', status: 'OCCUPIED', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(20)},
  {id: 8, label: 'E8', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(5)},
  {id: 9, label: 'E9', status: 'FREE', source: 'MANUAL', lotId: 1, lastUpdated: MINS_AGO(8)},
  {id: 10, label: 'E10', status: 'OCCUPIED', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(90)},
  {id: 11, label: 'E11', status: 'OCCUPIED', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(35)},
  {id: 12, label: 'E12', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(4)},
  {id: 13, label: 'E13', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(6)},
  {id: 14, label: 'E14', status: 'OCCUPIED', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(55)},
  {id: 15, label: 'E15', status: 'FREE', source: 'MANUAL', lotId: 1, lastUpdated: MINS_AGO(12)},
  {id: 16, label: 'E16', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(7)},
  {id: 17, label: 'E17', status: 'OCCUPIED', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(40)},
  {id: 18, label: 'E18', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(2)},
  {id: 19, label: 'E19', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(9)},
  {id: 20, label: 'E20', status: 'FREE', source: 'SENSOR', lotId: 1, lastUpdated: MINS_AGO(1)},
];

const MOCK_RESERVATIONS = [
  {id: 1, spaceId: 2, spaceLabel: 'E2', lotId: 1, parkingLotName: 'ParkingNow San Isidro', driverId: 10, driverEmail: 'carlos.rios@gmail.com', status: 'ACTIVE', createdAt: HOURS_AGO(1), expiresAt: new Date(Date.now() + 3600000).toISOString(), consumedAt: null, cancelledAt: null},
  {id: 2, spaceId: 5, spaceLabel: 'E5', lotId: 1, parkingLotName: 'ParkingNow San Isidro', driverId: 11, driverEmail: 'lucia.vargas@gmail.com', status: 'ACTIVE', createdAt: HOURS_AGO(2), expiresAt: new Date(Date.now() + 1800000).toISOString(), consumedAt: null, cancelledAt: null},
  {id: 3, spaceId: 4, spaceLabel: 'E4', lotId: 1, parkingLotName: 'ParkingNow San Isidro', driverId: 12, driverEmail: 'mario.fernandez@gmail.com', status: 'RESERVED', createdAt: MINS_AGO(30), expiresAt: new Date(Date.now() + 5400000).toISOString(), consumedAt: null, cancelledAt: null},
  {id: 4, spaceId: 7, spaceLabel: 'E7', lotId: 1, parkingLotName: 'ParkingNow San Isidro', driverId: 13, driverEmail: 'ana.gutierrez@gmail.com', status: 'CONSUMED', createdAt: DAYS_AGO(1), expiresAt: HOURS_AGO(20), consumedAt: HOURS_AGO(22), cancelledAt: null},
  {id: 5, spaceId: 10, spaceLabel: 'E10', lotId: 1, parkingLotName: 'ParkingNow San Isidro', driverId: 14, driverEmail: 'pedro.leon@gmail.com', status: 'CONSUMED', createdAt: DAYS_AGO(2), expiresAt: DAYS_AGO(1), consumedAt: DAYS_AGO(1), cancelledAt: null},
  {id: 6, spaceId: 6, spaceLabel: 'E6', lotId: 1, parkingLotName: 'ParkingNow San Isidro', driverId: 15, driverEmail: 'sofia.mendez@gmail.com', status: 'CANCELLED', createdAt: DAYS_AGO(3), expiresAt: DAYS_AGO(3), consumedAt: null, cancelledAt: DAYS_AGO(3)},
  {id: 7, spaceId: 11, spaceLabel: 'E11', lotId: 1, parkingLotName: 'ParkingNow San Isidro', driverId: 16, driverEmail: 'roberto.castillo@gmail.com', status: 'ACTIVE', createdAt: HOURS_AGO(3), expiresAt: new Date(Date.now() + 900000).toISOString(), consumedAt: null, cancelledAt: null},
  {id: 8, spaceId: 14, spaceLabel: 'E14', lotId: 1, parkingLotName: 'ParkingNow San Isidro', driverId: 17, driverEmail: 'diana.torres@gmail.com', status: 'ACTIVE', createdAt: HOURS_AGO(4), expiresAt: new Date(Date.now() + 7200000).toISOString(), consumedAt: null, cancelledAt: null},
];

const MOCK_PAYMENTS = [
  {id: 1, reservationId: 4, amount: 10.50, currency: 'PEN', method: 'CARD', status: 'PAID', paidAt: HOURS_AGO(22), createdAt: DAYS_AGO(1)},
  {id: 2, reservationId: 5, amount: 7.00, currency: 'PEN', method: 'YAPE', status: 'PAID', paidAt: DAYS_AGO(1), createdAt: DAYS_AGO(2)},
  {id: 3, reservationId: 6, amount: 0.00, currency: 'PEN', method: 'CARD', status: 'REFUNDED', paidAt: DAYS_AGO(3), createdAt: DAYS_AGO(3)},
  {id: 4, reservationId: 1, amount: 3.50, currency: 'PEN', method: 'YAPE', status: 'PENDING', paidAt: null, createdAt: HOURS_AGO(1)},
  {id: 5, reservationId: 2, amount: 7.00, currency: 'PEN', method: 'CARD', status: 'PENDING', paidAt: null, createdAt: HOURS_AGO(2)},
  {id: 6, reservationId: 7, amount: 10.50, currency: 'PEN', method: 'PLIN', status: 'PENDING', paidAt: null, createdAt: HOURS_AGO(3)},
  {id: 7, reservationId: 8, amount: 14.00, currency: 'PEN', method: 'CARD', status: 'PENDING', paidAt: null, createdAt: HOURS_AGO(4)},
];

const MOCK_IOT_EVENTS = [
  {id: 1, nodeId: 'NODE-001', parkingSpaceId: 2, spaceCode: 'E2', distanceCm: 18, detectedStatus: 'OCCUPIED', receivedAt: MINS_AGO(3), syncedAt: MINS_AGO(3), syncStatus: 'SYNCED', result: 'OK'},
  {id: 2, nodeId: 'NODE-001', parkingSpaceId: 5, spaceCode: 'E5', distanceCm: 22, detectedStatus: 'OCCUPIED', receivedAt: MINS_AGO(5), syncedAt: MINS_AGO(5), syncStatus: 'SYNCED', result: 'OK'},
  {id: 3, nodeId: 'NODE-002', parkingSpaceId: 7, spaceCode: 'E7', distanceCm: 15, detectedStatus: 'OCCUPIED', receivedAt: MINS_AGO(8), syncedAt: MINS_AGO(8), syncStatus: 'SYNCED', result: 'OK'},
  {id: 4, nodeId: 'NODE-002', parkingSpaceId: 3, spaceCode: 'E3', distanceCm: 145, detectedStatus: 'FREE', receivedAt: MINS_AGO(10), syncedAt: MINS_AGO(10), syncStatus: 'SYNCED', result: 'OK'},
  {id: 5, nodeId: 'NODE-003', parkingSpaceId: 10, spaceCode: 'E10', distanceCm: 20, detectedStatus: 'OCCUPIED', receivedAt: MINS_AGO(12), syncedAt: MINS_AGO(12), syncStatus: 'SYNCED', result: 'OK'},
  {id: 6, nodeId: 'NODE-003', parkingSpaceId: 11, spaceCode: 'E11', distanceCm: 25, detectedStatus: 'OCCUPIED', receivedAt: MINS_AGO(15), syncedAt: MINS_AGO(15), syncStatus: 'SYNCED', result: 'OK'},
  {id: 7, nodeId: 'NODE-004', parkingSpaceId: 14, spaceCode: 'E14', distanceCm: 17, detectedStatus: 'OCCUPIED', receivedAt: MINS_AGO(18), syncedAt: MINS_AGO(18), syncStatus: 'SYNCED', result: 'OK'},
  {id: 8, nodeId: 'NODE-004', parkingSpaceId: 17, spaceCode: 'E17', distanceCm: 19, detectedStatus: 'OCCUPIED', receivedAt: MINS_AGO(20), syncedAt: MINS_AGO(20), syncStatus: 'SYNCED', result: 'OK'},
  {id: 9, nodeId: 'NODE-001', parkingSpaceId: 1, spaceCode: 'E1', distanceCm: 150, detectedStatus: 'FREE', receivedAt: MINS_AGO(22), syncedAt: MINS_AGO(22), syncStatus: 'SYNCED', result: 'OK'},
  {id: 10, nodeId: 'NODE-002', parkingSpaceId: 6, spaceCode: 'E6', distanceCm: 138, detectedStatus: 'FREE', receivedAt: MINS_AGO(25), syncedAt: null, syncStatus: 'PENDING', result: 'PENDING'},
];

const MOCK_IOT_NODES = [
  {id: 1, nodeCode: 'NODE-001', firmware: 'v2.3.1', status: 'ONLINE', lastSeen: MINS_AGO(3), spaceId: 2, lotId: 1},
  {id: 2, nodeCode: 'NODE-002', firmware: 'v2.3.1', status: 'ONLINE', lastSeen: MINS_AGO(8), spaceId: 5, lotId: 1},
  {id: 3, nodeCode: 'NODE-003', firmware: 'v2.2.8', status: 'ONLINE', lastSeen: MINS_AGO(12), spaceId: 10, lotId: 1},
  {id: 4, nodeCode: 'NODE-004', firmware: 'v2.1.0', status: 'OFFLINE', lastSeen: HOURS_AGO(2), spaceId: 14, lotId: 1},
];

const MOCK_DASHBOARD = {
  totalSpaces: 20, freeSpaces: 13, occupiedSpaces: 7, reservedSpaces: 1,
  occupancyRate: 35, todayRevenue: 87.50, activeReservations: 4,
  nodeStatus: 'ONLINE', nodeLastSeen: MINS_AGO(3),
  last7DaysRevenue: [
    {date: '2026-06-06', amount: 42.00},
    {date: '2026-06-07', amount: 63.50},
    {date: '2026-06-08', amount: 35.00},
    {date: '2026-06-09', amount: 91.00},
    {date: '2026-06-10', amount: 78.50},
    {date: '2026-06-11', amount: 55.00},
    {date: '2026-06-12', amount: 87.50},
  ],
  recentIotEvents: MOCK_IOT_EVENTS.slice(0, 5)
};

const MOCK_PROFILE = {
  id: 1, fullName: 'Diego Soto', email: 'admin@parkingnow.com',
  phone: '+51 987 654 321', jobTitle: 'Parking Lot Owner',
  role: 'OWNER', active: true, twoFactorEnabled: false,
  createdAt: DAYS_AGO(30), lastLoginAt: NOW(), parkingLotId: 1
};

function respond(body: unknown): Observable<HttpEvent<unknown>> {
  return of(new HttpResponse<unknown>({status: 200, body}));
}

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  const method = req.method;

  if (url.includes('/auth/sign-in') && method === 'POST') {
    return respond({
      token: 'mock-jwt-token-parkingnow-demo',
      type: 'Bearer',
      userId: 1,
      email: 'admin@parkingnow.com',
      fullName: 'Diego Soto',
      role: 'OWNER',
      parkingLotId: 1
    });
  }

  if (url.includes('/auth/sign-up') && method === 'POST') {
    const signupBody = req.body as Record<string, string> | null;
    return respond({
      token: 'mock-jwt-token-new-user',
      type: 'Bearer',
      userId: 2,
      email: signupBody?.['email'] ?? 'new@parkingnow.com',
      fullName: signupBody?.['fullName'] ?? 'New User',
      role: 'OWNER',
      parkingLotId: 1
    });
  }

  if (url.includes('/dashboard') && method === 'GET') {
    return respond(MOCK_DASHBOARD);
  }

  if (url.match(/\/parking-lots\/\d+\/link-node/) && method === 'POST') {
    const linkBody = req.body as Record<string, string> | null;
    return respond({...MOCK_LOT, nodeId: linkBody?.['nodeId'] ?? 'NODE-001'});
  }

  if (url.match(/\/parking-lots\/\d+/) && method === 'PUT') {
    return respond({...MOCK_LOT, ...(req.body as object)});
  }

  if (url.match(/\/parking-lots\/\d+/) && method === 'GET') {
    return respond(MOCK_LOT);
  }

  if (url.includes('/parking-lots') && method === 'GET') {
    return respond([MOCK_LOT]);
  }

  if (url.match(/\/spaces\/parking-lot\/\d+/) && method === 'GET') {
    return respond(MOCK_SPACES);
  }

  if (url.match(/\/reservations\/\d+\/cancel/) && method === 'PATCH') {
    const id = Number(url.match(/\/reservations\/(\d+)\/cancel/)![1]);
    const r = MOCK_RESERVATIONS.find(x => x.id === id);
    return respond(r ? {...r, status: 'CANCELLED', cancelledAt: NOW()} : {error: 'not found'});
  }

  if (url.match(/\/reservations\/parking-lot\/\d+/) && method === 'GET') {
    return respond(MOCK_RESERVATIONS);
  }

  if (url.match(/\/payments\/parking-lot\/\d+/) && method === 'GET') {
    return respond(MOCK_PAYMENTS);
  }

  if (url.includes('/iot/events') && method === 'GET') {
    return respond(MOCK_IOT_EVENTS);
  }

  if (url.match(/\/iot-nodes\/\d+\/status/) && method === 'PATCH') {
    const id = Number(url.match(/\/iot-nodes\/(\d+)\/status/)![1]);
    const n = MOCK_IOT_NODES.find(x => x.id === id);
    return respond(n ? {...n, ...(req.body as object)} : {error: 'not found'});
  }

  if (url.match(/\/iot-nodes\/\d+/) && method === 'DELETE') {
    return respond(null);
  }

  if (url.includes('/iot-nodes') && method === 'POST') {
    return respond({id: 99, ...(req.body as object), firmware: 'v2.3.1', status: 'ONLINE', lastSeen: NOW()});
  }

  if (url.includes('/iot-nodes') && method === 'GET') {
    return respond(MOCK_IOT_NODES);
  }

  if (url.match(/\/camera\/snapshot\/\d+/) && method === 'GET') {
    return respond({url: '', timestamp: NOW(), isRecent: false});
  }

  if (url.includes('/profile') && method === 'PUT') {
    return respond({...MOCK_PROFILE, ...(req.body as object)});
  }

  if (url.includes('/profile') && method === 'GET') {
    return respond(MOCK_PROFILE);
  }

  return next(req);
};
