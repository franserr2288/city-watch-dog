import City311ReportSchema, {
  type City311ExternalModel,
} from 'src/ingestion/city-311/clients/city-311-report-schema';

export class ServiceRequest {
  public sr_number: string;

  public created_date: string;

  public updated_date: string | null;

  public action_taken: string | null;

  /** Department or person responsible for handling the request */
  public owner: string | null;

  public request_type: string;

  public status: string;

  /** Source channel where request was submitted (phone, web, mobile app, etc.) */
  public request_source: string | null;

  public created_by_user_organization: string | null;

  public mobile_os: string | null;

  public anonymous: boolean;

  public assign_to: string | null;

  /** Scheduled date for service */
  public service_date: Date | null;

  /** Date when the request was closed/completed */
  public closed_date: string | null;

  /** Whether the address has been verified */
  public address_verified: boolean;

  /** Whether an approximate address was used */
  public approximate_address: boolean;

  /** Full formatted address */
  public address: string | null;

  /** House/building number */
  public house_number: string | null;

  /** Street direction (N, S, E, W, etc.) */
  public direction: string | null;

  public street_name: string | null;

  /** Street suffix (St, Ave, Blvd, etc.) */
  public suffix: string | null;

  public zipcode: string | null;

  public latitude: number | null;

  public longitude: number | null;

  /** Combined location description or coordinates */
  public location: string | null;

  /** Thomas Brothers Map page number */
  public tbm_page: number | null;

  /** Thomas Brothers Map column */
  public tbm_column: string | null;

  /** Thomas Brothers Map row */
  public tbm_row: string | null;

  /** Area Planning Commission district */
  public area_planning_commission_district: string | null;

  /** Council District number */
  public council_district_number: string | null;

  /** Council District member name */
  public council_district_member_name: string | null;

  /** Neighborhood Council identifier */
  public neighborhood_council_identifier: string | null;

  /** Neighborhood Council name */
  public neighborhood_council_name: string | null;

  /** Police precinct/division */
  public police_precint: string | null;

  constructor(data: Partial<ServiceRequest> = {}) {
    this.sr_number = data.sr_number || '';
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || null;
    this.action_taken = data.action_taken || null;
    this.owner = data.owner || null;
    this.request_type = data.request_type || '';
    this.status = data.status || '';
    this.request_source = data.request_source || null;
    this.created_by_user_organization =
      data.created_by_user_organization || null;
    this.mobile_os = data.mobile_os || null;
    this.anonymous = data.anonymous || false;
    this.assign_to = data.assign_to || null;
    this.service_date = data.service_date || null;
    this.closed_date = data.closed_date || null;
    this.address_verified = data.address_verified || false;
    this.approximate_address = data.approximate_address || false;
    this.address = data.address || null;
    this.house_number = data.house_number || null;
    this.direction = data.direction || null;
    this.street_name = data.street_name || null;
    this.suffix = data.suffix || null;
    this.zipcode = data.zipcode || null;
    this.latitude = data.latitude || null;
    this.longitude = data.longitude || null;
    this.location = data.location || null;
    this.tbm_page = data.tbm_page || null;
    this.tbm_column = data.tbm_column || null;
    this.tbm_row = data.tbm_row || null;
    this.area_planning_commission_district =
      data.area_planning_commission_district || null;
    this.council_district_number = data.council_district_number || null;
    this.council_district_member_name =
      data.council_district_member_name || null;
    this.neighborhood_council_identifier =
      data.neighborhood_council_identifier || null;
    this.neighborhood_council_name = data.neighborhood_council_name || null;
    this.police_precint = data.police_precint || null;
  }

  /**
   * Check if the service request is currently open
   */
  public isOpen(): boolean {
    return this.closed_date === null;
  }

  /**
   * Check if the service request is closed
   */
  public isClosed(): boolean {
    return this.closed_date !== null;
  }

