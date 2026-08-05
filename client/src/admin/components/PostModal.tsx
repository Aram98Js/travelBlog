import type { GetFoodData } from "../Interfaces/interface";
import './postModal.scss'
interface PostModalProps {
  post: GetFoodData | null;
  isOpen: boolean;
  onClose: () => void;
}

const PostModal = ({post,isOpen,onClose}: PostModalProps) => {
    if (!isOpen && !post) return null;

  return (
        <div className="modal-overlay" onClick={onClose}>

      <div 
        className="post-modal"
        onClick={(e)=>e.stopPropagation()}
      >

        <button 
          className="close-btn"
          onClick={onClose}
        >
          ×
        </button>


        <img 
          src={post?.image}
          alt={post?.image}
        />


        <div className="modal-content">
          <h2>
            {post?.title}
          </h2>


          <p>
            {post?.description}
          </p>


          <small>
            {post?.createdAt && new Date(post?.createdAt).toLocaleDateString()}
          </small>

        </div>

      </div>

    </div>
  )
}

export default PostModal