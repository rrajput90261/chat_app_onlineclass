import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import { useChat } from '../context/ChatContext';
import CuteLamp from '../components/Auth/CuteLamp';
import '../components/Auth/CuteLampAuth.css';

const AuthPage = () => {
  // Lamp starts OFF: first lamp appears, then turning it on reveals login
  const [isLampOn, setIsLampOn] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useChat();

  // Synthetic click sound using Web Audio API (zero external files required)
  const playClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      // Audio autoplay may be restricted
    }
  };

  // Handle pulling cord to toggle lamp
  const handleToggleLamp = () => {
    setIsPulling(true);
    playClickSound();

    setTimeout(() => {
      setIsPulling(false);
      setIsLampOn((prev) => !prev);
    }, 160);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data } = await authAPI.login(email, password);
        if (data.success) {
          localStorage.setItem('chat_app_token', data.token);
          setUser(data.user);
        }
      } else {
        const { data } = await authAPI.register(username, email, password);
        if (data.success) {
          // Auto login after successful sign up
          const loginRes = await authAPI.login(email, password);
          if (loginRes.data.success) {
            localStorage.setItem('chat_app_token', loginRes.data.token);
            setUser(loginRes.data.user);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo user fill
  const fillDemo = (num) => {
    setIsLogin(true);
    if (num === 1) {
      setEmail('student1@example.com');
      setPassword('password123');
    } else {
      setEmail('student2@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className={`lamp-auth-page ${isLampOn ? 'is-lit' : ''} ${isLogin ? 'theme-green' : 'theme-blue'}`}>
      {/* Top Header Title */}
      <h1 className="lamp-page-title">Cute Lamp Login</h1>

      {/* Main Stage */}
      <div className={`lamp-stage ${isLampOn ? 'lamp-on' : 'lamp-off'}`}>
        
        {/* Left Column: Interactive Lamp */}
        <div className="lamp-wrapper">
          <CuteLamp
            isOn={isLampOn}
            onToggle={handleToggleLamp}
            isPulling={isPulling}
            theme={isLogin ? 'green' : 'blue'}
          />

          {/* Hint callout when lamp is OFF */}
          {!isLampOn && (
            <div className="lamp-cord-hint" onClick={handleToggleLamp}>
              <span>👈</span> Click the cord to turn ON!
            </div>
          )}
        </div>

        {/* Right Column: Glowing Green Login Card (Opens when Lamp is ON) */}
        <div className="lamp-login-card">
          <h2 className="card-header-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {/* Login / Sign Up Tabs */}
          <div className="lamp-auth-tabs">
            <button
              type="button"
              className={`lamp-tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`lamp-tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="lamp-error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="lamp-form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="lamp-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="lamp-form-group">
              <label>{isLogin ? 'Username / Email' : 'Email Address'}</label>
              <input
                type="email"
                placeholder={isLogin ? 'Enter your email' : 'you@example.com'}
                className="lamp-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="lamp-form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="lamp-input password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="lamp-submit-btn"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <a
            href="#forgot"
            className="lamp-forgot-link"
            onClick={(e) => {
              e.preventDefault();
              alert('Use demo accounts or sign up with a new email to continue!');
            }}
          >
            Forgot Password?
          </a>

          {/* Quick Demo Buttons for Instant Testing */}
          <div className="lamp-demo-box">
            <span className="lamp-demo-title">Quick 1-Click Demo Accounts:</span>
            <div className="lamp-demo-btns">
              <button
                type="button"
                className="lamp-demo-btn"
                onClick={() => fillDemo(1)}
              >
                Demo User 1
              </button>
              <button
                type="button"
                className="lamp-demo-btn"
                onClick={() => fillDemo(2)}
              >
                Demo User 2
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Button to toggle lamp off if user wants to play with the lamp */}
      {isLampOn && (
        <button
          type="button"
          className="turn-off-btn"
          onClick={handleToggleLamp}
        >
          💡 Click to turn OFF lamp
        </button>
      )}
    </div>
  );
};

export default AuthPage;
