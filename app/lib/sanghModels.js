import mongoose from "mongoose";

const { Schema } = mongoose;

/* =========================
   STHARA (Vibhag, Bhag, etc)
========================= */
const stharaSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});

export const Sthara =
  mongoose.models.Sthara || mongoose.model("Sthara", stharaSchema);


/* =========================
   ENTITY (Actual values)
========================= */
const entitySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sthara: {
    type: Schema.Types.ObjectId,
    ref: "Sthara",
    required: true
  }
});

export const Entity =
  mongoose.models.Entity || mongoose.model("Entity", entitySchema);


/* =========================
   PARENT RELATION (Hierarchy)
========================= */
const parentEntitySchema = new Schema({
  currentEntity: {
    type: Schema.Types.ObjectId,
    ref: "Entity",
    required: true
  },
  parentEntity: {
    type: Schema.Types.ObjectId,
    ref: "Entity",
    required: true
  }
});

export const ParentEntity =
  mongoose.models.ParentEntity ||
  mongoose.model("ParentEntity", parentEntitySchema);