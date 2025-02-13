  export interface IRootDetailQuotation{
    data: IDetailDataQuotation
    pagination: Pagination
    meta: Meta
  }
  
  export interface IDetailDataQuotation{
    id: string
    quotation_no: string
    project: IProject;
    prepared_by: PreparedBy;
    issued_date: string;
    is_create_quotation_total: number;
    customer: Customer;
    quotation_revision: IQuotation[];
    quotation_stack: DetailQuotationStack[];
    quotation_log: IQuotationLog[];
  }

  export interface IRootQuotation {
    data: IDataQuotation[]
    pagination: Pagination
    meta: Meta
  }

  export interface IDataQuotation{
    id: string
    quotation_no: string
    project: IProject;
    prepared_by: PreparedBy;
    issued_date: string;
    is_create_quotation_total: number;
    customer: Customer;
    latest_quotation_revision: IQuotation;
    quotation_stack: QuotationStack[];
    total_supplier_product: {
      id: number;
      name: string;
      total_price: number;
      total_price_list: number;
      gross_margin: string | number;
      total_installation_price: number;
    }[],
    quotation_log: IQuotationLog[];
  }

  interface IQuotationLog{
    quotation_id: string;
    name: string;
    revision: string;
    message: string;
    date: string
  }

  interface IProject{
    id: string;
    project_pid: string;
    name: string;
    issue_date: string;
    project_category: string;
    remarks: string;
    address: string;
    city: string;
    province: string;
    country: string;
    postal_code: string;
    maps_url: string;
    competitor: string;
    reason_failed: string | null;
    year: string;
    month: string;
    status: number;
    pic: Pic[];
    dce_pic: DcePic[];
    segmentation: Segmentation;
    cluster: Cluster;
    specification: Specification[];
    material: Material[];
  }
  
  export interface Customer {
    id: string
    name: string
    customer_pid: string
    email: string
    nib: string
    phone: string
    wa_phone: string
    address: string
    city: string
    province: string
    country: string
    postal_code: string
    website: string
    maps_url: string
    status: number
    type: string
    customer_firm_id: number
    loyal_customer_program_id: number
    customer_sector_id: number
    contactPerson: ContactPerson[]
  }
  
  export interface ContactPerson {
    id: string
    name: string
    customer_id: string
    cp_pid: string
    email: string
    nik: string
    phone: string
    wa_phone: string
    address: string
    city: string
    province: string
    country: string
    postal_code: string
    is_pic_company: number
    loyal_customer_program_id: number
    customer_category: CustomerCategory
    is_attention: number
  }
  
  export interface CustomerCategory {
    id: number
    name: string
    description: string
  }
  
  export interface Pic {
    pic_id: string
    is_pic_internal: number
    name: string
  }
  
  export interface DcePic {
    pic_id: string
    is_pic_internal: number
    name: string
    phone: string
  }
  
  export interface Segmentation {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
  }
  
  export interface Cluster {
    id: number
    name: string
    description: string
  }
  
  export interface Specification {
    id: string
    project_id: string
    specification: string
  }
  
  export interface Material {
    id: string
    project_id: string
    material_id: string
    material: Material2
  }
  
  export interface Material2 {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
  }
  
  export interface IQuotation {
    id: string
    quotation_id: string;
    revision: string;
    total_price: string;
    is_published: number;
    quotation_items: QuotationItem[];
    total_installation_price: string
    total_installation_price_after_discount: string
    total_price_after_discount: string
    tax: string;
    tax_price: string;
    total_price_after_tax: string;
    preliminaries: string;
    supervision: string;
    test_commisioning: string;
    preliminaries_cost: string;
    preliminaries_price_factor: string;
    preliminaries_gross_margin: string;
    supervision_cost: string;
    supervision_price_factor: string;
    supervision_gross_margin: string;
    test_commisioning_cost: string;
    test_commisioning_gross_margin: string;
    test_commisioning_price_factor: string;
    total_installation_addon_price: string;
    total_installation_addon_price_after_discount: string;
    total_installation_addon_gross_margin: string;
    grand_total_selling_price: string;
    grand_total_gross_margin: string;
    grand_total_cost: string;
    delivery_duration: string;
    offer_applies: string;
    type_of_work: string;
    termin_payment: string;
    discount_preliminaries: string;
    discount_supervision: string;
    discount_test_commisioning: string;
  }
  
  export interface PreparedBy {
    id: string
    name: string
  }
  
  export interface QuotationItem {
    id: string
    quotation_id: string
    inventory: Inventory
    dn_1: string
    dn_2: string
    qty: string
    total_price_per_product: string
    discount: string
    total_price_per_product_after_discount: string
    discount_installation: string;
    total_installation_price_after_discount: string;
    total_price_after_discount: string;
  }
  
  export interface Inventory {
    id: string
    code: string
    alias: string
    description: string
    unit: Unit
    unit_report: any
    supplier_product: SupplierProduct
    sub_category: SubCategory
    manufacturer: Manufacturer
    price_list: string
    tax: string
    inventory_source: string
    hs_code: any
    attachment: any
    status: number
    total_qty: any
    default_selling_price: string
    default_product_cost_2: string
    default_gross_margin: string
    installation: Installation
  }

  interface Installation{
    id: string
    inventory_id: string
    unit_inch_qty: string
    price: string
    price_type: string
    price_per_unit: string
    price_factor: string
    selling_price: string
    gross_margin: string
  }
  
  export interface Unit {
    id: number
    name: string
    measurement: string
    unit: any
    description: string
  }
  
  export interface SupplierProduct {
    id: number
    name: string
    description: string
  }
  
  export interface SubCategory {
    id: number
    name: string
    description: string
    created_at: any
    updated_at: any
  }
  
  export interface Manufacturer {
    id: number
    name: string
    description: string
    created_at: any
    updated_at: any
  }
  
  export interface QuotationStack {
    id: string
    quotation_id: string
    stack_slug: string
    name: string
    is_active: number
    latest_quotation_bom: LatestQuotationBom
    is_used_for_quotation: number;
  }

  export interface DetailQuotationStack{
    id: string
    quotation_id: string
    stack_slug: string
    name: string
    is_active: number
    quotation_stack_bom: LatestQuotationBom[]
    is_used_for_quotation: number;
  }

  export interface LatestQuotationBom {
    id: string
    quotation_stack_id: string
    revision_contract: string
    stack_bom_contract: string
    stack_revision_quotation: any
    bom_quotation_file: file
    bom_contract_rev_file: any
    total_price: string
    quotation_stack_items: QuotationItem[]
  }

  interface file{
    id: any
    attachment_path: string
    type: any
    file_name: string
    file_url: string
  }
  
  export interface Pagination {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
  
  export interface Meta {
    message: string
    status_code: number
  }
  