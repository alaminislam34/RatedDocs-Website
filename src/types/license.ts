// {
//             "id": 2,
//             "created_at": "2026-06-16T10:05:36.889428Z",
//             "updated_at": "2026-06-16T10:05:36.889456Z",
//             "professional_headshot": "http://3.99.158.129:8004/media/documents/headshot/headShot_OgnfK6R.jpeg",
//             "city": "San Francisco",
//             "country": "UK",
//             "registration_no": "12345",
//             "doc_type": "LICENSE",
//             "file": "http://3.99.158.129:8004/media/documents/license/invoiceDesign_C8DQAI9.pdf",
//             "status": "SUBMITTED",
//             "is_verified": false,
//             "verified_at": null,
//             "reviewer_notes": "",
//             "dentist": 2,
//             "verification": 2,
//             "registration_authority": 2
//         },

export interface License {
    id: number;
    created_at: string;
    updated_at: string;
    professional_headshot: string;
    city: string;
    country: string;
    registration_no: string;
    
    // 👇 Optional: Restrict to known document types
    doc_type: "LICENSE" | "CERTIFICATE" | "DEGREE" | string; 
    
    file: string;
    
    // 👇 Optional: Restrict to known statuses
    status: "SUBMITTED" | "APPROVED" | "REJECTED" | "PENDING" | string; 
    
    is_verified: boolean;
    verified_at: string | null;
    reviewer_notes: string;
    
    // These represent Foreign Key IDs from your backend
    dentist: number;
    verification: number;
    registration_authority: number;
}