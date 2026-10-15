import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TrackOrder.css";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { assets } from "../../assets/assets";

const bikeIcon = new L.Icon({ iconUrl: assets.bike, iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20] });

const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => { map.setView(coords); }, [coords, map]);
  return null;
};

const TrackOrder = () => {
  const { orderId } = useParams();
  const [driverPos, setDriverPos] = useState([22.5726, 88.3639]);
  const [showMap, setShowMap] = useState(true);
  const [connection, setConnection] = useState("connecting");
  const [trackingError, setTrackingError] = useState("");

  const fullRoute = [[22.5726, 88.3639], [22.621, 88.393], [22.9868, 87.855], [23.2324, 87.8631], [23.4846, 87.3188]];

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {};
    stompClient.connect({}, () => {
      setConnection("connected");
      stompClient.subscribe(`/topic/delivery/${orderId}`, (message) => {
        try {
          const location = JSON.parse(message.body);
          if (typeof location.lat !== "number" || typeof location.lng !== "number") throw new Error("Invalid location");
          setDriverPos([location.lat, location.lng]);
          if (location.status === "COMPLETED") setShowMap(false);
        } catch (error) {
          console.error("Could not read delivery update:", error);
          setTrackingError("We received an invalid location update. We’ll keep trying to reconnect.");
        }
      });
    }, () => {
      setConnection("error");
      setTrackingError("Live tracking is temporarily unavailable. Please try again in a moment.");
    });
    return () => { if (stompClient) stompClient.disconnect(); };
  }, [orderId]);

  const isComplete = !showMap;
  return (
    <main className="foodly-track">
      <header className="foodly-track__header"><div><p className="foodly-track__eyebrow">ON THE WAY TO YOU</p><h1>Follow your order<span>.</span></h1><p>Real-time updates, all the way to your door.</p></div><div className="foodly-track__order-chip"><span>ORDER</span><strong>#{String(orderId || "").slice(-8).toUpperCase()}</strong></div></header>
      <div className="foodly-track__layout">
        <section className="foodly-track__map-card" aria-label="Live delivery map">
          {showMap ? <div className="foodly-track__map"><MapContainer center={driverPos} zoom={8} style={{ height: "100%", width: "100%" }}><TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" /><Polyline positions={fullRoute} color="#f0443d" weight={5} opacity={0.72} /><Marker position={fullRoute[0]}><Popup>Restaurant: MasalaBox Kitchen</Popup></Marker><Marker position={driverPos} icon={bikeIcon}><Popup>Driver is here!</Popup></Marker><Marker position={fullRoute[fullRoute.length - 1]}><Popup>Your Location</Popup></Marker><RecenterMap coords={driverPos} /></MapContainer><div className="foodly-track__map-label"><i className="bi bi-broadcast-pin" aria-hidden="true" /> Live location</div></div> : <div className="foodly-track__complete"><span><i className="bi bi-check2" aria-hidden="true" /></span><h2>Delivered with care.</h2><p>Your order has arrived. We hope it makes your day a little tastier.</p></div>}
        </section>
        <aside className="foodly-track__status-panel" aria-live="polite"><div className={`foodly-track__connection foodly-track__connection--${connection}`}><i className={`bi ${connection === "connected" ? "bi-broadcast-pin" : connection === "error" ? "bi-wifi-off" : "bi-arrow-repeat"}`} aria-hidden="true" />{connection === "connected" ? "Live updates on" : connection === "error" ? "Connection issue" : "Connecting to your driver"}</div><div className="foodly-track__current"><span className={`foodly-track__status-icon ${isComplete ? "is-complete" : ""}`}><i className={`bi ${isComplete ? "bi-check2" : "bi-scooter"}`} aria-hidden="true" /></span><div><p>Current status</p><h2>{isComplete ? "Delivery completed" : "Driver is on the way"}</h2><span>{isComplete ? "Enjoy your meal!" : "Your order is moving towards you."}</span></div></div><div className="foodly-track__steps"><div className="is-done"><span><i className="bi bi-check2" aria-hidden="true" /></span><div><strong>Order confirmed</strong><small>Your order is being prepared</small></div></div><div className={isComplete ? "is-done" : "is-active"}><span>{isComplete ? <i className="bi bi-check2" aria-hidden="true" /> : <i className="bi bi-dot" aria-hidden="true" />}</span><div><strong>{isComplete ? "Delivered" : "Out for delivery"}</strong><small>{isComplete ? "Delivered to your address" : "Your driver is on the way"}</small></div></div><div className={isComplete ? "is-done" : ""}><span>{isComplete && <i className="bi bi-check2" aria-hidden="true" />}</span><div><strong>Enjoy your meal</strong><small>Made for moments like this</small></div></div></div>{trackingError && <p className="foodly-track__error" role="alert"><i className="bi bi-exclamation-circle" aria-hidden="true" /> {trackingError}</p>}<p className="foodly-track__privacy"><i className="bi bi-shield-check" aria-hidden="true" /> Your location is used only to complete this delivery.</p></aside>
      </div>
    </main>
  );
};

export default TrackOrder;
