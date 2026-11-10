import { XMLParser } from 'fast-xml-parser';
import { UmrahRawDto, FlightGroup, PackageOption } from './types';
import { mockUmrahRawPackages } from './mockData';

/**
 * Filter and group flat Umrah packages by their flight group (GroupOid).
 */
export function groupPackagesByFlight(rawPackages: UmrahRawDto[]): FlightGroup[] {
  // 1. Filter out inactive packages
  const activePackages = rawPackages.filter(pkg => {
    const isActive = pkg.Active === true || pkg.Active === 'true';
    const isNotDisabled = pkg.DisableForCustomer === false || pkg.DisableForCustomer === 'false' || pkg.DisableForCustomer === 'System.String';
    // Handle edge case where DisableForCustomer might be a string "false" or similar
    const isDisabled = pkg.DisableForCustomer === true || pkg.DisableForCustomer === 'true';
    return isActive && !isDisabled;
  });

  const groupsMap: Record<string, FlightGroup> = {};

  for (const pkg of activePackages) {
    const groupOid = pkg.GroupOid;
    if (!groupOid) continue;

    // Parse pricing to numbers
    const sharing = Math.round(Number(pkg.Sharing) || 0);
    const quad = Math.round(Number(pkg.QuadRoom) || 0);
    const triple = Math.round(Number(pkg.TripleRoom) || 0);
    const double = Math.round(Number(pkg.DoubleRoom) || 0);
    const childWithoutBed = Math.round(Number(pkg.ChildWithoutBed) || 0);
    const infant = Math.round(Number(pkg.InfantPrice) || 0);

    const packageOpt: PackageOption = {
      packageOid: pkg.PackageOid || pkg.Oid,
      packageCode: pkg.PackageCode || '',
      makkahHotel: pkg.MakkahHotel || 'TBD Hotel Makkah',
      medinahHotel: pkg.MedinahHotel || 'TBD Hotel Medinah',
      sharing,
      quad,
      triple,
      double,
      childWithoutBed,
      infant,
    };

    if (!groupsMap[groupOid]) {
      groupsMap[groupOid] = {
        groupOid: pkg.GroupOid,
        groupCode: pkg.GroupCode || '',
        groupTitle: pkg.GroupTitle || 'Umrah Package Group',
        airline: pkg.Airline ? pkg.Airline.trim() : 'Unknown Airline',
        airlineId: pkg.AirlineID || 'Unknown',
        sectorFrom: pkg.SectorFrom || '',
        sectorTo: pkg.SectorTo || '',
        departureDate: pkg.DepartureDate || '',
        departureDateString: pkg.DepartureDateString || '',
        departureFlightNo: String(pkg.DepartureFligntNo || ''),
        arrivalDate: pkg.ArrivalDate || '',
        arrivalDateString: pkg.ArrivalDateString || '',
        arrivalFlightNo: String(pkg.ArrivalFligntNo || ''),
        nights: Number(pkg.Nights) || 0,
        makkahNights: Number(pkg.MakkahNights) || 0,
        medinahNights: Number(pkg.MedinahNights) || 0,
        totalSeats: Number(pkg.TotalSeats) || 0,
        availableSeats: Number(pkg.AvailableSeats) || 0,
        bookingEndDate: pkg.BookingEndDate || '',
        packages: [],
        lowestSharingPrice: sharing,
      };
    }

    const group = groupsMap[groupOid];
    group.packages.push(packageOpt);

    // Keep lowestSharingPrice updated
    if (sharing > 0 && (group.lowestSharingPrice === 0 || sharing < group.lowestSharingPrice)) {
      group.lowestSharingPrice = sharing;
    }
  }

  // Convert map to array, sort packages in each group by sharing price, and sort groups by departure date
  const flightGroups = Object.values(groupsMap).map(group => {
    // Sort package options within group by sharing price ascending (cheapest hotel combo first)
    group.packages.sort((a, b) => {
      if (a.sharing === 0) return 1;
      if (b.sharing === 0) return -1;
      return a.sharing - b.sharing;
    });

    if (group.packages.length > 0 && group.packages[0].sharing > 0) {
      group.lowestSharingPrice = group.packages[0].sharing;
    }

    return group;
  });

  // Sort groups by departure date ascending
  flightGroups.sort((a, b) => {
    const dateA = new Date(a.departureDate).getTime() || 0;
    const dateB = new Date(b.departureDate).getTime() || 0;
    return dateA - dateB;
  });

  return flightGroups;
}

interface FetchResult {
  groups: FlightGroup[];
  isFallback: boolean;
  error?: string;
}

/**
 * Fetches Umrah packages from the third-party API and groups them.
 * Never called on the client side to keep credentials and requests secure.
 */
export async function fetchUmrahPackages(): Promise<FetchResult> {
  const apiUrl = process.env.UMRAH_API_URL || 'https://api.meezabgroup.com/api/UmrGroupView/';
  const apiKey = process.env.UMRAH_API_KEY;

  console.log(`[API Fetch] Initiating data request to: ${apiUrl}`);

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/xml, text/xml, */*',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 20000);

    const res = await fetch(apiUrl, {
      method: 'GET',
      headers,
      signal: controller.signal,
      next: {
        revalidate: 900, // ISR cache revalidation every 15 minutes (900 seconds)
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const responseBody = await res.text();
    const trimmedBody = responseBody.trim();
    if (!trimmedBody) {
      throw new Error('Received empty response from API');
    }

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('json') || trimmedBody.startsWith('[') || trimmedBody.startsWith('{');

    let rawDtos: UmrahRawDto[];

    if (isJson) {
      const parsedJson = JSON.parse(trimmedBody);
      const records = Array.isArray(parsedJson) ? parsedJson : parsedJson?.UmrGroupViewDto ?? parsedJson?.data;
      if (!records) {
        throw new Error('Invalid JSON response structure: expected a package list');
      }
      rawDtos = Array.isArray(records) ? records : [records];
    } else {
      const parser = new XMLParser({
        ignoreAttributes: false,
        parseTagValue: true,
        trimValues: true,
      });

      const parsedResult = parser.parse(trimmedBody);

      const rootKey = Object.keys(parsedResult)[0];
      if (!rootKey) {
        throw new Error('Invalid XML response structure: No root element found');
      }

      const rootObj = parsedResult[rootKey];
      const listKey = Object.keys(rootObj).find(k => k.includes('UmrGroupViewDto'));
      if (!listKey || !rootObj[listKey]) {
        throw new Error(`Invalid XML response structure: Could not find list elements with key matching 'UmrGroupViewDto'`);
      }

      rawDtos = Array.isArray(rootObj[listKey])
        ? rootObj[listKey]
        : [rootObj[listKey]];
    }

    console.log(`[API Fetch] Successfully parsed ${rawDtos.length} packages`);
    const grouped = groupPackagesByFlight(rawDtos);
    console.log(`[API Fetch] Grouped packages into ${grouped.length} flight groups`);

    return {
      groups: grouped,
      isFallback: false,
    };

  } catch (error: any) {
    console.error('[API Fetch Error] Failed to fetch live packages. Using mock fallback.', error);
    
    // Fallback to mock data on failure
    const groupedFallback = groupPackagesByFlight(mockUmrahRawPackages);
    return {
      groups: groupedFallback,
      isFallback: true,
      error: error?.message || 'Unknown error occurred while fetching packages',
    };
  }
}
