// Explicit re-exports to avoid ambiguity between enquiry.types and enquiry.service
export type { RequestType, EnquiryRequest } from "./enquiry.types";
// Re-export everything from service (which also defines RequestStatus, EnquiryStatus)
export { EnquiryService } from "./enquiry.service";
export type {
  EnquirySubmission,
  BackendEnquiry,
  EnquiryStatus,
  RequestStatus,
} from "./enquiry.service";
