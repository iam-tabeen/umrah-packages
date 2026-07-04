export interface UmrahRawDto {
  Active: boolean | string;
  Airline: string;
  AirlineID: string;
  AirlineOid: string;
  ArrivalBaggage: number | string;
  ArrivalDate: string;
  ArrivalDateString: string;
  ArrivalETA?: number;
  ArrivalETD?: number;
  ArrivalFligntNo?: number | string;
  ArrivalSectorFrom: string;
  ArrivalSectorTo: string;
  AvailableSeats: number;
  BookingEndDate: string;
  BookingStartDate: string;
  ChildWithoutBed: number | string;
  CurrencyId: string;
  CustomerOid?: any;
  DepartureBaggage: number | string;
  DepartureDate: string;
  DepartureDateString: string;
  DepartureETA?: number;
  DepartureETD?: number;
  DepartureFligntNo?: number | string;
  DepartureSectorFrom: string;
  DepartureSectorTo: string;
  DisableForCustomer: boolean | string;
  DisplayOrderGroup: number;
  DisplayOrderPackage: number;
  DoubleRoom: number | string;
  GroupCode: string;
  GroupOid: string;
  GroupTitle: string;
  InfantPrice: number | string;
  MakkahHotel: string;
  MakkahHotelOid: string;
  MakkahHotelThumbnail?: string;
  MakkahNights: number;
  MedinahHotel: string;
  MedinahHotelOid: string;
  MedinahHotelThumbnail?: string;
  MedinahNights: number;
  Nights: number;
  Oid: string;
  PackageCode: string;
  PackageOid: string;
  QuadRoom: number | string;
  ReservedSeats: number;
  SectorFrom: string;
  SectorTo: string;
  Sharing: number | string;
  ShortDescription: string;
  TotalSeats: number;
  TravelDate: string;
  TravelDateString: string;
  TripleRoom: number | string;
  [key: string]: any;
}

export interface PackageOption {
  packageOid: string;
  packageCode: string;
  makkahHotel: string;
  medinahHotel: string;
  sharing: number;
  quad: number;
  triple: number;
  double: number;
  childWithoutBed: number;
  infant: number;
}

export interface FlightGroup {
  groupOid: string;
  groupCode: string;
  groupTitle: string;
  airline: string;
  airlineId: string;
  sectorFrom: string;
  sectorTo: string;
  departureDate: string;
  departureDateString: string;
  departureFlightNo: string;
  arrivalDate: string;
  arrivalDateString: string;
  arrivalFlightNo: string;
  nights: number;
  makkahNights: number;
  medinahNights: number;
  totalSeats: number;
  availableSeats: number;
  bookingEndDate: string;
  packages: PackageOption[];
  lowestSharingPrice: number; // min "Sharing" price across all packages in this group
}
