import React, { Fragment, useState } from "react";
import Button from "./Button";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import type { Post, UserPostData } from "../admin/Interfaces/interface";
import './PostCard.scss'

import PostModalForUser from "../Components/PostModalForUser"

interface PostCardProps {
  post: Post;
  likeFunc: (id: string, path: string) => void;
    
}

interface TextArea{
  textArea: string;
}

const PostCard = ({post,likeFunc}: PostCardProps) => {
const [openModalData,setOPenModalData] = useState<UserPostData | null>(null);
const [openModal,setOpenModal] = useState<boolean>(false) 
const [textAreaData,setTextAreaData] = useState<TextArea>({
textArea: ""
})



const sendComment = async (id:string)=>{



const token = localStorage.getItem("accessToken");


const response = await fetch(`http://localhost:3000/comment/post/${id}`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
text:textAreaData.textArea,
category: post.category
})

});


const data = await response.json();

console.log(data);


setTextAreaData({
textArea:""
});

}

const handleViewCount =  async ( id: string,category:"Food" | "Travel" | "Relax")=>{
  const response = await fetch(`http://localhost:3000/post/view/${category}/${id}`,{
    method:"PATCH"
  });
  const data = await response.json();
  console.log(data);
  
}

const handleCommentChange = (evt:React.ChangeEvent<HTMLTextAreaElement>)=>{
  setTextAreaData({
    ...textAreaData,
    textArea: evt.target.value
  })
}

const handleOpenModal = (post: UserPostData)=>{
  setOPenModalData(post);
setOpenModal(true)
}

const handleCloseModal = ()=>{
  setOPenModalData(null);
  setOpenModal(false)
}
  return (

    <Fragment>
      <div className="post-card">

  <div className="post-image">
    <img src={post.image} alt=""/>

    <span className="category">
      {post.category}
    </span>
  </div>


  <div className="post-content">

    <div className="post-author">

      <img src="/avatar.png" alt="Admin"/>

      <div className="author-info">
        <h4>{post.user.username}</h4>

        <span>
          {new Date(post.updatedAt)
          .toLocaleDateString()}
        </span>
      </div>

    </div>



    <h2 className="post-title">
      {post.title}
    </h2>



    <p className="post-description">
      {post.description}
    </p>



    <div className="post-footer">

      <div className="post-stats">

        <span>
          👁 {post.viewsCount}
        </span>

        <span>
          💬 {post.commentCount}
        </span>

      </div>


      <Button
        className="like-btn"
        onClick={()=>
          likeFunc(post._id,post.category)
        }
      >
        ♡ {post.likesCount}
      </Button>


    </div>



    <CommentList
      postId={post._id}
    />



    <div className="comment-box">

      <CommentForm
        value={textAreaData.textArea}
        onChange={handleCommentChange}
      />


<div className="buttonBlock">
  <Button
        className="sendCommentBtn"
        onClick={() => sendComment(post._id)}
      >
        Send Comment
      </Button>
      <Button onClick={()=> {
         handleViewCount(post._id,post.category);
         handleOpenModal(post)
      }} className="ViewButton">View </Button>
</div>

    

    </div>


  </div>

</div>
<PostModalForUser 
  isOpen={openModal}
  post={openModalData}
  onClose={handleCloseModal}
/>
    </Fragment>
 
  );
};

export default PostCard;