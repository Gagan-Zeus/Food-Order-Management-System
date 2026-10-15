import biryaniIcon from "../assets/category-biryani.svg";
import southIndianIcon from "../assets/category-south-indian.svg";
import northIndianIcon from "../assets/category-north-indian.svg";
import thaliIcon from "../assets/category-thali.svg";
import streetFoodIcon from "../assets/category-street-food.svg";
import indoChineseIcon from "../assets/category-indo-chinese.svg";
import dessertsIcon from "../assets/category-desserts.svg";
import beveragesIcon from "../assets/category-beverages.svg";
import distinctImages from "./distinctImages";

const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

export const menuCategories = [
  { category: "Biryani", icon: biryaniIcon },
  { category: "South Indian", icon: southIndianIcon },
  { category: "North Indian", icon: northIndianIcon },
  { category: "Thali & Meals", icon: thaliIcon },
  { category: "Street Food", icon: streetFoodIcon },
  { category: "Indo-Chinese", icon: indoChineseIcon },
  { category: "Desserts", icon: dessertsIcon },
  { category: "Beverages", icon: beveragesIcon },
];

// This offline catalogue mirrors catalog/indian-hotel-menu.json. It keeps the
// customer app useful before the API has been seeded, while live MongoDB data
// replaces it as soon as GET /api/foods returns items.
const fallbackFoodItems = [
  { id: "demo-hyderabadi-biryani", name: "Hyderabadi Chicken Dum Biryani", category: "Biryani", description: "Aromatic basmati, tender chicken and saffron sealed and slow-cooked the old Hyderabad way.", price: 289, imageUrl: image("photo-1631515243349-e0cb75fb8d3a") },
  { id: "demo-mutton-biryani", name: "Lucknowi Mutton Biryani", category: "Biryani", description: "Fragrant yakhni rice with succulent mutton, fried onions and warm whole spices.", price: 359, imageUrl: image("photo-1630409346824-4f0e7b080087") },
  { id: "demo-veg-biryani", name: "Garden Vegetable Biryani", category: "Biryani", description: "Seasonal vegetables, mint and toasted spices layered through fragrant basmati rice.", price: 229, imageUrl: image("photo-1589302168068-964664d93dc0") },
  { id: "demo-masala-dosa", name: "Masala Dosa & Sambar", category: "South Indian", description: "Crisp rice-lentil crepe filled with potato masala, served with sambar and coconut chutney.", price: 159, imageUrl: image("photo-1668236543090-82eba5ee5976") },
  { id: "demo-idli-vada", name: "Idli, Medu Vada & Sambar", category: "South Indian", description: "Cloud-soft idlis and golden vada with fresh chutneys and homestyle sambar.", price: 139, imageUrl: image("photo-1589301760014-d929f3979dbc") },
  { id: "demo-filter-coffee", name: "South Indian Filter Coffee", category: "South Indian", description: "Bold, frothy filter coffee brewed fresh and poured the traditional way.", price: 89, imageUrl: image("photo-1514432324607-a09d9b4aefdd") },
  { id: "demo-butter-chicken", name: "Delhi Butter Chicken", category: "North Indian", description: "Tandoori chicken folded into a silky tomato, butter and kasuri methi gravy.", price: 329, imageUrl: image("photo-1603894584373-5ac82b2ae398") },
  { id: "demo-paneer-tikka", name: "Tandoori Paneer Tikka", category: "North Indian", description: "Charred paneer, peppers and onion marinated in yoghurt and aromatic tandoori masala.", price: 279, imageUrl: image("photo-1567188040759-fb8a883dc6d8") },
  { id: "demo-dal-makhani", name: "Slow-Cooked Dal Makhani", category: "North Indian", description: "Black lentils simmered overnight with butter, cream and a gentle smoky finish.", price: 219, imageUrl: image("photo-1546833999-b9f581a1996d") },
  { id: "demo-veg-thali", name: "MasalaBox Veg Thali", category: "Thali & Meals", description: "A complete meal with dal, seasonal sabzi, paneer, rice, roti, salad and dessert.", price: 299, imageUrl: image("photo-1628294895950-9805252327bc") },
  { id: "demo-north-indian-meal", name: "Punjabi Family Meal", category: "Thali & Meals", description: "Rajma, jeera rice, two rotis, salad and a cooling raita for a hearty table.", price: 339, imageUrl: image("photo-1601050690117-94f5f6fa8bd7") },
  { id: "demo-chole-rice", name: "Amritsari Chole Rice Bowl", category: "Thali & Meals", description: "Slow-spiced chickpeas, fragrant rice, pickled onions and a spoon of cooling raita.", price: 199, imageUrl: image("photo-1585937421612-70a008356fbe") },
  { id: "demo-pav-bhaji", name: "Mumbai Pav Bhaji", category: "Street Food", description: "Buttery toasted pav with a rich, spiced vegetable bhaji and fresh lime.", price: 169, imageUrl: image("photo-1606491956689-2ea866880c84") },
  { id: "demo-samosa-chaat", name: "Samosa Chaat", category: "Street Food", description: "Crisp samosa topped with chickpeas, yoghurt, chutneys and crunchy sev.", price: 149, imageUrl: image("photo-1601050690597-df0568f70950") },
  { id: "demo-kathi-roll", name: "Kolkata Chicken Kathi Roll", category: "Street Food", description: "Paratha-wrapped chicken tikka with egg, onion, green chilli and a squeeze of lime.", price: 219, imageUrl: image("photo-1626700051175-6818013e1d4f") },
  { id: "demo-chicken-noodles", name: "Chicken Hakka Noodles", category: "Indo-Chinese", description: "Wok-tossed noodles, tender chicken, vegetables and a bright chilli-soy glaze.", price: 249, imageUrl: image("photo-1612929633738-8fe44f7ec841") },
  { id: "demo-gobi-manchurian", name: "Crispy Gobi Manchurian", category: "Indo-Chinese", description: "Crisp cauliflower tossed in a tangy garlic, ginger and spring onion sauce.", price: 199, imageUrl: image("photo-1625398407796-82650a8c135f") },
  { id: "demo-chilli-paneer", name: "Chilli Paneer Dry", category: "Indo-Chinese", description: "Soft paneer, peppers and onion coated in a glossy, punchy Indo-Chinese sauce.", price: 229, imageUrl: image("photo-1567337710282-00832b415979") },
  { id: "demo-gulab-jamun", name: "Warm Gulab Jamun", category: "Desserts", description: "Soft milk dumplings soaked in cardamom and saffron syrup, served warm.", price: 99, imageUrl: image("photo-1578985545062-69928b1d9587") },
  { id: "demo-rasmalai", name: "Kesar Rasmalai", category: "Desserts", description: "Delicate chenna discs in chilled saffron milk with pistachio and rose.", price: 149, imageUrl: image("photo-1601050690117-94f5f6fa8bd7") },
  { id: "demo-kulfi", name: "Mango Malai Kulfi", category: "Desserts", description: "Dense, creamy kulfi with ripe mango, cardamom and a pistachio finish.", price: 129, imageUrl: image("photo-1563805042-7684c019e1cb") },
  { id: "demo-mango-lassi", name: "Alphonso Mango Lassi", category: "Beverages", description: "Thick yoghurt blended with ripe mango and a delicate cardamom lift.", price: 129, imageUrl: image("photo-1626200419199-391ae4be7a41") },
  { id: "demo-masala-chai", name: "Cutting Masala Chai", category: "Beverages", description: "Strong Assam tea simmered with ginger, cardamom and a touch of jaggery.", price: 79, imageUrl: image("photo-1594631252845-29fc4cc8cde9") },
  { id: "demo-nimbu-soda", name: "Fresh Nimbu Soda", category: "Beverages", description: "Fresh lime, mint and sparkling soda with your choice of sweet or salted.", price: 89, imageUrl: image("photo-1513558161293-cdaf765ed2fd") },
  { id: "demo-kolkata-biryani", name: "Kolkata Chicken Biryani", category: "Biryani", description: "Aromatic rice, tender chicken, potato and egg in the delicate Kolkata style.", price: 299, imageUrl: image("photo-1565557623262-b51c2513a641") },
  { id: "demo-chicken-tikka-biryani", name: "Chicken Tikka Biryani", category: "Biryani", description: "Smoky chicken tikka layered with basmati rice, mint, fried onions and saffron.", price: 319, imageUrl: image("photo-1603894584373-5ac82b2ae398") },
  { id: "demo-egg-biryani", name: "Egg Biryani", category: "Biryani", description: "Spiced basmati rice with masala-coated eggs, caramelised onions and fresh herbs.", price: 199, imageUrl: image("photo-1589302168068-964664d93dc0") },
  { id: "demo-keema-biryani", name: "Keema Biryani", category: "Biryani", description: "Fragrant rice cooked with spiced minced mutton, peas, mint and whole spices.", price: 329, imageUrl: image("photo-1630409346824-4f0e7b080087") },
  { id: "demo-mutton-dum-biryani", name: "Mutton Dum Biryani", category: "Biryani", description: "Slow-cooked mutton, saffron and aged basmati sealed together for a rich dum biryani.", price: 379, imageUrl: image("photo-1565557623262-b51c2513a641") },
  { id: "demo-paneer-biryani", name: "Paneer Biryani", category: "Biryani", description: "Soft paneer, roasted vegetables and fragrant rice finished with mint and fried onions.", price: 249, imageUrl: image("photo-1585937421612-70a008356fbe") },
  { id: "demo-fish-biryani", name: "Fish Biryani", category: "Biryani", description: "Delicate fish fillet layered with coastal spices, basmati rice and lemony herbs.", price: 349, imageUrl: image("photo-1599487488170-d11ec9c172f0") },
  { id: "demo-plain-dosa", name: "Plain Dosa & Chutney", category: "South Indian", description: "Golden, crisp dosa served with coconut chutney and hot sambar.", price: 119, imageUrl: image("photo-1668236543090-82eba5ee5976") },
  { id: "demo-mysore-dosa", name: "Mysore Masala Dosa", category: "South Indian", description: "Crisp dosa spread with spicy red chutney, potato masala and fresh coconut chutney.", price: 179, imageUrl: image("photo-1668236543090-82eba5ee5976") },
  { id: "demo-rava-dosa", name: "Rava Dosa", category: "South Indian", description: "Thin, lacy semolina dosa with cumin, green chilli and a side of sambar.", price: 169, imageUrl: image("photo-1589301760014-d929f3979dbc") },
  { id: "demo-onion-uttapam", name: "Onion Uttapam", category: "South Indian", description: "Soft, fluffy uttapam topped with onion, tomato, coriander and green chilli.", price: 159, imageUrl: image("photo-1668236543090-82eba5ee5976") },
  { id: "demo-ven-pongal", name: "Ven Pongal", category: "South Indian", description: "Comforting rice and lentils tempered with pepper, cumin, ginger and ghee.", price: 139, imageUrl: image("photo-1589301760014-d929f3979dbc") },
  { id: "demo-medu-vada", name: "Medu Vada Sambar", category: "South Indian", description: "Crisp lentil doughnuts with sambar, coconut chutney and a touch of green chilli.", price: 129, imageUrl: image("photo-1589301760014-d929f3979dbc") },
  { id: "demo-pesarattu", name: "Pesarattu Upma", category: "South Indian", description: "Protein-rich green gram crepe paired with a soft, savoury upma filling.", price: 169, imageUrl: image("photo-1668236543090-82eba5ee5976") },
  { id: "demo-lemon-rice", name: "Lemon Rice", category: "South Indian", description: "South Indian rice tempered with mustard, curry leaves, peanuts and fresh lemon.", price: 129, imageUrl: image("photo-1585937421612-70a008356fbe") },
  { id: "demo-curd-rice", name: "Curd Rice", category: "South Indian", description: "Cool, creamy yoghurt rice with ginger, curry leaves, mustard and pomegranate.", price: 119, imageUrl: image("photo-1585937421612-70a008356fbe") },
  { id: "demo-chole-bhature", name: "Chole Bhature", category: "North Indian", description: "Spiced Punjabi chickpeas with fluffy bhatura, pickled onions and fresh coriander.", price: 199, imageUrl: image("photo-1601050690117-94f5f6fa8bd7") },
  { id: "demo-palak-paneer", name: "Palak Paneer", category: "North Indian", description: "Soft paneer cubes in a silky spinach gravy finished with cream and garam masala.", price: 249, imageUrl: image("photo-1567188040759-fb8a883dc6d8") },
  { id: "demo-kadai-paneer", name: "Kadai Paneer", category: "North Indian", description: "Paneer, peppers and onion tossed in a bold tomato kadai masala with crushed coriander.", price: 259, imageUrl: image("photo-1567188040759-fb8a883dc6d8") },
  { id: "demo-shahi-paneer", name: "Shahi Paneer", category: "North Indian", description: "Tender paneer in a royal cashew, tomato and cream gravy with gentle spices.", price: 269, imageUrl: image("photo-1546833999-b9f581a1996d") },
  { id: "demo-rajma-chawal", name: "Rajma Chawal", category: "North Indian", description: "Slow-cooked Kashmiri kidney beans served with steamed rice, onion and lime.", price: 199, imageUrl: image("photo-1585937421612-70a008356fbe") },
  { id: "demo-aloo-paratha", name: "Aloo Paratha", category: "North Indian", description: "Whole-wheat paratha stuffed with spiced potato, served with yoghurt, pickle and butter.", price: 149, imageUrl: image("photo-1601050690117-94f5f6fa8bd7") },
  { id: "demo-chicken-tikka", name: "Chicken Tikka", category: "North Indian", description: "Yoghurt-marinated chicken grilled in the tandoor with peppers and mint chutney.", price: 299, imageUrl: image("photo-1603894584373-5ac82b2ae398") },
  { id: "demo-rogan-josh", name: "Rogan Josh", category: "North Indian", description: "Kashmiri-style slow-braised mutton with fennel, ginger and warm whole spices.", price: 349, imageUrl: image("photo-1603894584373-5ac82b2ae398") },
  { id: "demo-amritsari-fish", name: "Amritsari Fish", category: "North Indian", description: "Crisp, gram-flour battered fish with ajwain, lemon and mint chutney.", price: 299, imageUrl: image("photo-1599487488170-d11ec9c172f0") },
  { id: "demo-garlic-naan", name: "Garlic Naan Basket", category: "North Indian", description: "Soft tandoor-baked naan brushed with garlic butter and coriander.", price: 129, imageUrl: image("photo-1601050690117-94f5f6fa8bd7") },
  { id: "demo-gujarati-thali", name: "Gujarati Kathiyawadi Thali", category: "Thali & Meals", description: "A generous thali of dal, kadhi, shaak, rotli, rice, farsan, pickle and sweet.", price: 329, imageUrl: image("photo-1599487488170-d11ec9c172f0") },
  { id: "demo-dal-baati", name: "Rajasthani Dal Baati Churma", category: "Thali & Meals", description: "Baked baati, panchmel dal, ghee-rich churma and spicy garlic chutney.", price: 349, imageUrl: image("photo-1628294895950-9805252327bc") },
  { id: "demo-mini-tiffin", name: "South Indian Mini Tiffin", category: "Thali & Meals", description: "A breakfast platter of idli, vada, mini dosa, pongal, sambar and chutney.", price: 229, imageUrl: image("photo-1589301760014-d929f3979dbc") },
  { id: "demo-chicken-meal", name: "Chicken Curry Rice Meal", category: "Thali & Meals", description: "Homestyle chicken curry with steamed rice, dal, salad and a cooling raita.", price: 279, imageUrl: image("photo-1603894584373-5ac82b2ae398") },
  { id: "demo-paneer-meal", name: "Paneer Rice Meal", category: "Thali & Meals", description: "Paneer curry, jeera rice, dal fry, two rotis and a fresh seasonal salad.", price: 249, imageUrl: image("photo-1585937421612-70a008356fbe") },
  { id: "demo-vada-pav", name: "Mumbai Vada Pav", category: "Street Food", description: "Spiced potato vada tucked into a toasted pav with garlic chutney and fried chilli.", price: 99, imageUrl: image("photo-1606491956689-2ea866880c84") },
  { id: "demo-pani-puri", name: "Pani Puri", category: "Street Food", description: "Crisp puris filled with spiced potato, tangy tamarind water and fresh mint pani.", price: 119, imageUrl: image("photo-1601050690597-df0568f70950") },
  { id: "demo-dahi-puri", name: "Dahi Puri", category: "Street Food", description: "Crisp puris layered with potato, yoghurt, sweet chutney, sev and masala.", price: 139, imageUrl: image("photo-1601050690597-df0568f70950") },
  { id: "demo-bhel-puri", name: "Bhel Puri", category: "Street Food", description: "Puffed rice, sev, vegetables and chutneys tossed into Mumbai's favourite snack.", price: 119, imageUrl: image("photo-1601050690597-df0568f70950") },
  { id: "demo-aloo-tikki", name: "Aloo Tikki Chaat", category: "Street Food", description: "Crisp potato patties with chickpeas, yoghurt, tamarind chutney and sev.", price: 149, imageUrl: image("photo-1601050690597-df0568f70950") },
  { id: "demo-delhi-chaat", name: "Delhi Aloo Chaat", category: "Street Food", description: "Crisped potatoes with chaat masala, lime, coriander and sweet-spicy chutneys.", price: 139, imageUrl: image("photo-1601050690597-df0568f70950") },
  { id: "demo-amritsari-kulcha", name: "Amritsari Kulcha", category: "Street Food", description: "Stuffed, tandoor-baked kulcha with chole, onion salad and tangy pickle.", price: 179, imageUrl: image("photo-1601050690117-94f5f6fa8bd7") },
  { id: "demo-keema-pav", name: "Keema Pav", category: "Street Food", description: "Mumbai-style spiced minced mutton served with buttery pav and chopped onion.", price: 229, imageUrl: image("photo-1603894584373-5ac82b2ae398") },
  { id: "demo-veg-noodles", name: "Veg Hakka Noodles", category: "Indo-Chinese", description: "Wok-tossed noodles with crunchy vegetables, garlic, soy and spring onion.", price: 199, imageUrl: image("photo-1612929633738-8fe44f7ec841") },
  { id: "demo-chicken-fried-rice", name: "Chicken Fried Rice", category: "Indo-Chinese", description: "Fluffy wok-fried rice with egg, chicken, vegetables and savoury chilli-soy seasoning.", price: 239, imageUrl: image("photo-1612929633738-8fe44f7ec841") },
  { id: "demo-schezwan-rice", name: "Schezwan Fried Rice", category: "Indo-Chinese", description: "Spicy wok-fried rice with vegetables, garlic and bold Schezwan chilli sauce.", price: 219, imageUrl: image("photo-1612929633738-8fe44f7ec841") },
  { id: "demo-chicken-manchurian", name: "Chicken Manchurian", category: "Indo-Chinese", description: "Crisp chicken tossed in a glossy Manchurian sauce with ginger, garlic and spring onion.", price: 269, imageUrl: image("photo-1625398407796-82650a8c135f") },
  { id: "demo-spring-rolls", name: "Veg Spring Rolls", category: "Indo-Chinese", description: "Crisp rolls filled with cabbage, carrot, peppers and aromatic wok seasoning.", price: 179, imageUrl: image("photo-1625398407796-82650a8c135f") },
  { id: "demo-chopsuey", name: "American Chopsuey", category: "Indo-Chinese", description: "Crisp noodles topped with tangy vegetables, tomato sauce and a fried egg.", price: 229, imageUrl: image("photo-1612929633738-8fe44f7ec841") },
  { id: "demo-jalebi-rabri", name: "Jalebi Rabri", category: "Desserts", description: "Crisp saffron jalebi paired with thick, chilled rabri and pistachio.", price: 149, imageUrl: image("photo-1515003197210-e0cd71810b5f") },
  { id: "demo-kaju-katli", name: "Kaju Katli", category: "Desserts", description: "Silky cashew fudge finished with silver leaf and a delicate cardamom aroma.", price: 169, imageUrl: image("photo-1515003197210-e0cd71810b5f") },
  { id: "demo-gajar-halwa", name: "Gajar Ka Halwa", category: "Desserts", description: "Slow-cooked carrots with milk, khoya, cardamom and toasted nuts.", price: 139, imageUrl: image("photo-1515003197210-e0cd71810b5f") },
  { id: "demo-shahi-tukda", name: "Shahi Tukda", category: "Desserts", description: "Golden bread, saffron rabri, rose syrup and pistachio in a royal Indian dessert.", price: 159, imageUrl: image("photo-1515003197210-e0cd71810b5f") },
  { id: "demo-mishti-doi", name: "Mishti Doi", category: "Desserts", description: "Traditional Bengali sweet yoghurt with a gentle caramel sweetness.", price: 109, imageUrl: image("photo-1571115177098-24ec42ed204d") },
  { id: "demo-moong-halwa", name: "Moong Dal Halwa", category: "Desserts", description: "Rich roasted moong dal halwa with ghee, saffron and slivered almonds.", price: 149, imageUrl: image("photo-1515003197210-e0cd71810b5f") },
  { id: "demo-mango-shrikhand", name: "Mango Shrikhand", category: "Desserts", description: "Hung yoghurt blended with Alphonso mango, saffron and cardamom.", price: 139, imageUrl: image("photo-1571115177098-24ec42ed204d") },
  { id: "demo-modak", name: "Coconut Modak", category: "Desserts", description: "Steamed rice-flour modak filled with coconut, jaggery and cardamom.", price: 129, imageUrl: image("photo-1515003197210-e0cd71810b5f") },
  { id: "demo-rose-lassi", name: "Rose Lassi", category: "Beverages", description: "Creamy yoghurt lassi perfumed with rose, cardamom and crushed pistachio.", price: 119, imageUrl: image("photo-1626200419199-391ae4be7a41") },
  { id: "demo-chaas", name: "Salted Chaas", category: "Beverages", description: "Refreshing buttermilk with roasted cumin, coriander, ginger and black salt.", price: 79, imageUrl: image("photo-1626200419199-391ae4be7a41") },
  { id: "demo-badam-milk", name: "Badam Milk", category: "Beverages", description: "Chilled almond milk with saffron, cardamom and a little natural sweetness.", price: 109, imageUrl: image("photo-1626200419199-391ae4be7a41") },
  { id: "demo-jaljeera", name: "Jaljeera", category: "Beverages", description: "Tangy cumin, mint and tamarind cooler with a bright, refreshing finish.", price: 79, imageUrl: image("photo-1513558161293-cdaf765ed2fd") },
  { id: "demo-thandai", name: "Thandai", category: "Beverages", description: "Festive milk cooler with almonds, fennel, pepper, rose and fragrant spices.", price: 129, imageUrl: image("photo-1626200419199-391ae4be7a41") },
  { id: "demo-sugarcane", name: "Fresh Sugarcane Juice", category: "Beverages", description: "Pressed-to-order sugarcane juice with ginger, lime and a pinch of black salt.", price: 99, imageUrl: image("photo-1513558161293-cdaf765ed2fd") },
  { id: "demo-falooda", name: "Rose Falooda", category: "Beverages", description: "Chilled rose milk with basil seeds, vermicelli, ice cream and pistachio.", price: 169, imageUrl: image("photo-1626200419199-391ae4be7a41") },
  { id: "demo-cold-coffee", name: "Cold Coffee", category: "Beverages", description: "Creamy chilled coffee blended with milk, cocoa and a scoop of vanilla ice cream.", price: 139, imageUrl: image("photo-1514432324607-a09d9b4aefdd") },
];

// Keep the offline catalogue aligned with the live seed manifest. Every food
// gets its own photo rather than sharing one category placeholder.
export const fallbackFoods = fallbackFoodItems.map((food, index) => ({
  ...food,
  imageUrl: distinctImages[index] || food.imageUrl,
}));
