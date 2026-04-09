import { describe, it, expect, beforeAll } from "vitest";
import { encrypt, decrypt } from "@/lib/crypto";

describe("Crypto utilities", () => {
  // Set up test environment variable
  beforeAll(() => {
    process.env.ENCRYPTION_KEY = Buffer.from("test-key-32-bytes-long!").toString("base64");
  });

  it("should encrypt and decrypt text correctly", () => {
    const originalText = "Hello, World! This is a secret message.";
    const encrypted = encrypt(originalText);
    
    // Encrypted should be different from original
    expect(encrypted).not.toBe(originalText);
    expect(encrypted).toContain(":"); // Format is iv:tag:ciphertext
    
    // Decrypt and verify
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(originalText);
  });

  it("should produce different ciphertexts for same input", () => {
    const text = "Same text";
    const encrypted1 = encrypt(text);
    const encrypted2 = encrypt(text);
    
    // Should be different due to random IV
    expect(encrypted1).not.toBe(encrypted2);
    
    // But both should decrypt to the same value
    expect(decrypt(encrypted1)).toBe(text);
    expect(decrypt(encrypted2)).toBe(text);
  });

  it("should handle empty string", () => {
    const text = "";
    const encrypted = encrypt(text);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(text);
  });

  it("should throw error for invalid encrypted format", () => {
    expect(() => decrypt("invalid-format")).toThrow();
  });
});
