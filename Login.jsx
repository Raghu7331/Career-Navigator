import { useState } from "react";
import "../Signup.css"; // ✅ reuse same CSS for styling

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter both username/email and password.");
      return;
    }
    alert("Login successful! Redirecting to dashboard...");
    window.location.href = "/"; // ✅ redirect after login
  };

  return (
    <div className="card">
  <div className="header">Career Navigator</div>
  <div className="content">
    <h2>Login</h2>
    <input type="text" placeholder="Username or Email" />
    <input type="password" placeholder="Password" />
    <button>Login</button>
<div className="link">
  New user? <a href="/signup">Register</a>
</div>


  </div>
</div>

  );
}

export default Login;
