
export const MetaFields = [
    { namespace: "custom", name: "testing_product_variants" },
    { namespace: "custom", name: "testing_product_swatchs" },
    { namespace: "custom", name: "testing_seen_in" },
    { namespace: "custom", name: "testing_product_grid_paragraph" },
    { namespace: "custom", name: "testing_product_grid_heading" },
    { namespace: "custom", name: "tesing_product_grid_image" },
    { namespace: "custom", name: "review_section" },
  ];
  
  /**
   * product vaiant
   */
  
  export const fieldReview_Section = (id, value) => {
    let field = {
      key: "review_section",
      namespace: "custom",
      ownerId: id,
      type: "multi_line_text_field",
      value: value,
    };
    return field;
  };
  
  /**
   * product vaiant
   */
  
  export const fieldProductVariant = (id, value) => {
    let field = {
      key: "testing_product_variants",
      namespace: "custom",
      ownerId: id,
      type: "single_line_text_field",
      value: value,
    };
    return field;
  };
  
  /**
   * product Swatches
   */
  
  export const fieldProductSwatch = (id, value) => {
    return {
      key: "testing_product_swatchs",
      namespace: "custom",
      ownerId: id,
      type: "single_line_text_field",
      value: value,
    };
  };
  
  /**
   * product Swatches
   */
  
  export const fieldProductSeenIn = (id, value) => {
    return {
      key: "testing_seen_in",
      namespace: "custom",
      ownerId: id,
      type: "list.file_reference",
      value: value,
    };
  };
  
  /**
   * product Seen In
   */
  
  export const fieldProductParagraph = (id, value) => {
    return {
      key: "testing_product_grid_paragraph",
      namespace: "custom",
      ownerId: id,
      type: "multi_line_text_field",
      value: value,
    };
  };
  
  /**
   * product Heading
   */
  
  export const fieldProductHeading = (id, value) => {
    return {
      key: "testing_product_grid_heading",
      namespace: "custom",
      ownerId: id,
      type: "single_line_text_field",
      value: value,
    };
  };
  
  /**
   * product Heading
   */
  
  export const fieldProductGridImage = (id, value) => {
    return {
      key: "tesing_product_grid_image",
      namespace: "custom",
      ownerId: id,
      type: "file_reference",
      value: value,
    };
  };
  
  // sample code below
  /*
  {
      "metafields" : [
          {
          "key": "testing_product_variants",
          "namespace" : "custom",
          "ownerId": "gid://shopify/Product/8043811176750",
          "type": "single_line_text_field",
          "value": "/products/tina-baguette-mini-pebble-ruched-poppy /products/tina-baguette-mini-pebble-ruched-lilac"
        },
        {
          "key": "testing_product_swatchs",
          "namespace": "custom",
          "ownerId": "gid://shopify/Product/8043811176750",
          "type": "single_line_text_field",
          "value": "Ana_Mini_Convertible.png Elizabeth_Baguette.jpg"
        },
        {
          "key": "testing_product_grid_paragraph",
          "namespace": "custom",
          "ownerId": "gid://shopify/Product/8043811176750",
          "type": "multi_line_text_field",
          "value": "testing"
        },
        {
            "key": "testing_product_grid_heading",
            "namespace": "custom",
            "ownerId": "gid://shopify/Product/8043811176750",
            "type": "single_line_text_field",
            "value": "testing heading"
        },
        {
          "key": "tesing_product_grid_image",
          "namespace": "custom",
          "ownerId": "gid://shopify/Product/8043811176750",
          "type": "file_reference",
          "value": "gid://shopify/MediaImage/32375737483566"
        },
        {
          "key": "testing_seen_in",
          "namespace": "custom",
          "ownerId": "gid://shopify/Product/8043811176750",
          "type": "list.file_reference",
          "value": "[\"gid://shopify/MediaImage/32375737483566\",\"gid://shopify/MediaImage/32375738204462\",\"gid://shopify/MediaImage/32375738401070\"]"
            }
      ]
    }
    */
  