import dbConnect from "../../../db/connect";
import Place from "../../../db/models/Place";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  await dbConnect();
  const session = await getServerSession(request, response, authOptions);

  if (request.method === "GET") {
    const places = await Place.find();
    response.status(200).json(places);
    return;
  }

  if (!session) {
    response.status(401).json({ status: "Not Authorized!" });
    return;
  }

  if (request.method === "POST") {
    try {
      const placeData = request.body;
      const newPlace = {
        ...placeData,
        author: session.user,
      };
      const place = new Place(newPlace);
      await place.save();
      response.status(201).json({ status: "Place created" });
    } catch (error) {
      console.error(error);
      response.status(400).json({ error: error.message });
    }
    return;
  }

  response.status(405).json({ message: "Method not allowed" });
}
