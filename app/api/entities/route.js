import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { Sthara, Entity, ParentEntity } from "@/app/lib/sanghModels";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const stharaName = searchParams.get("sthara");
    const parentId = searchParams.get("parentId");

    // ✅ DB connection (safe)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "");
    }

    // ✅ Find sthara
    const sthara = await Sthara.findOne({ name: stharaName });

    if (!sthara) {
      return NextResponse.json([]);
    }

    // =========================
    // FIRST LEVEL (Vibhag etc)
    // =========================
    if (!parentId) {
      const entities = await Entity.find({ sthara: sthara._id })
        .sort({ name: 1 })
        .select("_id name"); // ✅ only send needed data

      return NextResponse.json(entities);
    }

    // =========================
    // CHILD LEVELS (Bhag, Nagar...)
    // =========================
    const relations = await ParentEntity.find({
      parentEntity: parentId,
    }).populate({
      path: "currentEntity",
      match: { sthara: sthara._id },
      select: "_id name", // ✅ only required fields
    });

    const result = relations
      .map((r) => r.currentEntity)
      .filter(Boolean);

    return NextResponse.json(result);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}