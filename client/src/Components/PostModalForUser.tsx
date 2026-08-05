import React from 'react'
import "./postModalForUser.scss"
import type { UserPostData } from '../admin/Interfaces/interface';
import Button from './Button';

 interface PostModalForUserProps {
  post: UserPostData | null;
  isOpen: boolean;
  onClose: () => void;
}
const PostModalForUser = ({post,isOpen,onClose}:PostModalForUserProps) => {
      if (!isOpen || !post) return null;
  return (
    <div className="user-modal-overlay" onClick={onClose}>

  <div className="user-modal" onClick={(e)=>e.stopPropagation()}>

    <Button className='handleClose' onClick={onClose}>×</Button>
  <span className={`${post.category === "Travel"?"travelCategoryBadge":post.category ==="Food"?"FoodCategoryBadge":"RelaxCategoryBadge"}`}>
    {post.category ==="Travel"?"Travel":post.category === "Food"?"Food":"Relax"}
  </span>

    <img src={post.image}/>

    <div className="modal-body">
      <h2>{post.title}</h2>

      <div className="info">
        ⭐ {post.rating}
        📍 {post.location.city} , {post.location.country}
      </div>

      <div className="stats">
        ❤️ Likes {post.likesCount}
        👁 Views {post.viewsCount}
        💬 Comments {post.commentCount}
      </div>

      <p>{post.description}</p>

      <div className="footer">
        📅 Date {new Date(post.createdAt).toLocaleDateString()}

        <button>
          Book Now
        </button>
      </div>

    </div>

  </div>

</div>
  )
}

export default PostModalForUser