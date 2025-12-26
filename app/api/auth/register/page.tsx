"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneCode: "+1",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    addresses: {
      line1: "",
      line2: "",
      city: "",
      country: "",
      postalCode: "",
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("address-")) {
      const addressField = name.replace("address-", "");
      setFormData({
        ...formData,
        addresses: {
          ...formData.addresses,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Register user
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phoneNumber ? `${formData.phoneCode}${formData.phoneNumber}` : undefined,
          password: formData.password,
          addresses: {
            line1: formData.addresses.line1,
            line2: formData.addresses.line2 || undefined,
            city: formData.addresses.city,
            country: formData.addresses.country,
            postalCode: formData.addresses.postalCode || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Registration successful, but login failed. Please login manually.");
        setLoading(false);
        return;
      }

      // Redirect to Home page
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setError("Failed to sign up with Google");
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Sign up to get started</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          {/* Personal Information */}
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="optional">(optional)</span>
              </label>
              <div className="phone-input-group">
                <select
                  id="phoneCode"
                  name="phoneCode"
                  value={formData.phoneCode}
                  onChange={handleChange}
                  className="form-select phone-code"
                >
                  <option value="+971">AE +971</option>
                  <option value="+54">AR +54</option>
                  <option value="+43">AT +43</option>
                  <option value="+61">AU +61</option>
                  <option value="+880">BD +880</option>
                  <option value="+32">BE +32</option>
                  <option value="+55">BR +55</option>
                  <option value="+41">CH +41</option>
                  <option value="+56">CL +56</option>
                  <option value="+86">CN +86</option>
                  <option value="+57">CO +57</option>
                  <option value="+420">CZ +420</option>
                  <option value="+45">DK +45</option>
                  <option value="+20">EGY +20</option>
                  <option value="+34">ES +34</option>
                  <option value="+251">ETH +251</option>
                  <option value="+358">FI +358</option>
                  <option value="+33">FR +33</option>
                  <option value="+49">DE +49</option>
                  <option value="+30">GR +30</option>
                  <option value="+36">HU +36</option>
                  <option value="+91">IN +91</option>
                  <option value="+62">ID +62</option>
                  <option value="+353">IE +353</option> 
                  <option value="+39">IT +39</option>
                  <option value="+81">JP +81</option>
                  <option value="+254">KE +254</option>
                  <option value="+82">KR +82</option>
                  <option value="+60">MY +60</option>
                  <option value="+52">MX +52</option>
                  <option value="+234">NG +234</option>
                  <option value="+31">NL +31</option>
                  <option value="+47">NO +47</option>
                  <option value="+64">NZ +64</option>
                  <option value="+92">PK +92</option>
                  <option value="+51">PE +51</option>
                  <option value="+63">PH +63</option>
                  <option value="+48">PL +48</option>
                  <option value="+351">PT +351</option>
                  <option value="+250">RW +250</option>
                  <option value="+40">RO +40</option>
                  <option value="+7">RU +7</option>
                  <option value="+966">SA +966</option>
                  <option value="+65">SG +65</option>
                  <option value="+27">ZA +27</option>
                  <option value="+46">SE +46</option>
                  <option value="+66">TH +66</option>
                  <option value="+90">TR +90</option>
                  <option value="+256">UG +256</option>
                  <option value="+44">UK +44</option>
                  <option value="+1">US +1</option>
                  <option value="+58">VE +58</option>
                  <option value="+84">VN +84</option>
                  <option value="+260">ZM +260</option>
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="form-input phone-number"
                  placeholder="555 000 0000"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <h2 className="section-title">Address</h2>
            
            <div className="form-group">
              <label htmlFor="address-line1" className="form-label">
                Address Line 1 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="address-line1"
                name="address-line1"
                value={formData.addresses.line1}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address-line2" className="form-label">
                Address Line 2 <span className="optional">(optional)</span>
              </label>
              <input
                type="text"
                id="address-line2"
                name="address-line2"
                value={formData.addresses.line2}
                onChange={handleChange}
                className="form-input"
                placeholder="Apt, Suite, Unit (optional)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address-city" className="form-label">
                  City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address-city"
                  name="address-city"
                  value={formData.addresses.city}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="New York"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address-country" className="form-label">
                  Country <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address-country"
                  name="address-country"
                  value={formData.addresses.country}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="USA"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address-postalCode" className="form-label">
                Postal Code <span className="optional">(optional)</span>
              </label>
              <input
                type="text"
                id="address-postalCode"
                name="address-postalCode"
                value={formData.addresses.postalCode}
                onChange={handleChange}
                className="form-input"
                placeholder="10001"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-section">
            <h2 className="section-title">Security</h2>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input password-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="form-hint">Must be at least 6 characters</p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-input password-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle-btn"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            onClick={handleSubmit}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">Or sign up with</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="btn-google"
        >
          <svg className="google-icon" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <Link href="/api/auth/login" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}