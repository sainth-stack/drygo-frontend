import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_IP = 5; // Max 5 submissions per hour per IP

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>();

// Cleanup old entries periodically
const cleanupRateLimitStore = () => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
  }
};

// Check and update rate limit
const checkRateLimit = (ip: string): { allowed: boolean; remaining: number } => {
  cleanupRateLimitStore();
  
  const now = Date.now();
  const existing = rateLimitStore.get(ip);
  
  if (!existing || now - existing.firstRequest > RATE_LIMIT_WINDOW_MS) {
    // New window
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_IP - 1 };
  }
  
  if (existing.count >= MAX_REQUESTS_PER_IP) {
    return { allowed: false, remaining: 0 };
  }
  
  existing.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_IP - existing.count };
};

// Allowed origins for CORS - restrict to your domain(s)
const ALLOWED_ORIGINS = [
  'https://drygo.in',
  'https://www.drygo.in',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:8080'
];

// Helper function to get CORS headers based on origin
const getCorsHeaders = (origin: string | null) => {
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.endsWith('.lovableproject.com') || origin.endsWith('.lovable.app')
  );
  
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

// HTML escape function to prevent XSS in email clients
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

interface ContactEmailRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   "unknown";

  // Check rate limit
  const { allowed, remaining } = checkRateLimit(clientIP);
  
  if (!allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: "Too many submissions. Please try again later." }),
      { 
        status: 429, 
        headers: { 
          "Content-Type": "application/json",
          "Retry-After": "3600",
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    const { name, phone, email, address, message }: ContactEmailRequest = await req.json();

    // Input validation
    if (!name || typeof name !== 'string' || name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid name (max 100 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.length > 20) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid phone number" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!email || typeof email !== 'string' || email.length > 254) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (address && (typeof address !== 'string' || address.length > 500)) {
      return new Response(
        JSON.stringify({ error: "Address is too long (max 500 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (message && (typeof message !== 'string' || message.length > 5000)) {
      return new Response(
        JSON.stringify({ error: "Message is too long (max 5000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending contact email for: ${escapeHtml(name)}, ${escapeHtml(email)} (IP: ${clientIP}, remaining: ${remaining})`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "DRYGO Contact <onboarding@resend.dev>",
        to: ["info@drygo.in"],
        subject: `New Contact Inquiry from ${escapeHtml(name)}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Address:</strong> ${escapeHtml(address || "Not provided")}</p>
          <p><strong>Message:</strong> ${escapeHtml(message || "No message provided")}</p>
          <hr>
          <p>This message was sent from the DRYGO website contact form.</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      // Log detailed error server-side for debugging
      console.error("Resend API error:", errorData);
      // Return generic error to client
      return new Response(
        JSON.stringify({ error: "Failed to send message. Please try again later or contact us directly at info@drygo.in" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    // Log full error details server-side for debugging
    console.error("Error in send-contact-email function:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Return generic error message to client
    return new Response(
      JSON.stringify({ error: "Failed to send message. Please try again later or contact us directly at info@drygo.in" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
