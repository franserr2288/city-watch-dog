/**
 * MyLA311 Service Request Data Model
 * Represents a service request from the Los Angeles 311 system
 */
export class MyLA311ServiceRequest {
  /** Unique service request identifier */
  public SRNumber: string;

  /** Date when the service request was created */
  public CreatedDate: Date;

  /** Date when the service request was last updated */
  public UpdatedDate: Date | null;

  /** Description of action taken on the request */
  public ActionTaken: string | null;

  /** Department or person responsible for handling the request */
  public Owner: string | null;

  /** Type/category of the service request */
  public RequestType: string;

  /** Current status of the service request */
  public Status: string;

  /** Source channel where request was submitted (phone, web, mobile app, etc.) */
  public RequestSource: string | null;

  /** Organization of the user who created the request */
  public CreatedByUserOrganization: string | null;

  /** Mobile operating system if submitted via mobile app */
  public MobileOS: string | null;

  /** Whether the request was submitted anonymously */
  public Anonymous: boolean;

  /** Person or department assigned to handle the request */
  public AssignTo: string | null;

  /** Scheduled date for service */
  public ServiceDate: Date | null;

  /** Date when the request was closed/completed */
  public ClosedDate: Date | null;

  /** Whether the address has been verified */
  public AddressVerified: boolean;

  /** Whether an approximate address was used */
  public ApproximateAddress: boolean;

  /** Full formatted address */
  public Address: string | null;

  /** House/building number */
  public HouseNumber: string | null;

  /** Street direction (N, S, E, W, etc.) */
  public Direction: string | null;

  /** Street name */
  public StreetName: string | null;

  /** Street suffix (St, Ave, Blvd, etc.) */
  public Suffix: string | null;

  /** ZIP/postal code */
  public ZipCode: string | null;

  /** Geographic latitude coordinate */
  public Latitude: number | null;

  /** Geographic longitude coordinate */
  public Longitude: number | null;

  /** Combined location description or coordinates */
  public Location: string | null;

  /** Thomas Brothers Map page number */
  public TBMPage: number | null;

  /** Thomas Brothers Map column */
  public TBMColumn: string | null;

  /** Thomas Brothers Map row */
  public TBMRow: string | null;

  /** Area Planning Commission district */
  public APC: string | null;

  /** Council District number */
  public CD: number | null;

  /** Council District member name */
  public CDMember: string | null;

  /** Neighborhood Council identifier */
  public NC: number | null;

  /** Neighborhood Council name */
  public NCName: string | null;

  /** Police precinct/division */
  public PolicePrecinct: string | null;

  constructor(data: Partial<MyLA311ServiceRequest> = {}) {
    this.SRNumber = data.SRNumber || '';
    this.CreatedDate = data.CreatedDate || new Date();
    this.UpdatedDate = data.UpdatedDate || null;
    this.ActionTaken = data.ActionTaken || null;
    this.Owner = data.Owner || null;
    this.RequestType = data.RequestType || '';
    this.Status = data.Status || '';
    this.RequestSource = data.RequestSource || null;
    this.CreatedByUserOrganization = data.CreatedByUserOrganization || null;
    this.MobileOS = data.MobileOS || null;
    this.Anonymous = data.Anonymous || false;
    this.AssignTo = data.AssignTo || null;
    this.ServiceDate = data.ServiceDate || null;
    this.ClosedDate = data.ClosedDate || null;
    this.AddressVerified = data.AddressVerified || false;
    this.ApproximateAddress = data.ApproximateAddress || false;
    this.Address = data.Address || null;
    this.HouseNumber = data.HouseNumber || null;
    this.Direction = data.Direction || null;
    this.StreetName = data.StreetName || null;
    this.Suffix = data.Suffix || null;
    this.ZipCode = data.ZipCode || null;
    this.Latitude = data.Latitude || null;
    this.Longitude = data.Longitude || null;
    this.Location = data.Location || null;
    this.TBMPage = data.TBMPage || null;
    this.TBMColumn = data.TBMColumn || null;
    this.TBMRow = data.TBMRow || null;
    this.APC = data.APC || null;
    this.CD = data.CD || null;
    this.CDMember = data.CDMember || null;
    this.NC = data.NC || null;
    this.NCName = data.NCName || null;
    this.PolicePrecinct = data.PolicePrecinct || null;
  }

  /**
   * Check if the service request is currently open
   */
  public isOpen(): boolean {
    return this.ClosedDate === null;
  }

  /**
   * Check if the service request is closed
   */
  public isClosed(): boolean {
    return this.ClosedDate !== null;
  }

  /**
   * Get the full address as a formatted string
   */
  public getFormattedAddress(): string {
    if (this.Address) {
      return this.Address;
    }

    const parts: string[] = [];
    if (this.HouseNumber) parts.push(this.HouseNumber);
    if (this.Direction) parts.push(this.Direction);
    if (this.StreetName) parts.push(this.StreetName);
    if (this.Suffix) parts.push(this.Suffix);

    return parts.join(' ');
  }

