import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GeneratePage from "@/app/dashboard/generate/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock react-hook-form
vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form");
  return {
    ...actual,
    useForm: vi.fn(),
  };
});

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock saveProject action
vi.mock("@/app/actions/projects", () => ({
  saveProject: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock fetch for streaming API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock navigator.clipboard
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};
Object.defineProperty(navigator, "clipboard", {
  value: mockClipboard,
  writable: true,
});

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = vi.fn().mockReturnValue("blob:mock-url");
const mockRevokeObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock document.createElement for download
const mockClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();
global.document.createElement = vi.fn(() => ({
  href: "",
  download: "",
  click: mockClick,
})) as never;
global.document.body.appendChild = mockAppendChild;
global.document.body.removeChild = mockRemoveChild;

describe("GeneratePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    mockClipboard.writeText.mockClear();
    mockClick.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial Render", () => {
    it("should render the page title", () => {
      render(<GeneratePage />);
      expect(screen.getByText("Generate PRD")).toBeInTheDocument();
    });

    it("should render the page description", () => {
      render(<GeneratePage />);
      expect(
        screen.getByText(/Deskripsikan ide proyek Anda/)
      ).toBeInTheDocument();
    });

    it("should render the card title for project description", () => {
      render(<GeneratePage />);
      expect(screen.getByText("Deskripsikan Proyek Anda")).toBeInTheDocument();
    });

    it("should render the template prompt section", () => {
      render(<GeneratePage />);
      expect(screen.getByText("Template Prompt (Opsional)")).toBeInTheDocument();
    });

    it("should render all 5 prompt templates", () => {
      render(<GeneratePage />);
      expect(screen.getByText("E-Commerce Platform")).toBeInTheDocument();
      expect(screen.getByText("Learning Management System")).toBeInTheDocument();
      expect(screen.getByText("POS & Inventory System")).toBeInTheDocument();
      expect(screen.getByText("SaaS Booking System")).toBeInTheDocument();
      expect(screen.getByText("Blog & Newsletter")).toBeInTheDocument();
    });

    it("should render the prompt textarea with correct placeholder", () => {
      render(<GeneratePage />);
      expect(
        screen.getByPlaceholderText(/Contoh: Sistem kasir online/)
      ).toBeInTheDocument();
    });

    it("should render the deployment target label", () => {
      render(<GeneratePage />);
      expect(screen.getByText("Target Deployment")).toBeInTheDocument();
    });

    it("should render the Generate PRD submit button", () => {
      render(<GeneratePage />);
      expect(screen.getByRole("button", { name: /Generate PRD/i })).toBeInTheDocument();
    });

    it("should render the output display card", () => {
      render(<GeneratePage />);
      expect(screen.getByText("Hasil PRD")).toBeInTheDocument();
    });

    it("should show empty state message in output area", () => {
      render(<GeneratePage />);
      expect(
        screen.getByText(/Masukkan deskripsi proyek dan klik/)
      ).toBeInTheDocument();
    });

    it("should show the Sparkles icon in the empty state", () => {
      render(<GeneratePage />);
      const svgElements = document.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });

  describe("Template Selection", () => {
    it("should fill prompt and deployment when clicking E-Commerce template", async () => {
      const mockSetValue = vi.fn();
      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: mockSetValue,
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);
      const ecommerceButton = screen.getByText("E-Commerce Platform").closest("button");
      if (ecommerceButton) {
        fireEvent.click(ecommerceButton);
      }

      expect(mockSetValue).toHaveBeenCalledWith("prompt", expect.stringContaining("e-commerce"));
      expect(mockSetValue).toHaveBeenCalledWith("deployment", "vercel");
    });

    it("should fill prompt and deployment when clicking LMS template", async () => {
      const mockSetValue = vi.fn();
      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: mockSetValue,
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);
      const lmsButton = screen.getByText("Learning Management System").closest("button");
      if (lmsButton) {
        fireEvent.click(lmsButton);
      }

      expect(mockSetValue).toHaveBeenCalledWith("prompt", expect.stringContaining("pembelajaran"));
      expect(mockSetValue).toHaveBeenCalledWith("deployment", "vercel");
    });

    it("should fill prompt and deployment when clicking POS template", async () => {
      const mockSetValue = vi.fn();
      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: mockSetValue,
        watch: vi.fn().mockReturnValue("vps"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);
      const posButton = screen.getByText("POS & Inventory System").closest("button");
      if (posButton) {
        fireEvent.click(posButton);
      }

      expect(mockSetValue).toHaveBeenCalledWith("prompt", expect.stringContaining("Point of Sale"));
      expect(mockSetValue).toHaveBeenCalledWith("deployment", "vps");
    });

    it("should fill prompt and deployment when clicking SaaS Booking template", async () => {
      const mockSetValue = vi.fn();
      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: mockSetValue,
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);
      const bookingButton = screen.getByText("SaaS Booking System").closest("button");
      if (bookingButton) {
        fireEvent.click(bookingButton);
      }

      expect(mockSetValue).toHaveBeenCalledWith("prompt", expect.stringContaining("booking"));
      expect(mockSetValue).toHaveBeenCalledWith("deployment", "vercel");
    });

    it("should fill prompt and deployment when clicking Blog template", async () => {
      const mockSetValue = vi.fn();
      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: mockSetValue,
        watch: vi.fn().mockReturnValue("netlify"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);
      const blogButton = screen.getByText("Blog & Newsletter").closest("button");
      if (blogButton) {
        fireEvent.click(blogButton);
      }

      expect(mockSetValue).toHaveBeenCalledWith("prompt", expect.stringContaining("blogging"));
      expect(mockSetValue).toHaveBeenCalledWith("deployment", "netlify");
    });

    it("should disable template buttons when streaming", async () => {
      const mockSetValue = vi.fn();
      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: mockSetValue,
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);
      const buttons = screen.getAllByRole("button");
      const templateButtons = buttons.filter(
        (btn) =>
          btn.textContent?.includes("E-Commerce") ||
          btn.textContent?.includes("Learning") ||
          btn.textContent?.includes("POS") ||
          btn.textContent?.includes("SaaS") ||
          btn.textContent?.includes("Blog")
      );

      templateButtons.forEach((btn) => {
        expect(btn).not.toBeDisabled();
      });
    });
  });

  describe("Form Validation", () => {
    it("should show error when prompt is less than 10 characters", () => {
      const { useForm } = require("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue("vercel"),
        formState: {
          errors: {
            prompt: { message: "Deskripsi minimal 10 karakter" },
          },
        },
      }));

      render(<GeneratePage />);
      expect(screen.getByText("Deskripsi minimal 10 karakter")).toBeInTheDocument();
    });

    it("should show error when deployment is not selected", () => {
      const { useForm } = require("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue(undefined),
        formState: {
          errors: {
            deployment: { message: "Pilih target deployment" },
          },
        },
      }));

      render(<GeneratePage />);
      expect(screen.getByText("Pilih target deployment")).toBeInTheDocument();
    });

    it("should not show validation errors when form is valid", () => {
      const { useForm } = require("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);
      expect(screen.queryByText("Deskripsi minimal 10 karakter")).not.toBeInTheDocument();
      expect(screen.queryByText("Pilih target deployment")).not.toBeInTheDocument();
    });
  });

  describe("PRD Generation", () => {
    it("should call API with correct parameters on form submit", async () => {
      const mockSetValue = vi.fn();
      const mockHandleSubmit = vi.fn((fn) => (e: any) => {
        e?.preventDefault?.();
        fn({ prompt: "Test prompt", deployment: "vercel" });
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: async () => ({ done: true, value: undefined }),
          }),
        },
      });

      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: mockHandleSubmit,
        setValue: mockSetValue,
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);

      const submitFn = mockHandleSubmit.mock.calls[0]?.[0];
      if (submitFn) {
        await act(async () => {
          submitFn({ prompt: "Test prompt", deployment: "vercel" });
        });
      }

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: "Test prompt", deployment: "vercel" }),
        });
      });
    });

    it("should show loading state during generation", async () => {
      let resolveReader: (value: { done: boolean; value?: Uint8Array }) => void;
      const readerPromise = new Promise((resolve) => {
        resolveReader = resolve as any;
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: () => readerPromise,
          }),
        },
      });

      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn((fn) => (e: any) => {
          e?.preventDefault?.();
          fn({ prompt: "Test", deployment: "vercel" });
        }),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);

      const submitBtn = screen.getByRole("button", { name: /Generate PRD/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Menghasilkan/)).toBeInTheDocument();
      });

      resolveReader!({ done: true });
    });

    it("should show error when API returns error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "API key tidak valid" }),
      });

      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn((fn) => async (e: any) => {
          e?.preventDefault?.();
          try {
            await fn({ prompt: "Test prompt", deployment: "vercel" });
          } catch (err) {
            // Expected error
          }
        }),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);

      const submitBtn = screen.getByRole("button", { name: /Generate PRD/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText("API key tidak valid")).toBeInTheDocument();
      });
    });

    it("should show streaming cursor indicator during generation", async () => {
      let resolveReader: (value: { done: boolean; value?: Uint8Array }) => void;
      const readerPromise = new Promise((resolve) => {
        resolveReader = resolve as any;
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: () => readerPromise,
          }),
        },
      });

      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn((fn) => (e: any) => {
          e?.preventDefault?.();
          fn({ prompt: "Test", deployment: "vercel" });
        }),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);

      const submitBtn = screen.getByRole("button", { name: /Generate PRD/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        const cursor = document.querySelector(".streaming-cursor");
        expect(cursor).toBeInTheDocument();
      });

      resolveReader!({ done: true });
    });

    it("should show generating status indicator during streaming", async () => {
      let resolveReader: (value: { done: boolean; value?: Uint8Array }) => void;
      const readerPromise = new Promise((resolve) => {
        resolveReader = resolve as any;
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: () => readerPromise,
          }),
        },
      });

      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn((fn) => (e: any) => {
          e?.preventDefault?.();
          fn({ prompt: "Test", deployment: "vercel" });
        }),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);

      const submitBtn = screen.getByRole("button", { name: /Generate PRD/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText("Generating")).toBeInTheDocument();
      });

      resolveReader!({ done: true });
    });

    it("should disable submit button during generation", async () => {
      let resolveReader: (value: { done: boolean; value?: Uint8Array }) => void;
      const readerPromise = new Promise((resolve) => {
        resolveReader = resolve as any;
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: () => readerPromise,
          }),
        },
      });

      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn((fn) => (e: any) => {
          e?.preventDefault?.();
          fn({ prompt: "Test", deployment: "vercel" });
        }),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);

      const submitBtn = screen.getByRole("button", { name: /Generate PRD/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(submitBtn).toBeDisabled();
      });

      resolveReader!({ done: true });
    });
  });

  describe("Copy Functionality", () => {
    it("should not show copy button before generation completes", () => {
      render(<GeneratePage />);
      const copyButton = screen.queryByRole("button", { name: /Copy/i });
      expect(copyButton).not.toBeInTheDocument();
    });
  });

  describe("Download Functionality", () => {
    it("should not show download button before generation completes", () => {
      render(<GeneratePage />);
      const downloadButton = screen.queryByRole("button", { name: /Download/i });
      expect(downloadButton).not.toBeInTheDocument();
    });
  });

  describe("Save Functionality", () => {
    it("should not show save button before generation completes", () => {
      render(<GeneratePage />);
      const saveButton = screen.queryByRole("button", { name: /Simpan/i });
      expect(saveButton).not.toBeInTheDocument();
    });
  });

  describe("Deployment Options", () => {
    it("should include Vercel as a deployment option", () => {
      render(<GeneratePage />);
      expect(screen.getByText("Vercel")).toBeInTheDocument();
    });

    it("should include Netlify as a deployment option", () => {
      render(<GeneratePage />);
      expect(screen.getByText("Netlify")).toBeInTheDocument();
    });

    it("should include VPS as a deployment option", () => {
      render(<GeneratePage />);
      expect(screen.getByText("VPS (Ubuntu)")).toBeInTheDocument();
    });

    it("should include cPanel as a deployment option", () => {
      render(<GeneratePage />);
      expect(screen.getByText("cPanel")).toBeInTheDocument();
    });
  });

  describe("Output Display States", () => {
    it("should show skeleton loading when streaming starts with no content", async () => {
      let resolveReader: (value: { done: boolean; value?: Uint8Array }) => void;
      const readerPromise = new Promise((resolve) => {
        resolveReader = resolve as any;
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: () => readerPromise,
          }),
        },
      });

      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn((fn) => (e: any) => {
          e?.preventDefault?.();
          fn({ prompt: "Test", deployment: "vercel" });
        }),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);

      const submitBtn = screen.getByRole("button", { name: /Generate PRD/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        const skeletons = document.querySelectorAll('[class*="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
      });

      resolveReader!({ done: true });
    });

    it("should show markdown content when generation completes", async () => {
      const mockContent = "# Test PRD\n\nThis is a test PRD document.";
      const encoder = new TextEncoder();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: async () => ({
              done: false,
              value: encoder.encode(mockContent),
            }),
          }),
        },
      });

      const { useForm } = await import("react-hook-form");
      (useForm as any).mockImplementation(() => ({
        register: vi.fn(),
        handleSubmit: vi.fn((fn) => async (e: any) => {
          e?.preventDefault?.();
          await fn({ prompt: "Test", deployment: "vercel" });
        }),
        setValue: vi.fn(),
        watch: vi.fn().mockReturnValue("vercel"),
        formState: { errors: {} },
      }));

      render(<GeneratePage />);

      const submitBtn = screen.getByRole("button", { name: /Generate PRD/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText("Test PRD")).toBeInTheDocument();
      });
    });
  });
});
