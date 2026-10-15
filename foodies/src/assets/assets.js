import logo from "./logo.png";
import cart from "./cart.png";
import brandMark from "./brand-mark.svg";
import profile from "./profile-modern.svg";
import delivery from "./order-bag.svg";
import bike from "./bike_icon.jpg";
import reviewerOne from "./reviewer-one.svg";
import reviewerTwo from "./reviewer-two.svg";
import reviewerThree from "./reviewer-three.svg";
import heroBiryaniLocal from "./hero-biryani.jpg";
import { fallbackFoods, menuCategories } from "../data/menuCatalog";

export const assets = {
  logo: brandMark,
  legacyLogo: logo,
  cart,
  biryani: "https://foms-images.s3.amazonaws.com/hero-biryani.jpg",
  biryaniLocal: heroBiryaniLocal,
  profile,
  delivery,
  bike,
  reviewers: [reviewerOne, reviewerTwo, reviewerThree],
};

export const categories = menuCategories;
export { fallbackFoods };
