import { MetaFields } from "./Field"

export const SEARCH_PRODUCTS_BY_TITLE = () => `{
    products(first : 20, query : "title:SEARCHTERM*"){
                edges{
                  node{
                    id
                    title
                    handle
                    status
                    variants_products: metafield(namespace: "custom", key: "testing_product_variants") {
                      key
                      value
                    }
                    variants_swatch: metafield(namespace: "custom", key: "testing_product_swatchs") {
                      key
                      value
                    }
                    images(first: 1) {
                      edges {
                        node {
                          originalSrc
                          altText
                        }
                      }
                    }
  
                  }
                }
          }
  }`

export const SEARCH_PRODUCTS_BY_IDS = (ids) => {
  let collectIds = ''
  ids.forEach((elem, index, array) => {
    collectIds += `"${elem.id}"`
    if (index !== array.length - 1) {
      collectIds += ','
    }
  })

  const query = `{
        nodes(ids: [${collectIds}]) {
        ... on Product {
            title
            handle
            id
            status
            variants_products: metafield(namespace: "${MetaFields[0].namespace}", key: "${MetaFields[0].name}") {
                key
                value
            }
            variants_swatch: metafield(namespace: "${MetaFields[1].namespace}", key: "${MetaFields[1].name}") {
                key
                value
            }
            seen_in: metafield(namespace: "${MetaFields[2].namespace}", key: "${MetaFields[2].name}") {
              key
              value
            }
            product_grid_paragraph: metafield(namespace: "${MetaFields[3].namespace}", key: "${MetaFields[3].name}") {
              key
              value
            }
            product_grid_heading: metafield(namespace: "${MetaFields[4].namespace}", key: "${MetaFields[4].name}") {
              key
              value
            }
            product_grid_image: metafield(namespace: "${MetaFields[5].namespace}", key: "${MetaFields[5].name}") {
              key
              value
            }
            images(first: 1) {
                edges {
                node {
                    originalSrc
                    altText
                }
                }
            }
          }
    }
}
        `
  return query
}


export const GETMEDIAS = () => `query {
  files(first:250) {
    edges {
      node {
        ... on GenericFile {
          id
        }
        ... on MediaImage {
          id
          image {
            id
            originalSrc: url
          }
        }
       
      }
    }
  }
}
`

  export const updateMetaFields = ()=> `
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          # Metafield fields
          key
          id
          legacyResourceId
          value
          type
        }
        userErrors {
          field
          message
        }    
      }
    }
  `

  // mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
  //   metafieldsSet(metafields: $metafields) {
  //     metafields {
  //       # Metafield fields
  //     }
  //     userErrors {
  //       field
  //       message
  //     }
  //   }
  // }