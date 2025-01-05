import { NextResponse } from "next/server";
import db from "@/db/db";
import { product } from "@/db/appSchema";
import { productSchema } from "@/lib/validations/ProductSchema";

import { sql } from "drizzle-orm";






export async function GET() {
    const shops = await findMany();
    return NextResponse.json(shops);
}
