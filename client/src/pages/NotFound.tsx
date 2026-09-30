import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Compass,
  Utensils,
  House,
  Flower2,
  MapPin,
} from "lucide-react";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <main className="not-found">
      <div className="not-found__container">

        {/* LEFT SIDE */}
        <section className="not-found__content">

          <div className="not-found__number">
            <span>4</span>

            <div className="not-found__zero">
              <div className="not-found__mountain">
                <span></span>
                <span></span>
              </div>

              <div className="not-found__sun"></div>
            </div>

            <span>4</span>
          </div>

          <div className="not-found__plane">
            ✈
          </div>

          <h1>Oops! Page not found</h1>

          <p>
            The page you are looking for might have been
            moved, deleted, or never existed.
          </p>

          <Link to="/" className="not-found__home-btn">
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          {/* QUICK LINKS */}
          <div className="not-found__explore">

            <h3>Explore more:</h3>

            <div className="not-found__links">

              <Link to="/">
                <span>
                  <House size={22} />
                </span>
                Home
              </Link>

              <Link to="/travel">
                <span>
                  <Compass size={22} />
                </span>
                Travel
              </Link>

              <Link to="/food">
                <span>
                  <Utensils size={22} />
                </span>
                Food
              </Link>

              <Link to="/relax">
                <span>
                  <Flower2 size={22} />
                </span>
                Relax
              </Link>

            </div>
          </div>

        </section>

        {/* RIGHT SIDE */}
        <section className="not-found__illustration">

          <div className="not-found__cloud cloud-1"></div>
          <div className="not-found__cloud cloud-2"></div>
          <div className="not-found__cloud cloud-3"></div>

          {/* Mountains */}
          <div className="mountains">
            <div className="mountain mountain-1"></div>
            <div className="mountain mountain-2"></div>
            <div className="mountain mountain-3"></div>
          </div>

          {/* Lake */}
          <div className="lake">
            <div className="lake-line"></div>
            <div className="lake-line"></div>
            <div className="lake-line"></div>
          </div>

          {/* Village */}
          <div className="village">
            <div className="house house-1"></div>
            <div className="house house-2"></div>
            <div className="house house-3"></div>
          </div>

          {/* Sign */}
          <div className="sign">
            <div className="sign__pole"></div>

            <div className="sign__board sign__board--top">
              Better
            </div>

            <div className="sign__board sign__board--middle">
              Journeys
            </div>

            <div className="sign__board sign__board--bottom">
              Ahead ♡
            </div>
          </div>

          {/* Backpack */}
          <div className="backpack">
            <div className="backpack__handle"></div>
            <div className="backpack__body">
              <div className="backpack__pocket">
                <MapPin size={17} />
              </div>
            </div>

            <div className="backpack__strap backpack__strap--left"></div>
            <div className="backpack__strap backpack__strap--right"></div>
          </div>

          {/* Map */}
          <div className="map">
            <div className="map__pin">
              <MapPin size={22} />
            </div>
          </div>

          <div className="not-found__quote">
            Not all those who wander
            <br />
            are lost...
            <span>♥</span>
          </div>

        </section>

      </div>
    </main>
  );
};

export default NotFound;