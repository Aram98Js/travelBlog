
// For Backend Side


export type FoodFormData = {
  title: string,
  short_description: string,
  description: string,
  price: number,
    location:{
    city:string,
    country:string
  },
  rating:number
}


export type TravelFormData = {
  title: string,
  short_description: string,
  description: string,
  price: number,
  location:{
    city:string,
    country:string
  },
  rating:number
}

export type GetFoodData = {
  _id:string
 title: string,
 user:{
  _id:string,
  username:string,
  email?:string
 }
  short_description: string,
  description: string ,
  price:number
  image:string,

    location:{
    city:string,
    country:string
  },
  rating:number,
  likesCount:number,
  viewsCount:number,
  createdAt: string,
  updatedAt: string

}
export type GetTravelData = {
  _id: string
 title: string,
  user:{
  _id:string,
  username:string,
  email?:string
 }
  short_description: string,
  price: number,
  description: string 
  image:string,

  location:{
    city:string,
    country:string
  },
  rating:number,
  likesCount:number,
  viewsCount:number,
  createdAt: string,
  updatedAt: string
}


export type RelaxFormData = {
  title: string,
  short_description: string,
  description: string,
  price:number,
  location:{
    city:string,
    country:string
  },
  rating:number
}
export type GetRelaxData = {
  _id: string
 title: string,
  user:{
  _id:string,
  username:string,
  email?:string
 }
  short_description: string,
  description: string ,
  price: number,
  image:string,
    location:{
    city:string,
    country:string
  },
  rating:number,
  likesCount:number,
  viewsCount:number,
  createdAt: string,
  updatedAt: string
}

export type Post = {
    _id:string;
    title:string
      user:{
  _id:string,
  username:string,
  email?:string
 }
    image:string;
    short_description:string;
    description:string;
    category:"Travel" | "Food" | "Relax";
    createdAt:string;
updatedAt:string;
likesCount: number,
viewsCount: number,
commentCount: number
location: {
  city: string,
  country: string
}
rating: number
}

export type DashboardActivity = {
    _id:string;
    type:"Travel" | "Food" | "Relax";
    action:"Created" | "Updated" | "Deleted";
    title:string;
    createdAt:string;
}


export type DashboardData = {

    totalPosts:number;

    stats:{
        travel:number;
        food:number;
        relax:number;
    };



    posts:{
        travel:Post[];
        food:Post[];
        relax:Post[];
    };


    activity:{
        id:string,
        type: string,
        action: string,
        title: string,
        createdAt:string;
    }[];

}

// For Frontend Side

export interface DataURL{
  id: number,
  path: string
  imgUrl: string,
  pathName: string
}


//for user page Modal type
export interface UserPostData {
 _id:string;
 title:string;
 description:string;
 image:string;
 location:{
   city:string;
   country:string;
 };
 rating:number;
 likesCount:number;
 viewsCount:number;
 commentCount:number;
 createdAt:string;
 category:string;
}