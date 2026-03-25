"use strict";
// Shared enums and types for the entire application
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.NotificationType = exports.ScheduleType = exports.JVStage = exports.LegalCaseType = exports.DocumentStatus = exports.PropertyStatus = exports.PropertyPurpose = exports.PropertyType = exports.GlobalStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["PROPERTY_OWNER"] = "property_owner";
    UserRole["BUYER"] = "buyer";
    UserRole["TENANT"] = "tenant";
    UserRole["LEGAL_ADVISOR"] = "legal_advisor";
    UserRole["BUILDER"] = "builder";
    UserRole["PACKERS_MOVERS"] = "packers_movers";
    UserRole["PROPERTY_MANAGER"] = "property_manager";
    UserRole["MARKETING_PARTNER"] = "marketing_partner";
})(UserRole || (exports.UserRole = UserRole = {}));
var GlobalStatus;
(function (GlobalStatus) {
    GlobalStatus["PENDING"] = "pending";
    GlobalStatus["IN_PROGRESS"] = "in-progress";
    GlobalStatus["COMPLETED"] = "completed";
    GlobalStatus["CANCELLED"] = "cancelled";
})(GlobalStatus || (exports.GlobalStatus = GlobalStatus = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["APARTMENT"] = "apartment";
    PropertyType["HOUSE"] = "house";
    PropertyType["VILLA"] = "villa";
    PropertyType["PLOT"] = "plot";
    PropertyType["COMMERCIAL"] = "commercial";
    PropertyType["FARMLAND"] = "farmland";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var PropertyPurpose;
(function (PropertyPurpose) {
    PropertyPurpose["SALE"] = "sale";
    PropertyPurpose["RENT"] = "rent";
    PropertyPurpose["LEASE"] = "lease";
})(PropertyPurpose || (exports.PropertyPurpose = PropertyPurpose = {}));
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["DRAFT"] = "draft";
    PropertyStatus["ACTIVE"] = "active";
    PropertyStatus["UNDER_REVIEW"] = "under_review";
    PropertyStatus["SOLD"] = "sold";
    PropertyStatus["RENTED"] = "rented";
    PropertyStatus["INACTIVE"] = "inactive";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["UPLOADED"] = "uploaded";
    DocumentStatus["UNDER_REVIEW"] = "under_review";
    DocumentStatus["VERIFIED"] = "verified";
    DocumentStatus["REJECTED"] = "rejected";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var LegalCaseType;
(function (LegalCaseType) {
    LegalCaseType["TITLE_VERIFICATION"] = "title_verification";
    LegalCaseType["PROPERTY_REGISTRATION"] = "property_registration";
    LegalCaseType["DISPUTE_RESOLUTION"] = "dispute_resolution";
    LegalCaseType["AGREEMENT_DRAFTING"] = "agreement_drafting";
    LegalCaseType["CONSULTATION"] = "consultation";
})(LegalCaseType || (exports.LegalCaseType = LegalCaseType = {}));
var JVStage;
(function (JVStage) {
    JVStage["PROPOSAL"] = "proposal";
    JVStage["NEGOTIATION"] = "negotiation";
    JVStage["AGREEMENT"] = "agreement";
    JVStage["PLANNING"] = "planning";
    JVStage["CONSTRUCTION"] = "construction";
    JVStage["MARKETING"] = "marketing";
    JVStage["COMPLETED"] = "completed";
})(JVStage || (exports.JVStage = JVStage = {}));
var ScheduleType;
(function (ScheduleType) {
    ScheduleType["PROPERTY_VISIT"] = "property_visit";
    ScheduleType["LEGAL_CONSULTATION"] = "legal_consultation";
    ScheduleType["PACKERS_BOOKING"] = "packers_booking";
    ScheduleType["SERVICE_APPOINTMENT"] = "service_appointment";
    ScheduleType["MAINTENANCE"] = "maintenance";
})(ScheduleType || (exports.ScheduleType = ScheduleType = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["INQUIRY"] = "inquiry";
    NotificationType["BOOKING"] = "booking";
    NotificationType["LEGAL_UPDATE"] = "legal_update";
    NotificationType["PAYMENT"] = "payment";
    NotificationType["SYSTEM"] = "system";
    NotificationType["MARKETING"] = "marketing";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["INITIATED"] = "initiated";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
//# sourceMappingURL=index.js.map