  /**
   * Check if location coordinates are available
   */
  public hasCoordinates(): boolean {
    return this.Latitude !== null && this.Longitude !== null;
  }

  /**
   * Get the coordinates as a tuple [latitude, longitude]
   */
  public getCoordinates(): [number, number] | null {
    if (this.hasCoordinates()) {
      return [this.Latitude!, this.Longitude!];
    }
    return null;
  }

  /**
   * Convert the model to a plain object for JSON serialization
   */
  public toJSON(): Record<string, any> {
    return {
      SRNumber: this.SRNumber,
      CreatedDate: this.CreatedDate.toISOString(),
      UpdatedDate: this.UpdatedDate?.toISOString() || null,
      ActionTaken: this.ActionTaken,
      Owner: this.Owner,
      RequestType: this.RequestType,
      Status: this.Status,
      RequestSource: this.RequestSource,
      CreatedByUserOrganization: this.CreatedByUserOrganization,
      MobileOS: this.MobileOS,
      Anonymous: this.Anonymous,
      AssignTo: this.AssignTo,
      ServiceDate: this.ServiceDate?.toISOString() || null,
      ClosedDate: this.ClosedDate?.toISOString() || null,
      AddressVerified: this.AddressVerified,
      ApproximateAddress: this.ApproximateAddress,
      Address: this.Address,
      HouseNumber: this.HouseNumber,
      Direction: this.Direction,
      StreetName: this.StreetName,
      Suffix: this.Suffix,
      ZipCode: this.ZipCode,
      Latitude: this.Latitude,
      Longitude: this.Longitude,
      Location: this.Location,
      TBMPage: this.TBMPage,
      TBMColumn: this.TBMColumn,
      TBMRow: this.TBMRow,
      APC: this.APC,
      CD: this.CD,
      CDMember: this.CDMember,
      NC: this.NC,
      NCName: this.NCName,
      PolicePrecinct: this.PolicePrecinct,
    };
  }

  /**
   * Create a new instance from a plain object (e.g., from API response)
   */
  public static fromJSON(data: any): MyLA311ServiceRequest {
    const instance = new MyLA311ServiceRequest();

    instance.SRNumber = data.SRNumber || '';
    instance.CreatedDate = data.CreatedDate
      ? new Date(data.CreatedDate)
      : new Date();
    instance.UpdatedDate = data.UpdatedDate ? new Date(data.UpdatedDate) : null;
    instance.ActionTaken = data.ActionTaken || null;
    instance.Owner = data.Owner || null;
    instance.RequestType = data.RequestType || '';
    instance.Status = data.Status || '';
    instance.RequestSource = data.RequestSource || null;
    instance.CreatedByUserOrganization = data.CreatedByUserOrganization || null;
    instance.MobileOS = data.MobileOS || null;
    instance.Anonymous = Boolean(data.Anonymous);
    instance.AssignTo = data.AssignTo || null;
    instance.ServiceDate = data.ServiceDate ? new Date(data.ServiceDate) : null;
    instance.ClosedDate = data.ClosedDate ? new Date(data.ClosedDate) : null;
    instance.AddressVerified = Boolean(data.AddressVerified);
    instance.ApproximateAddress = Boolean(data.ApproximateAddress);
    instance.Address = data.Address || null;
    instance.HouseNumber = data.HouseNumber || null;
    instance.Direction = data.Direction || null;
    instance.StreetName = data.StreetName || null;
    instance.Suffix = data.Suffix || null;
    instance.ZipCode = data.ZipCode || null;
    instance.Latitude = data.Latitude ? Number(data.Latitude) : null;
    instance.Longitude = data.Longitude ? Number(data.Longitude) : null;
    instance.Location = data.Location || null;
    instance.TBMPage = data.TBMPage ? Number(data.TBMPage) : null;
    instance.TBMColumn = data.TBMColumn || null;
    instance.TBMRow = data.TBMRow || null;
    instance.APC = data.APC || null;
    instance.CD = data.CD ? Number(data.CD) : null;
    instance.CDMember = data.CDMember || null;
    instance.NC = data.NC ? Number(data.NC) : null;
    instance.NCName = data.NCName || null;
    instance.PolicePrecinct = data.PolicePrecinct || null;

    return instance;
  }
}

/**
 * Type alias for creating new service requests with optional fields
 */
export type CreateServiceRequestData = Partial<
  Omit<MyLA311ServiceRequest, 'SRNumber' | 'CreatedDate'>
> & {
  RequestType: string;
};

/**
 * Type alias for updating existing service requests
 */
export type UpdateServiceRequestData = Partial<
  Omit<MyLA311ServiceRequest, 'SRNumber' | 'CreatedDate'>
>;

/**
 * Enum for common service request statuses
 */
export enum ServiceRequestStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled',
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
}

/**
 * Enum for common request sources
 */
export enum RequestSource {
  PHONE = 'Phone',
  WEB = 'Web',
  MOBILE_APP = 'Mobile App',
  EMAIL = 'Email',
  WALK_IN = 'Walk-in',
  SOCIAL_MEDIA = 'Social Media',
}
