// If you have the recommended extension installed, create a new page and type `createclientgql` to generate GraphQL provider endpoint boilerplate

import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { client } = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: true,
      });
      const shop = await client.query({ data: `{shop{name}}`  });
      
      return res.status(200).send({ text: shop.body.data.shop.name });
    } catch (e) {
      console.error(`---> An error occured`, e);
      return res.status(400).send({ text: "Bad request" });
    }
  } else if (req.method === "POST") {
   
    try {
      const { client } = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: true,
      });

      let gplQuery = req.body
      if(gplQuery == '')
        throw new Error("inavild gql query..")

      const response = await client.query({data : (gplQuery.content)});
      return res.status(200).send({ text: response, status : 200 });

    } catch (error) {
      console.error(`---> An error occured`, error);
      return res.status(400).send({ status : 400,  text: error });
    }

  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

export default withMiddleware("verifyRequest")(handler);
