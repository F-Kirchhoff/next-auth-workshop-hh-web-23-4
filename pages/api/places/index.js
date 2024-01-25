import dbConnect from "../../../db/connect";
import Place from "../../../db/models/Place";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    const places = await Place.find();
    response.status(200).json(places);
    return;
  }

  if (request.method === "POST") {
    try {
      const placeData = request.body;
      const place = new Place(placeData);
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
