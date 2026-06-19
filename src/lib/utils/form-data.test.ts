import { describe, it, expect } from "vitest";
import { objectToFormData } from "./form-data";

describe("objectToFormData", () => {
  it("should convert flat object keys and string values to FormData", () => {
    const data = { name: "John Doe", email: "john@example.com" };
    const formData = objectToFormData(data);

    expect(formData.get("name")).toBe("John Doe");
    expect(formData.get("email")).toBe("john@example.com");
  });

  it("should serialize numbers to strings", () => {
    const data = { age: 30 };
    const formData = objectToFormData(data);

    expect(formData.get("age")).toBe("30");
  });

  it("should handle nested object serialization by nesting keys", () => {
    const data = { user: { role: "DENTIST" } };
    const formData = objectToFormData(data);

    expect(formData.get("user[role]")).toBe("DENTIST");
  });

  it("should handle arrays by appending indices to keys", () => {
    const data = { tags: ["implant", "veneer"] };
    const formData = objectToFormData(data);

    expect(formData.get("tags[0]")).toBe("implant");
    expect(formData.get("tags[1]")).toBe("veneer");
  });
});
