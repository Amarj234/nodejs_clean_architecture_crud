import { Document, model, Model, Schema } from "mongoose";

const modelName = "users";

type UserSourceModel = Model<IUser>;


 interface IUser extends Document {
    name: string;
    email: string;
    age?: number;
    password: string;
    role: "user" | "admin";
  }
  
  // Define User Schema
  const UserSchema= new Schema<IUser>(
    {
      name: { type: String, required: [true, "Name is required"], trim: true },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true, 
        lowercase: true, 
        trim: true, 
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"] // Regex for validation
    },
    age: { 
      type: Number, 
      required: [true, "Age is required"], 
      validate: [
        {
            validator: function (this: IUser, value: number) {
                if (this.role === "admin" && value < 30) {
                    throw new Error("Admins must be at least 30 years old.");
                }
                if (this.role === "user" && value >= 20) {
                    throw new Error("Users must be younger than 20 years old.");
                }
                return true;
            }
        }
    ]
  },
    password: { type: String, required: [true, "Password is required"], minlength: [6, "Password must be at least 6 characters"] },
    role: { type: String, enum: ["admin", "user"],  required: true  }
    },
    { timestamps: true }
  );
  
  const LeadSourceUser = model<IUser, UserSourceModel>(
      modelName,
      UserSchema
  );
  // Export User model

  export { IUser, LeadSourceUser, UserSourceModel };