  /**
   * Get the full address as a formatted string
   */
  public getFormattedAddress(): string {
    if (this.address) {
      return this.address;
    }

    const parts: string[] = [];
    if (this.house_number) parts.push(this.house_number);
    if (this.direction) parts.push(this.direction);
    if (this.street_name) parts.push(this.street_name);
    if (this.suffix) parts.push(this.suffix);

    return parts.join(' ');
  }

  /**
   * Check if location coordinates are available
   */
  public hasCoordinates(): boolean {
    return this.latitude !== null && this.longitude !== null;
  }

  /**
   * Get the coordinates as a tuple [latitude, longitude]
   */
  public getCoordinates(): [number, number] | null {
    if (this.hasCoordinates()) {
      return [this.latitude!, this.longitude!];
    }
    return null;
  }

  public static fromAPIJSON(data: unknown): ServiceRequest {
    const parsedData: City311ExternalModel = City311ReportSchema.parse(data);
    const instance = new ServiceRequest();

    instance.sr_number = parsedData.srnumber || '';
    instance.created_date = parsedData.createddate
      ? new Date(parsedData.createddate).toISOString()
      : new Date().toISOString();
    instance.updated_date = parsedData.updateddate
      ? new Date(parsedData.updateddate).toISOString()
      : null;
    instance.action_taken = parsedData.actiontaken || null;
    instance.owner = parsedData.owner || null;
    instance.request_type = parsedData.requesttype || '';
    instance.status = parsedData.status || '';
    instance.request_source = parsedData.requestsource || null;
    instance.created_by_user_organization =
      parsedData.createdbyuserorganization || null;
    instance.mobile_os = parsedData.mobileos || null;
    instance.anonymous = Boolean(parsedData.anonymous);
    instance.assign_to = parsedData.assignto || null;
    instance.service_date = parsedData.servicedate
      ? new Date(parsedData.servicedate)
      : null;
    instance.closed_date = parsedData.closeddate
      ? new Date(parsedData.closeddate).toISOString()
      : null;
    instance.address_verified = Boolean(parsedData.addressverified);
    instance.approximate_address = Boolean(parsedData.approximateaddress);
    instance.address = parsedData.address || null;
    instance.house_number = parsedData.housenumber || null;
    instance.direction = parsedData.direction || null;
    instance.street_name = parsedData.streetname || null;
    instance.suffix = parsedData.suffix || null;
    instance.zipcode = parsedData.zipcode || null;
    instance.latitude = parsedData.latitude
      ? Number(parsedData.latitude)
      : null;
    instance.longitude = parsedData.longitude
      ? Number(parsedData.longitude)
      : null;
    instance.location = null;
    instance.tbm_page = parsedData.tbmpage ? Number(parsedData.tbmpage) : null;
    instance.tbm_column = parsedData.tbmcolumn || null;
    instance.tbm_row = parsedData.tbmrow || null;
    instance.area_planning_commission_district = parsedData.apc || null;
    instance.council_district_number = parsedData.cd ? parsedData.cd : null;
    instance.council_district_number = `${parsedData.cdmember}` || null;
    instance.neighborhood_council_identifier = parsedData.nc
      ? parsedData.nc
      : null;
    instance.neighborhood_council_name = parsedData.ncname || null;
    instance.police_precint = parsedData.policeprecinct || null;

    return instance;
  }
}

export type CreateServiceRequestData = Partial<
  Omit<ServiceRequest, 'SRNumber' | 'CreatedDate'>
> & {
  RequestType: string;
};

export type UpdateServiceRequestData = Partial<
  Omit<ServiceRequest, 'SRNumber' | 'CreatedDate'>
>;

export enum ServiceRequestStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled',
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
}

export enum RequestSource {
  PHONE = 'Phone',
  WEB = 'Web',
  MOBILE_APP = 'Mobile App',
  EMAIL = 'Email',
  WALK_IN = 'Walk-in',
  SOCIAL_MEDIA = 'Social Media',
}
