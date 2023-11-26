import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  //   const bodyContent = new FormData();
  //   bodyContent.append("mergemap_file_name", "2023_11_07_10_33_57_today44");
  //   try {
  //     const response = await fetch("http://192.168.2.114:5001/map/getmergemap", {
  //       method: "POST",
  //       body: bodyContent,
  //     });
  //     const data = await response.blob(); // Get the image data as a Blob
  //     return new Response(data, { headers: { "Content-Type": "image/png" } }); // Return the image data as the response with the appropriate Content-Type header
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Internal Server Error");
  //   }
}
