import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./ListFood.css";
import { deleteFood, getFoodList } from "../../services/foodService";

const ListFood = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const data = await getFoodList();
      setList(data);
    } catch {
      toast.error("Error fetching food list");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const success = await deleteFood(foodId);
      if (success) {
        toast.success("Food item deleted successfully");
        await fetchList();
      } else {
        toast.error("Error occurred while deleting food item");
      }
    } catch {
      toast.error("Error occurred while deleting food item");
    }
  };

  useEffect(() => {
    void fetchList();
  }, []);

  return (
    <div>
      <div className="page-heading">
        <div><p className="eyebrow">Menu management</p><h1>List Food</h1><p>Everything on your menu, in one lovely place.</p></div>
        <Link to="/add" className="admin-button button-red"><i className="bi bi-plus-lg" aria-hidden="true" /> <span>Add food</span></Link>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><span className="stat-icon"><i className="bi bi-grid" aria-hidden="true" /></span><div><p>Menu items</p><strong>{isLoading ? "—" : list.length}</strong></div></div>
        <div className="stat-card"><span className="stat-icon stat-icon--yellow"><i className="bi bi-stars" aria-hidden="true" /></span><div><p>Categories</p><strong>{isLoading ? "—" : new Set(list.map((item) => item.category)).size}</strong></div></div>
        <div className="stat-card"><span className="stat-icon stat-icon--green"><i className="bi bi-image" aria-hidden="true" /></span><div><p>With images</p><strong>{isLoading ? "—" : list.filter((item) => item.imageUrl).length}</strong></div></div>
      </div>
      <section className="admin-panel">
        <div className="panel-heading"><div><h2>Your menu</h2><p>Manage dishes customers can order right now.</p></div><span className="panel-step">03</span></div>
        {isLoading ? <div className="empty-state"><div className="empty-state-icon"><i className="bi bi-arrow-repeat spin" aria-hidden="true" /></div><h3>Loading your menu</h3><p>We’re bringing your dishes into view.</p></div> : list.length === 0 ? <div className="empty-state"><div className="empty-state-icon"><i className="bi bi-egg-fried" aria-hidden="true" /></div><h3>Your menu is ready for its first dish</h3><p>Add a delicious item and it will appear here for customers to discover.</p><Link to="/add" className="admin-button button-red"><i className="bi bi-plus-lg" aria-hidden="true" /> Add your first food</Link></div> : <>
          <div className="table-scroll"><table className="admin-table food-table"><thead><tr><th>Food</th><th>Category</th><th>Price</th><th className="align-right">Action</th></tr></thead><tbody>
            {list.map((item) => <tr key={item.id}><td><div className="food-cell"><img src={item.imageUrl} alt="" /><div><strong>{item.name}</strong><small>{item.description || "A Masalabox favourite"}</small></div></div></td><td><span className="category-badge">{item.category}</span></td><td className="price-cell">₹{Number(item.price).toFixed(2)}</td><td className="align-right"><button className="delete-button" onClick={() => removeFood(item.id)} aria-label={`Delete ${item.name}`}><i className="bi bi-trash3" aria-hidden="true" /></button></td></tr>)}
          </tbody></table></div><div className="table-footer">Showing <strong>{list.length}</strong> {list.length === 1 ? "item" : "items"} on your live menu.</div>
        </>}
      </section>
    </div>
  );
};
export default ListFood;
