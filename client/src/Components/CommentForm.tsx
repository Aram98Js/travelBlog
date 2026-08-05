import React from 'react'
import "./commentFom.scss"




interface TextAreaData{
onChange:(evt:React.ChangeEvent<HTMLTextAreaElement>)=>void,
value: string,

}

const CommentForm = ({onChange,value}:TextAreaData) => {
  return (

  
    <textarea onChange={onChange} value={value} name="text"  />


  )
}

export default CommentForm