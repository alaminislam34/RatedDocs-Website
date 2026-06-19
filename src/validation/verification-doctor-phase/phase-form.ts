import z from "zod";

export const procedureSchema = z.object({
  name: z.string().min(1, "Required"),
  pricing: z.coerce.number().min(0, "Invalid price"),
  notes: z.string().optional(),
});

export const formSchema = z.object({
  jciCertificate: z.any().optional(),
  certificateNumber: z.string().optional(),
  certificateExpiryDate: z.string().optional(),
  certificateIssueDate: z.string().optional(),
  issuingAuthority: z.string().optional(),
  videoWalkthrough: z.any().optional(),
  sterilizationMethods: z.array(z.string()).min(1, "Select at least one"),
  procedures: z.array(procedureSchema).min(1),
  signerFullName: z.string().min(1, "Required"),
  typedSignature: z.string().min(1, "Required"),
  agreeToGuarantee: z.boolean().refine((val) => val === true, "Must agree"),
});

export type FormValues = z.infer<typeof formSchema>;
export type FormInputValues = z.input<typeof formSchema>;
