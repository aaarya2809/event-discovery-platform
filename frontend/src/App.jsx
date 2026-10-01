
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001/api";

function App() {
  // Event states
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // RSVP states
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState("");
  const [myRSVPs, setMyRSVPs] = useState([]);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [myEventsLoading, setMyEventsLoading] = useState(false);

  // Authentication states
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [user, setUser] = useState(
    localStorage.getItem("token") || ""
  );

  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load events");
      }

      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents();
  }, []);

  // Search and category filtering
  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (event.title || "").toLowerCase().includes(searchText) ||
      (event.city || "").toLowerCase().includes(searchText) ||
      (event.description || "").toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    ...new Set(events.map((event) => event.category).filter(Boolean)),
  ];

  // Authentication modal
  const openAuth = (loginMode) => {
    setIsLogin(loginMode);
    setAuthMessage("");

    setAuthData({
      name: "",
      email: "",
      password: "",
    });

    setShowAuth(true);
  };

  // Login and registration
  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      setAuthLoading(true);
      setAuthMessage("");

      const endpoint = isLogin ? "login" : "register";

      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      const token = data.token || data.accessToken;

      if (!token) {
        throw new Error("Authentication token was not returned");
      }

      localStorage.setItem("token", token);
      setUser(token);
      setShowAuth(false);

      setAuthData({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setAuthMessage(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser("");
    setMyRSVPs([]);
    setShowMyEvents(false);
    setSelectedEvent(null);
    setRsvpMessage("");
  };

  // RSVP for an event
  const handleRSVP = async (eventId) => {
    if (!user) {
      openAuth(true);
      return;
    }

    try {
      setRsvpLoading(eventId);
      setRsvpMessage("");

      const response = await fetch(`${API_URL}/rsvps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({
          eventId,
          status: "going",
          guests: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "RSVP failed");
      }

      setRsvpMessage("Successfully registered for the event!");

      if (showMyEvents) {
        await fetchMyEvents();
      }
    } catch (err) {
      setRsvpMessage(err.message);
    } finally {
      setRsvpLoading("");
    }
  };

  // Fetch user's registered events
  const fetchMyEvents = async () => {
    if (!user) {
      openAuth(true);
      return;
    }

    try {
      setMyEventsLoading(true);
      setRsvpMessage("");

      const response = await fetch(`${API_URL}/rsvps/my`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load your events");
      }

      setMyRSVPs(data.rsvps || []);
      setShowMyEvents(true);
      setSelectedEvent(null);
    } catch (err) {
      setRsvpMessage(err.message);
    } finally {
      setMyEventsLoading(false);
    }
  };

  // Cancel RSVP
  const handleCancelRSVP = async (eventId) => {
    if (!eventId) return;

    try {
      setRsvpLoading(eventId);
      setRsvpMessage("");

      const response = await fetch(`${API_URL}/rsvps/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to cancel RSVP");
      }

      setMyRSVPs((previous) =>
        previous.filter((rsvp) => rsvp.event?._id !== eventId)
      );

      setRsvpMessage("Your RSVP has been cancelled.");
    } catch (err) {
      setRsvpMessage(err.message);
    } finally {
      setRsvpLoading("");
    }
  };

  // Return to event discovery
  const scrollToEvents = () => {
    setShowMyEvents(false);
    setSelectedEvent(null);

    setTimeout(() => {
      document.getElementById("events")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <h2>
          Eventify<span>.</span>
        </h2>

        <div>
          <a
            href="#home"
            onClick={() => {
              setShowMyEvents(false);
              setSelectedEvent(null);
            }}
          >
            Home
          </a>

          <a
            href="#events"
            onClick={() => {
              setShowMyEvents(false);
              setSelectedEvent(null);
            }}
          >
            Explore Events
          </a>

          <a href="#about">About</a>

          {!user ? (
            <>
              <button onClick={() => openAuth(true)}>
                Login
              </button>

              <button
                className="signup"
                onClick={() => openAuth(false)}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button onClick={fetchMyEvents}>
                My Events
              </button>

              <button onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <p className="tagline">
          DISCOVER EXPERIENCES THAT MATTER
        </p>

        <h1>
          Find Your Next
          <br />
          <span>Unforgettable</span> Event.
        </h1>

        <p>
          Discover events, connect with people and create memories.
        </p>

        <button onClick={scrollToEvents}>
          Explore Events →
        </button>
      </section>

      {/* DISCOVER EVENTS SECTION */}
      {!showMyEvents && !selectedEvent && (
        <section className="events" id="events">
          <h2>Discover Events</h2>

          <p>
            Find experiences happening around you.
          </p>

          {/* SEARCH AND FILTER */}
          <div className="event-filters">
            <input
              type="text"
              placeholder="Search events, cities or descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {loading && <p>Loading events...</p>}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {rsvpMessage && (
            <p className="rsvp-message">
              {rsvpMessage}
            </p>
          )}

          {/* EVENT CARDS */}
          <div className="event-grid">
            {filteredEvents.map((event) => (
              <div
                className="event-card"
                key={event._id}
                onClick={() => {
                  setSelectedEvent(event);
                  setRsvpMessage("");
                }}
                style={{ cursor: "pointer" }}
              >
                <span>{event.category || "Event"}</span>

                <h3>{event.title}</h3>

                <p>
                  📍 {event.city || "Location not specified"}
                </p>

                <p>
                  {event.description ||
                    "Join us for this exciting event!"}
                </p>

                <button
                  className="rsvp-button"
                  disabled={rsvpLoading === event._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRSVP(event._id);
                  }}
                >
                  {rsvpLoading === event._id
                    ? "Registering..."
                    : "RSVP Now →"}
                </button>

                <p className="event-details-link">
                  View event details →
                </p>
              </div>
            ))}
          </div>

          {!loading && !error && filteredEvents.length === 0 && (
            <p>
              No events found. Try another search or category.
            </p>
          )}
        </section>
      )}

      {/* EVENT DETAILS SECTION */}
      {selectedEvent && !showMyEvents && (
        <section className="events event-details">
          <button
            className="rsvp-button"
            onClick={() => {
              setSelectedEvent(null);
              setRsvpMessage("");
            }}
          >
            ← Back to Events
          </button>

          <div className="event-card">
            <span>{selectedEvent.category || "Event"}</span>

            <h2>{selectedEvent.title}</h2>

            <p>
              📍 {selectedEvent.city || "Location not specified"}
            </p>

            <p>
              {selectedEvent.description ||
                "No description available."}
            </p>

            {selectedEvent.date && (
              <p>
                📅{" "}
                {new Date(selectedEvent.date).toLocaleDateString()}
              </p>
            )}

            {selectedEvent.time && (
              <p>🕒 {selectedEvent.time}</p>
            )}

            {selectedEvent.venue && (
              <p>🏛️ {selectedEvent.venue}</p>
            )}

            {rsvpMessage && (
              <p className="rsvp-message">
                {rsvpMessage}
              </p>
            )}

            <button
              className="rsvp-button"
              disabled={rsvpLoading === selectedEvent._id}
              onClick={() => handleRSVP(selectedEvent._id)}
            >
              {rsvpLoading === selectedEvent._id
                ? "Registering..."
                : "RSVP Now →"}
            </button>
          </div>
        </section>
      )}

      {/* MY EVENTS SECTION */}
      {showMyEvents && (
        <section className="events" id="my-events">
          <h2>My Registered Events</h2>

          <p>
            Manage the events you have registered for.
          </p>

          <button
            className="rsvp-button"
            onClick={() => {
              setShowMyEvents(false);
              setRsvpMessage("");
            }}
          >
            ← Back to Discover Events
          </button>

          {myEventsLoading && <p>Loading your events...</p>}

          {rsvpMessage && (
            <p className="rsvp-message">
              {rsvpMessage}
            </p>
          )}

          {!myEventsLoading && (
            <>
              <div className="event-grid">
                {myRSVPs.map((rsvp) => (
                  <div className="event-card" key={rsvp._id}>
                    <span>{rsvp.status}</span>

                    <h3>
                      {rsvp.event?.title || "Event"}
                    </h3>

                    <p>
                      📍{" "}
                      {rsvp.event?.city || "Location not specified"}
                    </p>

                    <p>
                      {rsvp.event?.description || ""}
                    </p>

                    <p>
                      Guests: {rsvp.guests ?? 0}
                    </p>

                    <button
                      className="rsvp-button"
                      disabled={
                        !rsvp.event?._id ||
                        rsvpLoading === rsvp.event?._id
                      }
                      onClick={() =>
                        handleCancelRSVP(rsvp.event?._id)
                      }
                    >
                      {rsvpLoading === rsvp.event?._id
                        ? "Cancelling..."
                        : "Cancel RSVP"}
                    </button>
                  </div>
                ))}
              </div>

              {myRSVPs.length === 0 && (
                <p>
                  You haven't registered for any events yet.
                </p>
              )}
            </>
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer id="about">
        <h2>Eventify.</h2>
        <p>Discover. Connect. Experience.</p>
        <p>© 2026 Eventify. All rights reserved.</p>
      </footer>

      {/* AUTHENTICATION MODAL */}
      {showAuth && (
        <div
          className="auth-overlay"
          onClick={() => setShowAuth(false)}
        >
          <form
            className="auth-modal"
            onSubmit={handleAuth}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="close-auth"
              onClick={() => setShowAuth(false)}
            >
              ×
            </button>

            <h2>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p>
              {isLogin
                ? "Login to explore amazing events."
                : "Join Eventify and discover new experiences."}
            </p>

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                required
                value={authData.name}
                onChange={(e) =>
                  setAuthData({
                    ...authData,
                    name: e.target.value,
                  })
                }
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              required
              value={authData.email}
              onChange={(e) =>
                setAuthData({
                  ...authData,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              minLength={6}
              value={authData.password}
              onChange={(e) =>
                setAuthData({
                  ...authData,
                  password: e.target.value,
                })
              }
            />

            <button
              type="submit"
              className="auth-submit"
              disabled={authLoading}
            >
              {authLoading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>

            {authMessage && (
              <p className="auth-message">
                {authMessage}
              </p>
            )}

            <p>
              {isLogin
                ? "Don't have an account?"
                : "Already registered?"}

              <span
                onClick={() => {
                  setIsLogin(!isLogin);
                  setAuthMessage("");
                }}
              >
                {isLogin ? " Sign Up" : " Login"}
              </span>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;