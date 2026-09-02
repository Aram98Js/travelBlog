import mongoose from "mongoose";


const saveSchema = new mongoose.Schema({
        user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
post: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  refPath: "category"
},
category: {
  type: String,
  enum: ["Travel", "Food", "Relax"],
  required: true
}
},{
    timestamps: true
}

)
saveSchema.index(
  { user: 1, post: 1 },
  { unique: true }
);
const saveModel = mongoose.model("Save",saveSchema);
export default saveModel