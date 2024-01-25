import { getServerSession } from "next-auth";
import dbConnect from "../../../../db/connect";
import Place from "../../../../db/models/Place";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  await dbConnect();
  const session = await getServerSession(request, response, authOptions);

  const { id } = request.query;

  if (request.method === "GET") {
    const place = await Place.findById(id);

    if (!place) {
      response.status(404).json({ status: "Not found" });
      return;
    }

    response.status(200).json(place);
    return;
  }

  if (!session) {
    response.status(401).json({ status: "Not Authorized!" });
    return;
  }

  if (request.method === "PATCH") {
    const placeToUpdate = await Place.findByIdAndUpdate(id, {
      $set: request.body,
    });
    response.status(200).json(placeToUpdate);
    return;
  }

  if (request.method === "DELETE") {
    const placeToDelete = await Place.findByIdAndDelete(id);
    response.status(200).json(placeToDelete);
    return;
  }

  response.status(405).json({ message: "Method not allowed" });
}
